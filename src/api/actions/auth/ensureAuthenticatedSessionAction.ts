// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API:VERIFY-MAGIC-LINK-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// ky: A tiny and elegant HTTP client based on the browser Fetch API.
import kyMap from 'ky';
import { tryCatchHandler } from '../../../lib';
import { SupabaseContext } from '../../context/supabase-context';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type VerifyMagicLinkResultType = {
  success: boolean;
  message?: string;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// TODO: Add file to template!!!
export async function ensureAuthenticatedSessionAction(): Promise<VerifyMagicLinkResultType> {
  // e.g. /api/admin/verify-email
  const { VITE_VERIFY_MAGIC_LINK_API_URL } = import.meta.env;
  
  const verifyMagicLinkRequest = async (): Promise<VerifyMagicLinkResultType> => {
    if (!VITE_VERIFY_MAGIC_LINK_API_URL) {
      return { success: false, message: 'API URL not configured.' };
    }
    
    const supabase = SupabaseContext.getClient();
    // --- 
    // Returns the session, refreshing it if necessary. The session returned 
    // can be null if the session is not detected which can happen in the event 
    // a user is not signed-in or has logged out. 
    // ---
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user?.email) {
      return { success: false, message: 'No authentication session found.' };
    }
    
    // -- POST email to backend for admin verification --
    const data = await kyMap.post(VITE_VERIFY_MAGIC_LINK_API_URL, {
      json: { email: session.user.email.toLowerCase() },
    }).json<VerifyMagicLinkResultType>();
    
    return {
      success: !!data?.success,
      message: data?.message ?? 'Admin email check failed.',
    };
  };
  
  const result = await tryCatchHandler<VerifyMagicLinkResultType>({
    asyncActionCallback: verifyMagicLinkRequest,
    errorContext: 'Error verifying magic link',
  });
  
  return result ?? {
    success: false,
    message: '403 Forbidden: You do not have permission to access this resource.',
  };
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
