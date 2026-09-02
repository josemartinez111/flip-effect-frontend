// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > STORES
// > USE_SESSION_STORE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { Utils } from '../../lib';
import { signinAction, signoutAction } from '../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type AuthSession = {
  isLoggedIn: boolean;
  expiresAt: number;
  email?: string;
};

const APP_AUTH_SESSION_KEY = 'appAuthSession';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const UseSessionStore = defineStore('sessionStore', () => {
  // --- State (persisted to localStorage) ---
  const session = useLocalStorage<AuthSession | null>(APP_AUTH_SESSION_KEY, null);

  // --- Getters ---
  const isLoggedIn = computed((): boolean => {
    return !!session.value && !Utils.isSessionExpired(session.value.expiresAt);
  });

  // --- Actions ---
  function clearIfExpired(): void {
    if (session.value && Utils.isSessionExpired(session.value.expiresAt)) {
      session.value = null;
    }
  }

  const setSession = (nextSession: AuthSession | null): void => {
    session.value = nextSession;
    clearIfExpired();
  };

  const clearSession = (): void => {
    session.value = null;
  };

  const login = async (email: string, password: string) => {
    const result = await signinAction(email, password);

    if (result.success) {
      session.value = {
        isLoggedIn: true,
        expiresAt: Utils.getSessionExpiration({ expiresAt: 24, unit: 'hours' }),
        email: email.trim().toLowerCase(),
      };
    }

    return result;
  };

  const logout = async (): Promise<void> => {
    await signoutAction();
    clearSession();
  };

  clearIfExpired();
  watch(session, () => { clearIfExpired(); });

  return {
    session,
    isLoggedIn,
    login,
    logout,
    setSession,
    clearSession,
    clearIfExpired,
  };
});

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
