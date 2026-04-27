// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//       API >> ACTION  >> SEND-MAGIC-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { tryCatchHandler } from '../../../lib';
import type { VerificationLinkResultType } from '../../types/VerificationLinkResultType';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function sendMagicLinkAction(
  email: string,
): Promise<VerificationLinkResultType> {
  const { VITE_MAGIC_LINK_API_URL } = import.meta.env;
  
  const sendMagicLinkRequest = async (): Promise<VerificationLinkResultType> => {
    if (!email?.includes('@') || !VITE_MAGIC_LINK_API_URL) {
      return {
        success: false,
        message: !email ? 'Invalid email address.' : 'API URL not configured.',
      };
    }
    
    const payloadReqBody = {
      json: {
        email,
      },
    };
    
    const data = await kyMap.post(
      VITE_MAGIC_LINK_API_URL,
      payloadReqBody,
    ).json<VerificationLinkResultType>();
    
    const result = {
      success: !!data?.success,
      message: data?.message || 'Magic link sent!',
    };
    
    return result;
  };
  
  const result = await tryCatchHandler<VerificationLinkResultType>({
    asyncActionCallback: sendMagicLinkRequest,
    errorContext: 'Error sending magic link',
  });
  
  const error403 = {
    success: false,
    message: '403 Forbidden: You do not have permission to access this resource.',
  };
  
  return result ?? error403;
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
