// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > AMERICA-IN-FOCUS > AMERICA-IN-FOCUS-PAGE-COMPOSABLES
// > USE_TARIFF_ACTIVITY_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTariffActivityStore } from '../../../../lib/stores/UseTariffActivityStore';
import type { TariffMoneyCard } from '../../../../lib/types/TariffMoneyPresentationTypes';

// --- Keep Treasury meaning and network lifecycle in the page adapter, never inside the reusable chart utility. ---
export const UseTariffActivityComposable = () => {
	const tariffStore = useTariffActivityStore();
	const { tariffActivity, isLoading, isStale, errorMessage } =
		storeToRefs(tariffStore);
	const monthFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	});
	const moneyFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		notation: 'compact',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	// --- Both plots use the entire available history; separate scales keep smaller refunds visible without mixing units. ---
	const tariffMoneyCards = computed<Array<TariffMoneyCard>>(() => {
		const months = tariffActivity.value?.months ?? [];
		const latestMonth = months.at(-1);
		const refundColor =
			typeof document === 'undefined'
				? '#f97316'
				: getComputedStyle(document.documentElement)
						.getPropertyValue('--color-brand-orange')
						.trim() || '#f97316';
		const labels = months.map((month) =>
			monthFormatter.format(new Date(`${month.reportDate}T00:00:00Z`)),
		);
		const cards: Array<TariffMoneyCard> = [
			{
				title: 'Money collected',
				description: 'Customs duties received by the U.S. Treasury.',
				latestAmount: latestMonth
					? moneyFormatter.format(latestMonth.collected)
					: '—',
				data: {
					labels,
					datasets: [
						{
							label: 'Customs collections',
							data: months.map((month) => month.collected),
						},
					],
				},
			},
			{
				title: 'Money refunded',
				description: 'Customs refunds—not household relief checks.',
				latestAmount: latestMonth
					? moneyFormatter.format(latestMonth.refunded)
					: '—',
				data: {
					labels,
					datasets: [
						{
							label: 'Customs refunds',
							borderColor: refundColor,
							backgroundColor: refundColor,
							data: months.map((month) => month.refunded),
						},
					],
				},
			},
		];

		return cards;
	});
	const tariffPeriodLabel = computed(() => {
		const months = tariffActivity.value?.months ?? [];
		const first = months.at(0);
		const last = months.at(-1);

		if (!first || !last) {
			return '';
		}

		return `${monthFormatter.format(new Date(`${first.reportDate}T00:00:00Z`))} – ${monthFormatter.format(new Date(`${last.reportDate}T00:00:00Z`))}`;
	});
	// --- Divide period totals, not monthly percentages; refunds can relate to duties collected before this window. ---
	const tariffRefundShare = computed(() => {
		const months = tariffActivity.value?.months ?? [];
		const collected = months.reduce(
			(total, month) => total + month.collected,
			0,
		);
		const refunded = months.reduce(
			(total, month) => total + month.refunded,
			0,
		);

		if (collected <= 0) {
			return 'Not calculable';
		}

		return new Intl.NumberFormat('en-US', {
			style: 'percent',
			maximumFractionDigits: 1,
		}).format(refunded / collected);
	});
	const tariffNetReceipts = computed(() => {
		const months = tariffActivity.value?.months ?? [];

		if (!months.length) {
			return '—';
		}

		return moneyFormatter.format(
			months.reduce((total, month) => total + month.netReceipts, 0),
		);
	});
	const tariffStatusLabel = computed(() => {
		if (!tariffActivity.value) {
			return isLoading.value
				? 'Loading Treasury data'
				: 'Data unavailable';
		}

		const latestMonth = monthFormatter.format(
			new Date(`${tariffActivity.value.latestReportDate}T00:00:00Z`),
		);

		return `${isStale.value ? 'Cached · ' : ''}Through ${latestMonth}`;
	});
	const tariffEmptyMessage = computed(() =>
		isLoading.value
			? 'Loading monthly observations…'
			: (errorMessage.value ?? 'No monthly observations available.'),
	);
	const tariffSourceCaption = computed(() => {
		if (!tariffActivity.value) {
			return '';
		}

		const checkedOn = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeZone: 'UTC',
		}).format(new Date(tariffActivity.value.fetchedAt));

		return `${tariffActivity.value.source} · Checked ${checkedOn} (UTC)`;
	});
	const tariffSourceUrl = computed(
		() => tariffActivity.value?.sourceUrl ?? '',
	);
	// --- Identify the report period separately from when we downloaded it; a recent fetch does not make monthly data live. ---
	const tariffSourceTooltip = computed(() => {
		if (!tariffActivity.value) {
			return '';
		}

		const latestMonth = monthFormatter.format(
			new Date(`${tariffActivity.value.latestReportDate}T00:00:00Z`),
		);

		return `U.S. Treasury Monthly Treasury Statement, Table 4: Customs Duties. Monthly gross collections, refunds, and net receipts in USD; latest reporting month: ${latestMonth}. Covers all customs duties, not just recently imposed tariffs. No recipient names or separate relief-payment totals are provided.`;
	});

	// --- Mounting fetches quietly; request errors appear in the card rather than creating an automatic toast. ---
	onMounted(async () => {
		await tariffStore.fetchTariffActivity();
	});
	const tariffPresentation = {
		tariffMoneyCards,
		tariffPeriodLabel,
		tariffRefundShare,
		tariffNetReceipts,
		tariffStatusLabel,
		tariffEmptyMessage,
		tariffSourceCaption,
		tariffSourceUrl,
		tariffSourceTooltip,
	};

	return tariffPresentation;
};
