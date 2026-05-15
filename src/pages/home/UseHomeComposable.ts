// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                    USE_HOME_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ref } from 'vue';
import { formatDate, getCountdownTimeLeft } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHomeComposable = () => {
	const MIDTERMS_DATE = '2026-11-03T00:00:00-05:00';
	let midtermsCountdownIntervalId: number | undefined;

	const midtermsCountdown = ref(
		getCountdownTimeLeft({ targetDate: MIDTERMS_DATE }),
	);

	const midtermsDateLabel = formatDate('long', MIDTERMS_DATE);

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

	const mainContainerStyleClasses = twMerge(
		clsx(
			'relative min-h-screen w-full overflow-hidden',
			'bg-transparent text-slate-950',
			'dark:text-white',
		),
	);

	const heroSectionStyleClasses = twMerge(
		clsx(
			'relative isolate flex min-h-[calc(100vh-4rem)] items-center',
			'px-5 pb-20 pt-16 tablet:px-8 laptop:pb-24 laptop:pt-20',
		),
	);

	const heroContentContainerStyleClasses = twMerge(
		clsx(
			'relative z-10 mx-auto grid w-full max-w-7xl items-center',
			'gap-10 laptop:grid-cols-[minmax(0,0.84fr)_minmax(34rem,1.16fr)]',
		),
	);

	const heroCopyContainerStyleClasses = twMerge(
		clsx('max-w-2xl text-left'),
	);

	const homeTitleStyleClasses = twMerge(
		clsx(
			'font-orbitron text-4xl font-extrabold leading-[1.05] tracking-normal',
			'text-slate-950 tablet:text-5xl laptop:text-6xl',
			'dark:text-white',
		),
	);

	const heroLeadStyleClasses = twMerge(
		clsx(
			'mt-6 max-w-xl text-base font-medium leading-8',
			'text-slate-700 tablet:text-lg dark:text-slate-200/82',
		),
	);

	const heroCardShellStyleClasses = twMerge(
		clsx('relative col-span-full flex w-full justify-center'),
	);

	const countdownCardStyleClasses = twMerge(
		clsx(
			'absolute left-4 top-4 z-30 h-40 w-28 overflow-hidden rounded-xl',
			'border border-white/18 bg-slate-950/42 text-white shadow-2xl',
			'shadow-slate-950/25 backdrop-blur-md',
			'tablet:left-8 tablet:h-56 tablet:w-38 laptop:h-72 laptop:w-48',
			'dark:border-white/12 dark:bg-slate-950/38 dark:shadow-black/45',
		),
	);

	const countdownCardBodyStyleClasses = twMerge(clsx('h-full p-0'));

	const countdownCardContentStyleClasses = twMerge(
		clsx(
			'flex h-full flex-col items-center justify-center px-2 py-3',
			'font-orbitron text-center tablet:px-3 tablet:py-4',
		),
	);

	const countdownEyebrowStyleClasses = twMerge(
		clsx(
			'text-[0.55rem] font-black uppercase tracking-[0.16em]',
			'text-cyan-100 drop-shadow-[0_0_8px_rgba(125,211,252,0.7)]',
			'tablet:text-[0.68rem] laptop:text-xs',
		),
	);

	const countdownDaysValueStyleClasses = twMerge(
		clsx(
			'mt-2 bg-gradient-to-b from-white via-cyan-100 to-sky-300',
			'bg-clip-text text-4xl font-black leading-none text-transparent',
			'drop-shadow-[0_0_16px_rgba(56,189,248,0.9)]',
			'tablet:mt-4 tablet:text-6xl laptop:text-7xl',
		),
	);

	const countdownDaysLabelStyleClasses = twMerge(
		clsx(
			'mt-1 text-[0.6rem] font-black uppercase tracking-[0.22em]',
			'text-white/82 tablet:text-xs',
		),
	);

	const countdownTimeGridStyleClasses = twMerge(
		clsx(
			'mt-3 grid w-full grid-cols-3 gap-1 border-y border-white/16 py-2',
			'tablet:mt-5 tablet:gap-2 tablet:py-3',
		),
	);

	const countdownTimeValueStyleClasses = twMerge(
		clsx(
			'block text-sm font-black leading-none text-white',
			'drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]',
			'tablet:text-xl laptop:text-2xl',
		),
	);

	const countdownTimeLabelStyleClasses = twMerge(
		clsx(
			'mt-1 block text-[0.45rem] font-bold uppercase tracking-[0.12em]',
			'text-cyan-100/78 tablet:text-[0.55rem]',
		),
	);

	const countdownDateLabelStyleClasses = twMerge(
		clsx(
			'mt-2 max-w-full text-[0.48rem] font-bold leading-tight text-white/66',
			'tablet:mt-4 tablet:text-[0.62rem] laptop:text-[0.68rem]',
		),
	);

	const branchesTriggerButtonStyleClasses = twMerge(
		clsx(
			'absolute right-4 top-4 z-30 flex h-40 w-28 cursor-pointer overflow-hidden',
			'items-center justify-center rounded-xl bg-transparent p-0',
			'transition duration-200 hover:scale-[1.03] hover:opacity-90',
			'active:scale-95 active:opacity-75',
			'tablet:right-8 tablet:h-56 tablet:w-38 laptop:h-72 laptop:w-48',
		),
	);

	const branchesTriggerImageStyleClasses = twMerge(
		clsx(
			'h-full w-full object-contain',
			'drop-shadow-[0_12px_24px_rgba(15,23,42,0.35)]',
			'dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]',
		),
	);

	const branchesModalCardStyleClasses = twMerge(
		clsx(
			'relative overflow-hidden rounded-xl bg-white/5 shadow-2xl',
			'shadow-slate-950/25 dark:shadow-black/45',
		),
	);

	const branchesModalCardBodyStyleClasses = twMerge(clsx('p-0'));

	const branchesModalCardContentStyleClasses = twMerge(clsx('relative p-0'));

	const branchesModalBgImageStyleClasses = twMerge(
		clsx(
			'absolute inset-0 h-full w-full object-cover',
			'opacity-35 saturate-[0.85] contrast-[0.9] brightness-[1.1]',
			'dark:opacity-28 dark:brightness-[1.3] dark:contrast-[0.85]',
		),
	);

	const branchesModalImageStyleClasses = twMerge(
		clsx('relative z-10 max-h-[78vh] w-full object-contain'),
	);

	return {
		mainContainerStyleClasses,
		heroSectionStyleClasses,
		heroContentContainerStyleClasses,
		heroCopyContainerStyleClasses,
		homeTitleStyleClasses,
		heroLeadStyleClasses,
		heroCardShellStyleClasses,
		countdownCardStyleClasses,
		countdownCardBodyStyleClasses,
		countdownCardContentStyleClasses,
		countdownEyebrowStyleClasses,
		countdownDaysValueStyleClasses,
		countdownDaysLabelStyleClasses,
		countdownTimeGridStyleClasses,
		countdownTimeValueStyleClasses,
		countdownTimeLabelStyleClasses,
		countdownDateLabelStyleClasses,
		branchesTriggerButtonStyleClasses,
		branchesTriggerImageStyleClasses,
		branchesModalCardStyleClasses,
		branchesModalCardBodyStyleClasses,
		branchesModalCardContentStyleClasses,
		branchesModalBgImageStyleClasses,
		branchesModalImageStyleClasses,
		midtermsCountdown,
		midtermsDateLabel,
		startMidtermsCountdown,
		stopMidtermsCountdown,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
