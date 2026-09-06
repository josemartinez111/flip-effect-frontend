// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// CLOUDFLARE: APP > API-MODULES > CONGRESSIONAL-BALANCE-MODULE > APPLICATION
// > CONGRESSIONAL_BALANCE_SERVICE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { CongressLegislator } from '@representatives-module/domain/civicUpstreamModel';
import {
	fetchFreshFederalLegislators,
	readFederalLegislators,
} from '@representatives-module/infrastructure/representativesCache';
import type { WorkerEnv } from '@shared-module/worker-env';
import { STATUS } from '@shared-module/httpStatus';
import { Utils } from '@shared-module/utils';
import type {
	CongressionalBalance,
	CongressionalBalanceActionResult,
	CongressionalChamberBalance,
} from '@congressional-balance-module/domain/congressionalBalanceModel';
import {
	CONGRESSIONAL_BALANCE_SOURCE,
	HOUSE_TOTAL_SEATS,
	NON_VOTING_HOUSE_JURISDICTIONS,
	SENATE_TOTAL_SEATS,
} from '@congressional-balance-module/domain/congressionalBalanceConstants';
import { CongressBalanceCache } from '@congressional-balance-module/infrastructure/congressBalanceCache';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Own congressional balance normalization, endpoint results, and scheduled refresh behavior. ---
export class CongressBalanceService {
	// --- Convert the current federal roster into the small, internally consistent balance contract sent to the frontend. ---
	static fetchCongressBalanceFromLegislators({
		legislators,
		fetchedAt,
		sourceUrl,
	}: {
		legislators: Array<CongressLegislator>;
		fetchedAt: string;
		sourceUrl: string;
	}): CongressionalBalance {
		const effectiveDate = fetchedAt.slice(0, 10);
		const house: CongressionalChamberBalance = {
			chamber: 'house',
			totalSeats: HOUSE_TOTAL_SEATS,
			filledSeats: 0,
			democrats: 0,
			republicans: 0,
			independents: 0,
			democraticCaucus: 0,
			republicanCaucus: 0,
			vacancies: 0,
		};
		const senate: CongressionalChamberBalance = {
			chamber: 'senate',
			totalSeats: SENATE_TOTAL_SEATS,
			filledSeats: 0,
			democrats: 0,
			republicans: 0,
			independents: 0,
			democraticCaucus: 0,
			republicanCaucus: 0,
			vacancies: 0,
		};

		for (const legislator of legislators) {
			// --- Walk backward so a future term at the end cannot replace the term serving on fetchedAt. ---
			const terms = legislator.terms ?? [];
			let activeTerm = terms.at(-1);

			for (let index = terms.length - 1; index >= 0; index -= 1) {
				const candidate = terms[index];

				if (
					candidate?.start &&
					candidate.end &&
					candidate.start <= effectiveDate &&
					effectiveDate < candidate.end
				) {
					activeTerm = candidate;

					break;
				}
			}

			if (
				!activeTerm?.start ||
				!activeTerm.end ||
				activeTerm.start > effectiveDate ||
				effectiveDate >= activeTerm.end ||
				!activeTerm.state ||
				!activeTerm.party
			) {
				continue;
			}

			if (
				activeTerm.type === 'rep' &&
				NON_VOTING_HOUSE_JURISDICTIONS.has(activeTerm.state)
			) {
				continue;
			}

			const chamber =
				activeTerm.type === 'rep'
					? house
					: activeTerm.type === 'sen'
						? senate
						: undefined;

			if (!chamber) {
				continue;
			}

			chamber.filledSeats += 1;

			if (
				activeTerm.party === 'D' ||
				activeTerm.party === 'Democrat' ||
				activeTerm.party === 'Democratic'
			) {
				chamber.democrats += 1;
			} else if (
				activeTerm.party === 'R' ||
				activeTerm.party === 'Republican'
			) {
				chamber.republicans += 1;
			} else {
				chamber.independents += 1;
			}

			const caucus = activeTerm.caucus ?? activeTerm.party;

			if (
				caucus === 'D' ||
				caucus === 'Democrat' ||
				caucus === 'Democratic'
			) {
				chamber.democraticCaucus += 1;
			} else if (caucus === 'R' || caucus === 'Republican') {
				chamber.republicanCaucus += 1;
			}
		}

		house.vacancies = Math.max(0, house.totalSeats - house.filledSeats);
		senate.vacancies = Math.max(0, senate.totalSeats - senate.filledSeats);

		const balance: CongressionalBalance = {
			house,
			senate,
			source: CONGRESSIONAL_BALANCE_SOURCE,
			sourceUrl,
			fetchedAt,
		};

		return balance;
	}

	// --- Serve the compact KV value; on its first miss, derive it from the already-cached federal roster before using the upstream read-through. ---
	static async fetchCongressBalance(
		env: WorkerEnv,
	): Promise<CongressionalBalanceActionResult> {
		const fetchCongressBalanceCallback =
			async (): Promise<CongressionalBalance> => {
				const cached =
					await CongressBalanceCache.fetchCongressBalanceCache(env);

				if (cached.balance) {
					return cached.balance;
				}

				const legislators =
					cached.legislators ?? (await readFederalLegislators(env));

				if (legislators.length === 0) {
					throw new Error('The federal legislator roster is unavailable.');
				}

				const balance =
					CongressBalanceService.fetchCongressBalanceFromLegislators({
						legislators,
						fetchedAt: cached.rosterFetchedAt ?? new Date().toISOString(),
						sourceUrl: env.CONGRESS_LEGISLATORS_CURRENT_URL,
					});

				await CongressBalanceCache.cacheCongressBalance(env, balance);

				return balance;
			};

		const balanceResults = await Utils.APITryCatch<CongressionalBalance>({
			callback: fetchCongressBalanceCallback,
			errorContext: 'FETCH_CONGRESS_BALANCE',
			failureStatusCode: STATUS.SERVICE_UNAVAILABLE,
		});

		if (balanceResults.error !== undefined) {
			const failed: CongressionalBalanceActionResult = {
				success: false,
				statusCode: balanceResults.statusCode,
				message: 'Congressional balance is temporarily unavailable.',
				error: balanceResults.error.message,
			};

			return failed;
		}

		const succeeded: CongressionalBalanceActionResult = {
			success: true,
			statusCode: balanceResults.statusCode,
			message: 'Congressional balance loaded.',
			congressionalBalance: balanceResults.result,
		};

		return succeeded;
	}

	// --- Daily refresh reuses the same downloaded roster for both KV entries and never replaces the compact last-good value with an empty result. ---
	static async fetchFreshCongressBalance(
		env: WorkerEnv,
	): Promise<CongressionalBalance> {
		const legislators = await fetchFreshFederalLegislators(env);

		if (legislators.length === 0) {
			throw new Error(
				'The fresh federal legislator roster is unavailable.',
			);
		}

		const balance =
			CongressBalanceService.fetchCongressBalanceFromLegislators({
				legislators,
				fetchedAt: new Date().toISOString(),
				sourceUrl: env.CONGRESS_LEGISLATORS_CURRENT_URL,
			});

		await CongressBalanceCache.cacheCongressBalance(env, balance);

		return balance;
	}

	// --- Keep scheduled refresh failures inside the background job so the previous KV snapshot remains available. ---
	static async fetchCronsCongressBalance(env: WorkerEnv): Promise<void> {
		const fetchFreshCongressBalanceCallback = async (): Promise<void> => {
			await CongressBalanceService.fetchFreshCongressBalance(env);
		};
		const balanceResults = await Utils.APITryCatch<void>({
			callback: fetchFreshCongressBalanceCallback,
			errorContext: 'FETCH_CRONS_CONGRESS_BALANCE',
		});

		if (balanceResults.error !== undefined) {
			console.error(
				`[congressional-balance cron] ${balanceResults.error.message}`,
			);
		}
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
