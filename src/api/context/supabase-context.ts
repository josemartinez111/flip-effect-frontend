// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                  API > SUPABASE-CLIENT.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// Supabase JavaScript SDK client initialization.
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class SupabaseContext {
  private static _client: SupabaseClient;
  
  /**
   * Initializes and returns the Supabase client.
   * @returns SupabaseClient - The initialized Supabase client.
   */
  public static getClient(): SupabaseClient {
    if (!this._client) {
      const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and anon key are required.');
      }
      
      this._client = createClient(supabaseUrl, supabaseAnonKey);
    }
    
    return this._client;
  }
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
