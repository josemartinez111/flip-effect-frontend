// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_GOVERNMENT_CHECKS_BALANCES_QUIZ_STYLE_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseGovernmentChecksBalancesQuizStyleComposable = () => {
	const quizCardPassThrough = {
		body: { class: 'p-0' },
		content: { class: 'p-0' },
	};

	const quizCardTransitionActiveStyleClasses = twMerge(
		clsx(
			'transition-[transform,opacity] duration-[520ms]',
			'ease-[cubic-bezier(0.22,1,0.36,1)]',
		),
	);

	const quizCardTransitionEnterFromStyleClasses = twMerge(
		clsx('translate-x-[42px] rotate-[2deg] scale-[0.985] opacity-0'),
	);

	const quizCardTransitionLeaveToStyleClasses = twMerge(
		clsx('-translate-x-[120px] -rotate-[6deg] scale-[0.96] opacity-0'),
	);

	const quizCardTransitionDefaultStyleClasses = twMerge(
		clsx('translate-x-0 rotate-0 scale-100 opacity-100'),
	);

	const quizRootStyleClasses = twMerge(
		clsx(
			'flex min-h-[min(72vh,42rem)] w-[min(92vw,62rem)] flex-col',
			'bg-slate-950! px-4 py-5 text-white tablet:px-5 tablet:py-7 dark:bg-black!',
		),
	);

	const quizIntroContainerStyleClasses = twMerge(clsx('m-auto max-w-3xl text-center'));
	const quizResultsContainerStyleClasses = twMerge(clsx('m-auto w-full max-w-3xl'));
	const quizQuestionContainerStyleClasses = twMerge(clsx('m-auto w-full max-w-4xl'));
	const quizQuestionHeaderStyleClasses = twMerge(clsx('mb-4 flex items-center justify-between gap-4'));
	const quizAnswerOptionsGridStyleClasses = twMerge(clsx('grid gap-3'));
	const quizFeedbackStyleClasses = twMerge(clsx('rounded-xl border border-white/10 bg-slate-950/58 px-4 py-4'));
	const quizFeedbackCopyStyleClasses = twMerge(clsx('mt-2 text-sm font-semibold leading-6 text-slate-200/84'));
	const quizProgressBarStyleClasses = twMerge(clsx('mb-5 h-2! overflow-hidden rounded-full! bg-white/10!'));
	const quizQuestionCardContentStyleClasses = twMerge(clsx('grid gap-4 px-4 py-5 tablet:gap-6 tablet:px-7 tablet:py-8'));
	const quizAnswerOptionLabelStyleClasses = twMerge(clsx('text-sm font-bold tablet:text-base'));

	const quizEyebrowStyleClasses = twMerge(
		clsx(
			'font-orbitron text-xs font-black uppercase tracking-[0.24em]',
			'text-flipeffect-cyan drop-shadow-[0_0_16px_rgba(103,232,249,0.55)]',
			'tablet:text-sm',
		),
	);

	const quizTitleStyleClasses = twMerge(
		clsx(
			'mt-4 font-orbitron text-2xl font-black uppercase tracking-normal',
			'text-white tablet:text-4xl',
		),
	);

	const quizLeadStyleClasses = twMerge(
		clsx(
			'mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7',
			'text-slate-200/78 tablet:text-base',
		),
	);

	const quizLoadMessageStyleClasses = twMerge(
		clsx(
			'mx-auto mt-5 max-w-xl rounded-lg border px-4 py-3',
			'border-flipeffect-rose-bright/35 bg-flipeffect-rose-bright/10',
			'text-sm font-bold text-rose-100',
		),
	);

	const quizPrimaryButtonStyleClasses = twMerge(
		clsx(
			'mt-8 cursor-pointer border-none! bg-flipeffect-flip! px-6 py-3!',
			'font-orbitron! text-sm! font-black! uppercase! tracking-[0.14em]',
			'text-slate-950! shadow-[0_0_24px_rgba(103,232,249,0.28)]',
			'hover:bg-flipeffect-cyan! disabled:cursor-wait',
		),
	);

	const quizCardStyleClasses = twMerge(
		clsx(
			'overflow-hidden rounded-2xl border border-white/12 bg-white/7',
			'shadow-2xl shadow-black/35',
		),
	);

	const quizResultsCardStyleClasses = twMerge(
		clsx(quizCardStyleClasses, 'shadow-flipeffect-cyan/12'),
	);

	const quizHighScoreCardStyleClasses = twMerge(
		clsx(
			quizCardStyleClasses,
			'relative border-flipeffect-cyan/55 bg-flipeffect-cyan/10',
			'shadow-[0_0_42px_rgba(103,232,249,0.22),0_22px_54px_rgba(0,0,0,0.42)]',
			'before:pointer-events-none before:absolute before:inset-0',
			'before:bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.28),transparent_44%)]',
		),
	);

	const quizResultsContentStyleClasses = twMerge(
		clsx('px-6 py-8 text-center tablet:px-8 tablet:py-10'),
	);

	const quizResultsTagStyleClasses = twMerge(
		clsx(
			'bg-flipeffect-cyan/14! px-3 py-1!',
			'font-orbitron! text-xs! font-black! uppercase! tracking-[0.2em]',
			'text-flipeffect-cyan!',
		),
	);

	const quizHighScoreTagStyleClasses = twMerge(
		clsx(
			'bg-emerald-300/18! px-3 py-1!',
			'font-orbitron! text-xs! font-black! uppercase! tracking-[0.2em]',
			'text-emerald-100!',
		),
	);

	const quizHighScoreSignalGridStyleClasses = twMerge(
		clsx('mt-5 flex items-center justify-center gap-2'),
	);

	const quizHighScoreSignalStyleClasses = twMerge(
		clsx(
			'h-2.5 w-10 rounded-full bg-flipeffect-cyan',
			'shadow-[0_0_18px_rgba(103,232,249,0.72)]',
			'animate-pulse',
		),
	);

	const quizScoreValueStyleClasses = twMerge(
		clsx('mt-5 font-orbitron text-6xl font-black text-white tablet:text-7xl'),
	);

	const quizHighScoreValueStyleClasses = twMerge(
		clsx(
			'mt-5 bg-gradient-to-b from-white via-flipeffect-cyan to-emerald-200',
			'bg-clip-text font-orbitron text-6xl font-black text-transparent',
			'drop-shadow-[0_0_22px_rgba(103,232,249,0.5)]',
			'tablet:text-7xl',
		),
	);

	const quizScoreLabelStyleClasses = twMerge(
		clsx('mt-4 font-orbitron text-2xl font-black uppercase text-flipeffect-cyan'),
	);

	const quizScoreSummaryStyleClasses = twMerge(
		clsx('mt-4 text-base font-bold text-slate-200/82'),
	);

	const quizQuestionCounterStyleClasses = twMerge(
		clsx(
			'font-orbitron text-xs font-black uppercase tracking-[0.18em]',
			'text-flipeffect-cyan',
		),
	);

	const quizQuestionTitleStyleClasses = twMerge(
		clsx(
			'font-orbitron text-xl font-black leading-tight text-white',
			'tablet:text-3xl',
		),
	);

	const quizAnswerOptionMarkerStyleClasses = twMerge(
		clsx(
			'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
			'border border-white/16 bg-slate-950/60',
			'font-orbitron text-xs font-black uppercase text-flipeffect-cyan',
			'group-hover:border-flipeffect-cyan/60',
		),
	);

	const quizNextButtonStyleClasses = twMerge(
		clsx(
			'mt-4 cursor-pointer border border-white/14! bg-white/8! px-4 py-2!',
			'font-orbitron! text-xs! font-black! uppercase! tracking-[0.12em]',
			'text-white! hover:border-flipeffect-cyan/70! hover:bg-flipeffect-cyan/14!',
		),
	);

	return {
		quizCardPassThrough,
		quizCardTransitionActiveStyleClasses,
		quizCardTransitionEnterFromStyleClasses,
		quizCardTransitionLeaveToStyleClasses,
		quizCardTransitionDefaultStyleClasses,
		quizRootStyleClasses,
		quizIntroContainerStyleClasses,
		quizEyebrowStyleClasses,
		quizTitleStyleClasses,
		quizLeadStyleClasses,
		quizLoadMessageStyleClasses,
		quizPrimaryButtonStyleClasses,
		quizResultsContainerStyleClasses,
		quizCardStyleClasses,
		quizResultsCardStyleClasses,
		quizHighScoreCardStyleClasses,
		quizResultsContentStyleClasses,
		quizResultsTagStyleClasses,
		quizHighScoreTagStyleClasses,
		quizHighScoreSignalGridStyleClasses,
		quizHighScoreSignalStyleClasses,
		quizScoreValueStyleClasses,
		quizHighScoreValueStyleClasses,
		quizScoreLabelStyleClasses,
		quizScoreSummaryStyleClasses,
		quizQuestionContainerStyleClasses,
		quizQuestionHeaderStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizQuestionCardContentStyleClasses,
		quizQuestionTitleStyleClasses,
		quizAnswerOptionsGridStyleClasses,
		quizAnswerOptionMarkerStyleClasses,
		quizAnswerOptionLabelStyleClasses,
		quizFeedbackStyleClasses,
		quizFeedbackCopyStyleClasses,
		quizNextButtonStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
