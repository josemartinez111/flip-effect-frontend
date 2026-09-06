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
		{ path: '/', label: 'Home' },
		{ path: '/balance-of-power', label: 'Balance of Power' },
		{ path: '/blog', label: 'Blog' },
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
