//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//             LIB > UTILS > GET-SESSION-EXPIRATION.TS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type UnitType = 'seconds' | 'minutes' | 'hours';

export type SessionExpirationOptions = {
  expiresAt: number; // How many units from now (e.g., 24)
  unit: UnitType;    // 'seconds' | 'minutes' | 'hours'
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const isSessionExpired = (expiresAt: number) => (
  expiresAt <= Math.floor(Date.now() / 1000)
);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

/**
 * Returns epoch seconds for X units from now.
 * ------------------------------------------------------------------------
 * Usage:
 *   getSessionExpiration({ expiresAt: 24, unit: 'hours' }) // 24 hours from now
 *   getSessionExpiration({ expiresAt: 5, unit: 'minutes' }) // 5 minutes from now
 */
export function getSessionExpiration({ expiresAt, unit }: SessionExpirationOptions): number {
  const now = Math.floor(Date.now() / 1000);
  switch (unit) {
    case 'minutes':
      return now + expiresAt * 60;
    case 'hours':
      return now + expiresAt * 3600;
    default:
      return now + expiresAt;
  }
}

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
