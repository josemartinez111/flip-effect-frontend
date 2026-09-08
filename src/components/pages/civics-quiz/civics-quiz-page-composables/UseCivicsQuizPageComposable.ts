// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: CIVICS-QUIZ > COMPOSABLES
// > USE_CIVICS_QUIZ_PAGE_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlobalEnvs, UseSocialMediaMetadataComposable } from '../../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CivicsQuizPageStat = {
	value: string;
	label: string;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export const UseCivicsQuizPageComposable = () => {
	// ---
	// The quiz also lives in a home page modal, which has no URL and therefore no metadata.
	// This route is the shareable, indexable copy, so it declares its own title, description,
	// canonical link, and social card tags. The image is absolute because crawlers require it,
	// and it sits in public/ so its path is never hashed by the build.
	// ---
	UseSocialMediaMetadataComposable({
		siteUrl: GlobalEnvs.SiteUrl,
		path: '/civics-quiz',
		title: 'Civics Quiz | The Flip Effect',
		description:
			'Test your command of Congress, the courts, presidential power, and the checks and balances that keep no branch above the Constitution.',
		image: `${GlobalEnvs.SiteUrl}/og-civics-quiz.jpg`,
		platforms: ['threads'],
	});

	const civicsQuizEyebrow = 'Constitutional Fluency Check';
	const civicsQuizTitle = 'Civics Quiz';
	const civicsQuizLead =
		'Every fight over power comes down to a rule someone is hoping you never learned. Who declares war, who controls the money, who answers to a court, and what a president cannot do alone. Every answer comes with the reason behind it. Run the table and the next tier unlocks.';

	const civicsQuizStats: Array<CivicsQuizPageStat> = [
		{ value: '63', label: 'Questions' },
		{ value: '17', label: 'Per Run' },
		{ value: '4', label: 'Tiers' },
	];

	// --- Matches the section gutters used across the other content pages; caps how wide the quiz gets. ---
	const civicsQuizSectionShellStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-full max-w-[96rem] px-4 pb-10 pt-8',
			'tablet:px-6 tablet:pb-14 tablet:pt-12 laptop:pb-20',
		),
	);

	// ---
	// Intro shell borrows the same glass panel the congressional control section uses, so the
	// page reads as part of the app rather than a bare card. Light and dark each get their own
	// surface; the quiz panel below stays dark in both because its own copy is white.
	// ---
	const civicsQuizIntroShellStyleClasses = twMerge(
		clsx(
			'mb-8 rounded-2xl border px-5 py-6 shadow-2xl backdrop-blur-xl',
			'border-white/75 bg-white/58 shadow-slate-950/14',
			'dark:border-white/10 dark:bg-slate-950/48 dark:shadow-black/42',
			'tablet:mb-10 tablet:px-8 tablet:py-8',
		),
	);

	const civicsQuizIntroLayoutStyleClasses = twMerge(
		clsx(
			'flex flex-col gap-6 text-center',
			'laptop:flex-row laptop:items-end laptop:justify-between laptop:gap-10 laptop:text-left',
		),
	);

	const civicsQuizIntroCopyStyleClasses = twMerge(clsx('laptop:max-w-3xl'));

	const civicsQuizEyebrowStyleClasses = twMerge(
		clsx(
			'font-orbitron text-xs font-black uppercase tracking-[0.24em]',
			'text-cyan-700 drop-shadow-[0_0_16px_rgba(14,165,233,0.32)]',
			'dark:text-cyan-100 dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.68)]',
			'tablet:text-sm',
		),
	);

	const civicsQuizTitleStyleClasses = twMerge(
		clsx(
			'mt-3 font-orbitron text-3xl font-black uppercase leading-[1.05] tracking-normal',
			'text-slate-950 drop-shadow-[0_0_18px_rgba(14,165,233,0.18)]',
			'dark:text-white dark:drop-shadow-[0_0_18px_rgba(125,211,252,0.32)]',
			'tablet:text-5xl',
		),
	);

	const civicsQuizLeadStyleClasses = twMerge(
		clsx(
			'mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7',
			'text-slate-700 dark:text-slate-200/78',
			'tablet:text-base laptop:mx-0',
		),
	);

	// --- Stat tiles sit opposite the copy on laptop and wrap under it on smaller screens. ---
	const civicsQuizStatGridStyleClasses = twMerge(
		clsx('grid shrink-0 grid-cols-3 gap-3 laptop:gap-4'),
	);

	const civicsQuizStatTileStyleClasses = twMerge(
		clsx(
			'rounded-xl border px-3 py-3 text-center backdrop-blur-md',
			'border-white/70 bg-white/62 shadow-lg shadow-slate-950/8',
			'dark:border-white/10 dark:bg-slate-950/55 dark:shadow-black/35',
			'tablet:px-5 tablet:py-4',
		),
	);

	const civicsQuizStatValueStyleClasses = twMerge(
		clsx(
			'font-orbitron text-2xl font-black leading-none',
			'text-cyan-700 drop-shadow-[0_0_14px_rgba(14,165,233,0.35)]',
			'dark:text-cyan-100 dark:drop-shadow-[0_0_16px_rgba(125,211,252,0.6)]',
			'tablet:text-3xl',
		),
	);

	const civicsQuizStatLabelStyleClasses = twMerge(
		clsx(
			'mt-2 block font-orbitron text-[0.6rem] font-black uppercase tracking-[0.16em]',
			'text-slate-600 dark:text-slate-300/70 tablet:text-xs',
		),
	);

	return {
		civicsQuizEyebrow,
		civicsQuizTitle,
		civicsQuizLead,
		civicsQuizStats,
		civicsQuizSectionShellStyleClasses,
		civicsQuizIntroShellStyleClasses,
		civicsQuizIntroLayoutStyleClasses,
		civicsQuizIntroCopyStyleClasses,
		civicsQuizEyebrowStyleClasses,
		civicsQuizTitleStyleClasses,
		civicsQuizLeadStyleClasses,
		civicsQuizStatGridStyleClasses,
		civicsQuizStatTileStyleClasses,
		civicsQuizStatValueStyleClasses,
		civicsQuizStatLabelStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
