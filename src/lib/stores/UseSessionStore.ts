// ---------------------------------------------------------
//              stores/UseSessionStore.ts
// ---------------------------------------------------------
import { defineStore } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { isSessionExpired, getSessionExpiration } from '../../lib';
import { signinAction, signoutAction } from '../../api';
// ---------------------------------------------------------

type AuthSession = {
  isLoggedIn: boolean;
  expiresAt: number;
  email?: string;
};

// ---------------------------------------------------------

export const UseSessionStore = defineStore('sessionStore', () => {
  // --- State (persisted to localStorage) ---
  const session = useLocalStorage<AuthSession | null>('fftwSession', null);

  // --- Getters ---
  const isLoggedIn = computed((): boolean => {
    return !!session.value && !isSessionExpired(session.value.expiresAt);
  });

  // --- Actions ---
  function clearIfExpired(): void {
    if (session.value && isSessionExpired(session.value.expiresAt)) {
      session.value = null;
    }
  }

  const login = async (email: string, password: string) => {
    const result = await signinAction(email, password);

    if (result.success) {
      session.value = {
        isLoggedIn: true,
        expiresAt: getSessionExpiration({ expiresAt: 24, unit: 'hours' }),
      };
    }

    return result;
  };

  const logout = async (): Promise<void> => {
    await signoutAction();
    session.value = null;
  };

  // --- Expire session on mount and whenever session changes ---
  onMounted(() => { clearIfExpired(); });
  watch(session, () => { clearIfExpired(); });

  return { session, isLoggedIn, login, logout };
});

// ---------------------------------------------------------
