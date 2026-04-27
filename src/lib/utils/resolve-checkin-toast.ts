// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//      LIB > UTILS > RESOLVE-CHECKIN-TOAST.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CheckInToastResult = {
  severity: 'warn' | 'error';
  summary: string;
};

// ---
// Pure function — maps a failed check-in backend message to toast metadata.
// "Already checked in" responses get warn (amber), everything else gets error (red).
// Extracted from CheckInTab so it can be unit tested without rendering the component.
// ---
export const resolveCheckInToast = (message: string | undefined): CheckInToastResult => {
  if (/already|checked.?in/i.test(message ?? '')) {
    return { severity: 'warn', summary: 'Already Checked In' };
  }
  return { severity: 'error', summary: 'Check-in failed' };
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
