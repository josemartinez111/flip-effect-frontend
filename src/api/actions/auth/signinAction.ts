//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                 API >> ACTIONS >> SIGNIN-ACTION.TS
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { tryCatchHandler } from '../../../lib';
import type { Session, AuthError } from '@supabase/supabase-js';
//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type SignInActionResultType = {
  success: boolean;
  message?: string;
  session?: Session;
  error?: AuthError;
};

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function signinAction(email: string, password: string): Promise<SignInActionResultType> {
  const { VITE_SIGNIN_API_URL } = import.meta.env;
  
  const signInRequest = async (): Promise<SignInActionResultType> => {
    if (!VITE_SIGNIN_API_URL) {
      return { success: false, message: 'Sign-in API URL not configured.' };
    }
    
    const payloadBody = {
      json: { email, password },
    };
    const response = await kyMap
      .post(VITE_SIGNIN_API_URL, payloadBody)
      .json<SignInActionResultType>();
    
    // Adapt structure if your API returns differently
    switch (true) {
      case response.success:
        return response;
      default:
        return { success: false, message: response.message || 'Sign-in failed.' };
    }
  };
  
  const result = await tryCatchHandler<SignInActionResultType>({
    asyncActionCallback: signInRequest,
    errorContext: 'Error during admin sign in',
  });
  
  return result ?? {
    success: false,
    message: 'Sign in failed: Unknown error.',
  };
}

//⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
