// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//        ROUTER > COMPOSABLES > GUARD-ADMIN-ROUTE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { NavigationGuard } from 'vue-router';
import { UseSessionStore } from '../../lib/stores/UseSessionStore';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Guard factory for admin routes — attach with `beforeEnter` at the
// route line in routes.ts. The ROUTER is the toggle:
//
//   beforeEnter: guardAdminRoute()                      — fully protected
//   beforeEnter: guardAdminRoute({ allowPublic: true }) — public + admin view
//   (comment the line out)                              — no guard, UI maintenance
//
// allowPublic — unauthenticated users pass through; the page decides
// what they see via UseAdminVisibleComposable() + <Show>.
// ---

type GuardAdminRouteOptions = {
	allowPublic?: boolean;
};

export const guardAdminRoute = (options?: GuardAdminRouteOptions): NavigationGuard => {
	return () => {
		const sessionStore = UseSessionStore();

		// --- Pattern match: allow if logged in OR public access allowed ---
		return (
			sessionStore.isLoggedIn || options?.allowPublic
				? true
				: { name: 'access-denied' }
		);
	};
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
