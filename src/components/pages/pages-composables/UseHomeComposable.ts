// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// PAGES: HOME > COMPOSABLES > USE_HOME_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlobalEnvs, UseSocialMediaMetadataComposable } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseHomeComposable = () => {
	// ---
	// Without this the home page inherits index.html's static tags, which describe the site
	// rather than the route. Declaring them here gives the landing page its own title,
	// description, canonical URL, and share card.
	// ---
	UseSocialMediaMetadataComposable({
		siteUrl: GlobalEnvs.SiteUrl,
		path: '/',
		title: 'The Flip Effect | Tracking Power, Money, and the Limits on Both',
		description:
			'Independent civic tracking: the balance of power in Congress, presidential approval, household prices, and a civics quiz on the constitutional limits of power.',
		image: `${GlobalEnvs.SiteUrl}/og-civics-quiz.jpg`,
		platforms: ['threads'],
	});

	const mainContainerStyleClasses = twMerge(
		clsx(
			'relative min-h-screen w-full overflow-hidden',
			'bg-transparent text-slate-950',
			'dark:text-white',
		),
	);

	return {
		mainContainerStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
