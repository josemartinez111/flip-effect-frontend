/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />
// noinspection JSUnusedGlobalSymbols

interface ImportMetaEnv {
  readonly VITE_STRIPE_DONATION_URL?: string;
  readonly VITE_MAGIC_LINK_API_URL?: string;
  readonly VITE_VERIFY_MAGIC_LINK_API_URL?: string;
  readonly VITE_RESET_PASSWORD_LINK_API_URL?: string;
  readonly VITE_RESET_PASSWORD_API_URL?: string;
  readonly VITE_SIGNIN_API_URL?: string;
  readonly VITE_SIGNOUT_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// --- Image format query transform declarations ---
declare module '*.png?format=webp' {
  const src: string;
  export default src;
}
declare module '*.jpg?format=webp' {
  const src: string;
  export default src;
}
declare module '*.jpeg?format=webp' {
  const src: string;
  export default src;
}
