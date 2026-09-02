// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API > SUPABASE-CLIENT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// Supabase JavaScript SDK client initialization.
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GlobalEnvs } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class SupabaseContext {
  // --- Use strict typing and drop the legacy underscore prefix for private fields ---
  private static client: SupabaseClient | null = null;
  
  /**
   * Initializes and returns the Supabase client.
   * @returns SupabaseClient - The initialized Supabase client.
   */
  public static getClient(): SupabaseClient {
    if (this.client === null) {
      const supabaseUrl: string | undefined = GlobalEnvs.SupabaseUrl;
      const supabaseAnonKey: string | undefined = GlobalEnvs.SupabaseAnonKey;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and anon key are required.');
      }

      this.client = createClient(supabaseUrl, supabaseAnonKey);
    }

    // At this point `client` is guaranteed to be non-null
    return this.client;
  }
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
