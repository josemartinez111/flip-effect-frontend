// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > APPROVAL-MODULE > INFRASTRUCTURE
// > APPROVAL_SOURCES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import ky from 'ky';
import { extractText, getDocumentProxy } from 'unpdf';
import type { WorkerEnv } from '@shared-module/worker-env';
import { Utils } from '@shared-module/utils';
import type {
	ApprovalPoll,
	ApprovalRating,
} from '@approval-module/domain/approvalModel';
import type {
	ApnorcProject,
	NytPollsResponse,
} from '@approval-module/domain/approvalUpstreamModel';
import {
	APNORC_ECONOMY_ROW_REGEX,
	APNORC_MAX_PROJECTS_TO_SCAN,
	APNORC_PROJECT_QUERY,
	APNORC_SOURCE_LABEL,
	APNORC_TOPLINE_PDF_MARKER,
	NYT_RECENT_WINDOW_DAYS,
	NYT_SELECT_ONLY,
	NYT_SOURCE_LABEL,
} from '@approval-module/domain/approvalConstants';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- TRUMP OVERALL (NYT polls JSON, keyless) ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// NYT's newest page is sorted by end_date; we keep only is_select polls (their reliability screen) inside the
// recent window, then average. Averaging the select subset drops the GOP-leaning houses that pull a raw mean high.
// ---
export const fetchNytTrump = async (
	env: WorkerEnv,
): Promise<ApprovalRating> => {
	const upstream = await ky
		.get(env.NYT_APPROVAL_URL)
		.json<NytPollsResponse>();

	const cutoffMs =
		Date.now() - NYT_RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

	const recent = upstream.polls
		.filter((poll) => (NYT_SELECT_ONLY ? poll.is_select : true))
		.map((poll): ApprovalPoll | undefined => {
			const approve = poll.results.find(
				(result) => result.answer === 'Approve',
			)?.pct;
			const disapprove = poll.results.find(
				(result) => result.answer === 'Disapprove',
			)?.pct;

			if (approve === undefined || disapprove === undefined) {
				return undefined;
			}

			const row: ApprovalPoll = {
				pollster: poll.pollster,
				approve,
				disapprove,
				date: poll.end_date,
			};

			return row;
		})
		.filter((row): row is ApprovalPoll => row !== undefined)
		.filter((row) => Date.parse(row.date) >= cutoffMs)
		.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	if (recent.length === 0) {
		throw new Error('NYT returned no recent select trump approval polls.');
	}

	const approveAvg =
		recent.reduce((sum, row) => sum + row.approve, 0) / recent.length;
	const disapproveAvg =
		recent.reduce((sum, row) => sum + row.disapprove, 0) / recent.length;

	const rating: ApprovalRating = {
		approvalType: 'trump',
		approve: Math.round(approveAvg * 10) / 10,
		disapprove: Math.round(disapproveAvg * 10) / 10,
		polls: recent,
		source: NYT_SOURCE_LABEL,
		fetchedAt: new Date().toISOString(),
	};

	return rating;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- ECONOMY (AP-NORC WordPress → topline PDF, keyless) ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Discover the newest approval project via the WordPress API, open its page, follow the topline PDF,
// extract its text with unpdf, and read the "The economy" row. Scan a few projects because not every
// monthly topline carries the economy question; the first that does wins.
// ---
export const fetchApnorcEconomy = async (
	env: WorkerEnv,
): Promise<ApprovalRating> => {
	const projects = await ky
		.get(env.APNORC_WP_API_URL, { searchParams: APNORC_PROJECT_QUERY })
		.json<Array<ApnorcProject>>();

	for (const project of projects.slice(0, APNORC_MAX_PROJECTS_TO_SCAN)) {
		// --- Isolate each project: one bad page / PDF must not abort the scan of the rest. ---
		const fetchApnorcEconomyCallback = async (): Promise<
			ApprovalRating | undefined
		> => {
			// --- HTMLRewriter (Workers-native, not regex-on-HTML) streams the page to find the topline PDF anchor. ---
			let pdfUrl: string | undefined;

			await new HTMLRewriter()
				.on(`a[href*="${APNORC_TOPLINE_PDF_MARKER}"]`, {
					element(anchor) {
						const href = anchor.getAttribute('href');

						if (href && href.endsWith('.pdf')) {
							pdfUrl = href;
						}
					},
				})
				.transform(await ky.get(project.link))
				.arrayBuffer();

			if (!pdfUrl) {
				return undefined;
			}

			const pdfBytes = await ky.get(pdfUrl).arrayBuffer();
			const document = await getDocumentProxy(new Uint8Array(pdfBytes));
			const { text } = await extractText(document, {
				mergePages: true,
			});
			const economy = text.match(APNORC_ECONOMY_ROW_REGEX);
			const [, fieldwork, approveText, disapproveText] = economy ?? [];

			if (!fieldwork || !approveText || !disapproveText) {
				return undefined;
			}

			const approve = Number(approveText);
			const disapprove = Number(disapproveText);
			const approvalRating: ApprovalRating = {
				approvalType: 'economy',
				approve,
				disapprove,
				polls: [
					{
						pollster: APNORC_SOURCE_LABEL,
						approve,
						disapprove,
						date: fieldwork,
					},
				],
				source: APNORC_SOURCE_LABEL,
				fetchedAt: new Date().toISOString(),
			};

			return approvalRating;
		};

		const apnorcEconomyResults = await Utils.APITryCatch<
			ApprovalRating | undefined
		>({
			callback: fetchApnorcEconomyCallback,
			errorContext: `AP_NORC_PROJECT ${project.link}`,
		});

		if (apnorcEconomyResults.error !== undefined) {
			console.error(
				`[AP-NORC ${project.link}] ${apnorcEconomyResults.error.message}`,
			);

			continue;
		}

		if (apnorcEconomyResults.result !== undefined) {
			return apnorcEconomyResults.result;
		}
	}

	throw new Error('AP-NORC: no recent topline carried an economy row.');
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
