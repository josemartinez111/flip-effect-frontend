// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: AMERICA-IN-FOCUS > COMPOSABLES
// > USE_AMERICA_IN_FOCUS_PAGE_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlobalEnvs, UseSocialMediaMetadataComposable } from '../../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseAmericaInFocusPageComposable = () => {
	// ---
	// This route is indexable on its own, so it declares its own title, description,
	// canonical URL, and share card instead of inheriting the site-wide defaults.
	// ---
	UseSocialMediaMetadataComposable({
		siteUrl: GlobalEnvs.SiteUrl,
		path: '/america-in-focus',
		title: 'America in Focus | House & Senate Control and Household Prices',
		description:
			'Who controls the House and Senate right now, what the balance of power means for the next fight in Congress, and how household prices are moving.',
		image: `${GlobalEnvs.SiteUrl}/og-civics-quiz.jpg`,
		platforms: ['threads'],
	});

	const americaInFocusVideoUrls: Array<string> = [
		'https://youtu.be/lfr9ZQfcU34?si=0s8uVmRI3cYeFy-Z',
		'https://youtu.be/E02Sbj32_Vc?si=vORAWMFkFJQYsbrn',
		'https://youtu.be/KHbYD0UQ0HI?si=XSrMEIwCsYudjSF-',
		'https://youtu.be/K_xy4UJIIek?si=XzFxUl0ZNE2J_d8F',
		'https://youtu.be/QBiPleGSlFQ?si=zqr3Bj1FOANI9u5a',
	];

	// --- Keeps the chart and video sections aligned with the control section gutters on every screen. ---
	const americaInFocusSectionShellStyleClasses = twMerge(
		clsx(
			'relative z-20 mx-auto w-full max-w-[96rem] px-4 pb-10',
			'tablet:px-6 tablet:pb-14 laptop:pb-20',
		),
	);

	return {
		americaInFocusVideoUrls,
		americaInFocusSectionShellStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
