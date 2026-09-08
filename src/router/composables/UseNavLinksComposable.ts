// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//           ROUTER > COMPOSABLE > USE_NAV_LINKS_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { GlobalEnvs } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type NavLinkType = {
	path: string;
	label: string;
	external?: boolean;
	description?: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseNavLinksComposable = (): Array<NavLinkType> => {
	const NAV_LINKS: NavLinkType[] = [
		// --- site-page-links/internal links ---
		{ path: '/', label: 'Home' },
		{ path: '/america-in-focus', label: 'America in Focus' },
		// --- Internal entries render in both the desktop navbar and the drawer; externals only in the drawer. ---
		{ path: '/civics-quiz', label: 'Civics Quiz' },
		// { path: '/blog', label: 'Blog' },
		// --- backlinks/external links ---
		{
			path: GlobalEnvs.EpsteinFilesUrl,
			label: 'Epstein Files',
			external: true,
			description: 'A better-formatted Epstein files website.',
		},
		{
			path: GlobalEnvs.LeavingMagaUrl,
			label: 'Leaving MAGA',
			external: true,
			description: 'A support org to help you get away from being MAGA.',
		},
		// --- add routes here ---
	];

	return NAV_LINKS;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
