// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//  LIB > GLOBAL-COMPOSABLES-HOOKS > USE-ADMIN-VISIBLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { computed, type ComputedRef } from 'vue';
import { UseSessionStore } from '../stores/UseSessionStore';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Admin visibility gate — decides which VERSION of a page renders.
// Pair with <Show :when="isAdmin"> for the admin/public split.
// Fully reactive: log in/out and the page version swaps live.
//
// Mode (strict union — typos fail compile):
//   'auth'        → admin UI only for logged-in sessions (normal mode)
//   'maintenance' → force-show admin UI with NO auth (scaffold/maintenance)
// The ROUTER injects the mode via route props — flip it in routes.ts.
// ---
export type AdminVisibleMode = 
	'auth' 
	| 'maintenance';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const useAdminVisible = (mode: AdminVisibleMode): ComputedRef<boolean> => {
	const sessionStore = UseSessionStore();

	// --- Thunks, not values — isLoggedIn must be READ inside computed to stay reactive ---
	const modePatterns: Record<AdminVisibleMode, () => boolean> = {
		maintenance: () => true,
		auth: () => sessionStore.isLoggedIn,
	};

	return computed(() => modePatterns[mode]());
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
