// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_GOVERNMENT_CHECKS_BALANCES_QUIZ_STYLE_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// The quiz renders in two shells. `modal` is the home page dialog, which sizes itself
// against the viewport and paints a solid slab because it floats over the page. `page`
// is the dedicated route, where the layout background is already behind it, so it spans
// the full column as a blurred panel. That panel stays dark in light mode too: every
// piece of copy inside the quiz is white, so a light surface would wash it out.
// ---
export type GovernmentChecksBalancesQuizVariant = 'modal' | 'page';

export const UseGovernmentChecksBalancesQuizStyleComposable = (
	variant: GovernmentChecksBalancesQuizVariant = 'modal',
) => {
	const isPageVariant = variant === 'page';
	// --- PrimeVue Card ships its own padding; this strips it so the layout below owns spacing. ---
	const quizCardPassThrough = {
		body: { class: 'p-0' },
		content: { class: 'p-0' },
	};

	// --- Question cards slide in from the right and peel off to the left between questions. ---
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

	// --- The outer shell, and the only class set that differs between the modal and the page. ---
	const quizRootStyleClasses = twMerge(
		clsx(
			'flex min-h-[min(72vh,42rem)] flex-col text-white',
			isPageVariant
				? clsx(
						'w-full rounded-2xl border border-white/12 bg-slate-950/62',
						'px-4 py-6 shadow-2xl shadow-black/45 backdrop-blur-2xl',
						'tablet:px-8 tablet:py-10 dark:border-white/10 dark:bg-slate-950/58',
					)
				: clsx(
						'w-[min(92vw,62rem)] bg-slate-950! px-4 py-5',
						'tablet:px-5 tablet:py-7 dark:bg-black!',
					),
		),
	);

	const quizIntroContainerStyleClasses = twMerge(
		clsx('m-auto text-center', isPageVariant ? 'max-w-4xl' : 'max-w-3xl'),
	);

	const quizResultsContainerStyleClasses = twMerge(
		clsx('m-auto w-full', isPageVariant ? 'max-w-4xl' : 'max-w-3xl'),
	);

	// --- The page shell already caps its own width, so the question column fills it. ---
	const quizQuestionContainerStyleClasses = twMerge(
		clsx('m-auto w-full', isPageVariant ? 'max-w-none' : 'max-w-4xl'),
	);
	const quizQuestionHeaderStyleClasses = twMerge(clsx('mb-4 flex items-center justify-between gap-4'));
	const quizQuestionHeaderActionsStyleClasses = twMerge(clsx('flex items-center gap-2 tablet:gap-3'));

	// --- Mid-run restart. Deliberately quieter than the answer options so it is never a misclick. ---
	const quizRestartButtonStyleClasses = twMerge(
		clsx(
			'cursor-pointer border border-white/14! bg-white/6! px-3 py-1.5!',
			'font-orbitron! text-[0.6rem]! font-black! uppercase! tracking-[0.12em]',
			'text-slate-200! hover:border-flipeffect-rose-bright/70!',
			'hover:bg-flipeffect-rose-bright/12! hover:text-rose-100!',
			'tablet:text-xs!',
		),
	);
	// --- Four options read as a cramped stack once the page column gets wide, so they pair up. ---
	const quizAnswerOptionsGridStyleClasses = twMerge(
		clsx('grid gap-3', isPageVariant && 'laptop:grid-cols-2'),
	);
	const quizFeedbackStyleClasses = twMerge(clsx('rounded-xl border border-white/10 bg-slate-950/58 px-4 py-4'));
	const quizFeedbackCopyStyleClasses = twMerge(clsx('mt-2 text-sm font-semibold leading-6 text-slate-200/84'));
	const quizProgressBarStyleClasses = twMerge(clsx('mb-3 h-2! overflow-hidden rounded-full! bg-white/10!'));

	// --- Tier meter sits under the question progress bar; only rendered when the bank has more than one tier. ---
	const quizTierMeterStyleClasses = twMerge(
		clsx(
			'mb-5 [&_.p-metergroup-meters]:h-1.5 [&_.p-metergroup-meters]:gap-1',
			'[&_.p-metergroup-meters]:overflow-hidden [&_.p-metergroup-meters]:rounded-full',
			'[&_.p-metergroup-meters]:bg-transparent',
		),
	);
	const quizQuestionCardContentStyleClasses = twMerge(clsx('grid gap-4 px-4 py-5 tablet:gap-6 tablet:px-7 tablet:py-8'));
	const quizAnswerOptionLabelStyleClasses = twMerge(clsx('text-sm font-bold tablet:text-base'));

	// --- Start screen: eyebrow, title, lead, load error, and the start button. ---
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

	// --- Card surfaces: the plain question card, the results card, and the high-score variant. ---
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

	// --- Results screen: tag, score value, rank label, and the pulsing high-score bars. ---
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

	// --- Question screen: counter, question text, option marker, and the manual next button. ---
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
		quizQuestionHeaderActionsStyleClasses,
		quizRestartButtonStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizTierMeterStyleClasses,
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
