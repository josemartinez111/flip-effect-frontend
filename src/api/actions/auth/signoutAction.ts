//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API >> ACTIONS >> SIGNOUT-ACTION.TS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { tryCatchHandler } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type SignOutActionResult = {
  success: boolean;
  message?: string;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function signoutAction(): Promise<SignOutActionResult> {
  const { VITE_SIGNOUT_API_URL } = import.meta.env;
  
  const signOutRequest = async (): Promise<SignOutActionResult> => {
    if (!VITE_SIGNOUT_API_URL) {
      return { success: false, message: 'Sign-out API URL not configured.' };
    }
    
    const response = await kyMap.post(VITE_SIGNOUT_API_URL).json<SignOutActionResult>();
    
    switch (true) {
      case response.success:
        return response;
      default:
        return { success: false, message: response.message || 'Sign-out failed.' };
    }
  };
  
  const result = await tryCatchHandler<SignOutActionResult>({
    asyncActionCallback: signOutRequest,
    errorContext: 'Error during admin sign out',
  });
  
  return result ?? {
    success: false,
    message: 'Sign out failed: Unknown error.',
  };
}

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
