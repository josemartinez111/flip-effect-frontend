// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_HOME_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ref } from 'vue';
import { formatDate, getCountdownTimeLeft } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHomeComposable = () => {
	const MIDTERMS_DATE = '2026-11-03T00:00:00-05:00';
	let midtermsCountdownIntervalId: number | undefined;

	const midtermsCountdown = ref(
		getCountdownTimeLeft({ targetDate: MIDTERMS_DATE }),
	);

	const midtermsDateLabel = formatDate('long', MIDTERMS_DATE);

	const mainContainerStyleClasses = twMerge(
		clsx(
			'relative min-h-screen w-full overflow-hidden',
			'bg-transparent text-slate-950',
			'dark:text-white',
		),
	);

	const syncMidtermsCountdown = () => {
		midtermsCountdown.value = getCountdownTimeLeft({
			targetDate: MIDTERMS_DATE,
		});
	};

	const startMidtermsCountdown = () => {
		syncMidtermsCountdown();
		midtermsCountdownIntervalId = window.setInterval(
			syncMidtermsCountdown,
			1000,
		);
	};

	const stopMidtermsCountdown = () => {
		if (midtermsCountdownIntervalId !== undefined) {
			window.clearInterval(midtermsCountdownIntervalId);
			midtermsCountdownIntervalId = undefined;
		}
	};

	return {
		mainContainerStyleClasses,
		midtermsCountdown,
		midtermsDateLabel,
		startMidtermsCountdown,
		stopMidtermsCountdown,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
