// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//   API >> ACTION >> SEND-RESET-PASSWORD-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { tryCatchHandler } from '../../../lib';
import type { VerificationLinkResultType } from '../../types/VerificationLinkResultType';

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function sendResetPasswordLinkAction(
  email: string,
): Promise<VerificationLinkResultType> {
  // -- Grab API URL from env --
  const { VITE_RESET_PASSWORD_LINK_API_URL } = import.meta.env;
  
  const sendResetPasswordLinkRequest = async (): Promise<VerificationLinkResultType> => {
    // -- Check email and API URL, basic validation to avoid dumb errors --
    if (!email?.includes('@') || !VITE_RESET_PASSWORD_LINK_API_URL) {
      return {
        success: false,
        message: !email ? 'Invalid email address.' : 'API URL not configured.',
      };
    }
    
    // -- Build payload, keep it clean with snake_case for backend --
    const payloadReqBody = {
      json: { email },
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // -- Hit the API, pray for 200 OK --
    const data = await kyMap.post(
      VITE_RESET_PASSWORD_LINK_API_URL,
      payloadReqBody,
    ).json<VerificationLinkResultType>();
    
    // -- Parse response, default message if backend’s feeling lazy --
    const result = {
      success: !!data?.success,
      message: data?.message || 'Reset link sent!',
    };
    
    return result;
  };
  
  // -- Wrap in try-catch, don’t let Supabase’s 403 sneak through unhandled --
  const result = await tryCatchHandler<VerificationLinkResultType>({
    asyncActionCallback: sendResetPasswordLinkRequest,
    errorContext: 'Error sending reset password link',
  });
  
  // -- Fallback for 403, in case Supabase’s still pissed --
  const error403 = {
    success: false,
    message: '403 Forbidden: You do not have permission to access this resource.',
  };
  
  return result ?? error403;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
