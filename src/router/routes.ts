// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                    ROUTER > ROUTES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from 'vue-router';
import { DominoEffectBGHomePage } from '../assets';
import RootLayout from '../pages/layouts/RootLayout.vue';
import { APP_AUTH_MODE, type AuthMode } from '../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type BlogRouteProps = {
	adminMode: AuthMode;
};

type AuthRouteProps = {
	authMode: AuthMode;
};

const blogRouteProps: BlogRouteProps = {
	adminMode: APP_AUTH_MODE,
};

const authRouteProps: AuthRouteProps = {
	authMode: APP_AUTH_MODE,
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const routes: Readonly<Array<RouteRecordRaw>> = [
	// --- Home Route ---
	{
		path: '/',
		// --- Routes nested here inherit the shared app shell: navbar, footer, and layout background ---
		component: RootLayout,
		children: [
			{
				path: '',
				name: 'home',
				component: () => import('../pages/home/home.page.vue'),
				meta: {
					showLayoutBackground: true,
					layoutBackgroundImage: DominoEffectBGHomePage,
				},
			},
			// --- America in Focus Route ---
			{
				path: 'america-in-focus',
				name: 'america-in-focus',
				component: () =>
					import('../pages/america-in-focus/america-in-focus.page.vue'),
				meta: {
					showLayoutBackground: true,
					layoutBackgroundImage: DominoEffectBGHomePage,
				},
			},
			// --- Civics Quiz Route ---
			{
				path: 'civics-quiz',
				name: 'civics-quiz',
				// --- Shareable, indexable twin of the home page quiz modal. ---
				component: () => import('../pages/civics-quiz/civics-quiz.page.vue'),
				meta: {
					showLayoutBackground: true,
					layoutBackgroundImage: DominoEffectBGHomePage,
				},
			},
			// --- Preserve existing bookmarks while navigation uses the renamed page. ---
			{ path: 'balance-of-power', redirect: { name: 'america-in-focus' } },
			// --- Blog Route ---
			{
				path: 'blog',
				name: 'blog',
				// --- Always public — adminMode decides which VERSION renders (admin vs public) ---
				// --- The centralized mode force-shows admin controls only during local maintenance work. ---
				props: blogRouteProps,
				component: () => import('../pages/blog/blog.page.vue'),
			},
		],
	},
	// --- Admin Auth Routes ---
	{
		path: '/admin/login',
		name: 'admin-login',
		// --- Default entry screen — always renders. authMode controls token processing only. ---
		// --- Production always resolves to auth; local maintenance skips unfinished token processing. ---
		props: authRouteProps,
		component: () => import('../pages/auth/login/login.page.vue'),
	},
	// --- Admin Magic Link Route ---
	{
		path: '/admin/magic',
		name: 'admin-magic-link',
		// --- Admin verification request screen — backend verifies the email. ---
		props: authRouteProps,
		component: () =>
			import('../pages/auth/magic-link/magic-link.page.vue'),
	},
	// --- Admin Reset Password Route ---
	{
		path: '/admin/update-password',
		name: 'admin-update-password',
		// --- Auth-only screen in production; maintenance mode shows the form for UI review. ---
		// --- Production verifies Supabase reset tokens before rendering this form. ---
		props: authRouteProps,
		component: () =>
			import('../pages/auth/update-password/update-password.page.vue'),
	},
	// --- Admin Reset Password Route ---
	{
		path: '/access-denied',
		name: 'access-denied',
		component: () =>
			import('../pages/error-pages/access-denied/access-denied.page.vue'),
	},
	// --- 404 Not Found Route ---
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () =>
			import('../pages/error-pages/not-found/not-found.page.vue'),
	},
] as const;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// noinspection JSUnusedGlobalSymbols
export const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 };
	},
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
