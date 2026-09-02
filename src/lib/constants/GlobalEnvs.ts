// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > CONSTANTS > GLOBAL_ENVS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type GlobalEnvKey =
	| 'VITE_API_URL'
	| 'VITE_STRIPE_DONATION_URL'
	| 'VITE_STRIPE_PUBLISHABLE_KEY'
	| 'VITE_STRIPE_PRODUCT_ID'
	| 'VITE_EMAILJS_SERVICE_ID'
	| 'VITE_EMAILJS_TEMPLATE_ID'
	| 'VITE_EMAILJS_PUBLIC_KEY'
	| 'VITE_MAGIC_LINK_API_URL'
	| 'VITE_VERIFY_MAGIC_LINK_API_URL'
	| 'VITE_RESET_PASSWORD_LINK_API_URL'
	| 'VITE_RESET_PASSWORD_API_URL'
	| 'VITE_SIGNIN_API_URL'
	| 'VITE_SIGNOUT_API_URL'
	| 'VITE_SUPABASE_URL'
	| 'VITE_SUPABASE_ANON_KEY'
	| 'VITE_EPSTEIN_FILES_URL'
	| 'VITE_LEAVING_MAGA_URL'
	| 'VITE_CIVIC_WORKER_URL'
	| 'VITE_BLOG_CURRENT_API_URL'
	| 'VITE_BLOG_PUBLISH_API_URL'
	| 'VITE_BLOG_HARD_REMOVE_API_URL';

type EnvValue = string | boolean | undefined;
type EnvMap = Record<string, EnvValue>;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Single typed reader for Vite environment values.
// This keeps actions and context files from reaching into import.meta.env directly.
// ---
export class GlobalEnvs {
	// --- App Environment Variables ---
	static readonly ApiUrl = GlobalEnvs.getEnv('VITE_API_URL');

	// --- Stripe Environment Variables ---
	static readonly StripeDonationUrl = GlobalEnvs.getEnv(
		'VITE_STRIPE_DONATION_URL',
	);
	static readonly StripePublishableKey = GlobalEnvs.getEnv(
		'VITE_STRIPE_PUBLISHABLE_KEY',
	);
	static readonly StripeProductId = GlobalEnvs.getEnv(
		'VITE_STRIPE_PRODUCT_ID',
	);

	// --- EmailJS Environment Variables ---
	static readonly EmailJSServiceId = GlobalEnvs.getEnv(
		'VITE_EMAILJS_SERVICE_ID',
	);
	static readonly EmailJSTemplateId = GlobalEnvs.getEnv(
		'VITE_EMAILJS_TEMPLATE_ID',
	);
	static readonly EmailJSPublicKey = GlobalEnvs.getEnv(
		'VITE_EMAILJS_PUBLIC_KEY',
	);

	// --- Auth Environment Variables ---
	static readonly MagicLinkApiUrl = GlobalEnvs.getEnv('VITE_MAGIC_LINK_API_URL');
	static readonly VerifyMagicLinkApiUrl = GlobalEnvs.getEnv(
		'VITE_VERIFY_MAGIC_LINK_API_URL',
	);
	static readonly ResetPasswordLinkApiUrl = GlobalEnvs.getEnv(
		'VITE_RESET_PASSWORD_LINK_API_URL',
	);
	static readonly ResetPasswordApiUrl = GlobalEnvs.getEnv(
		'VITE_RESET_PASSWORD_API_URL',
	);
	static readonly SignInApiUrl = GlobalEnvs.getEnv('VITE_SIGNIN_API_URL');
	static readonly SignOutApiUrl = GlobalEnvs.getEnv('VITE_SIGNOUT_API_URL');

	// --- Supabase Environment Variables ---
	static readonly SupabaseUrl = GlobalEnvs.getEnv('VITE_SUPABASE_URL');
	static readonly SupabaseAnonKey = GlobalEnvs.getEnv('VITE_SUPABASE_ANON_KEY');

	// --- BlogPost Environment Variables ---
	static readonly BlogCurrentApiUrl = GlobalEnvs.getEnv(
		'VITE_BLOG_CURRENT_API_URL',
	);
	static readonly BlogPublishApiUrl = GlobalEnvs.getEnv(
		'VITE_BLOG_PUBLISH_API_URL',
	);
	static readonly BlogHardRemoveApiUrl = GlobalEnvs.getEnv(
		'VITE_BLOG_HARD_REMOVE_API_URL',
	);

	// --- Public Resource Environment Variables ---
	static readonly EpsteinFilesUrl = GlobalEnvs.getEnv(
		'VITE_EPSTEIN_FILES_URL',
		'https://www.justice.gov/epstein',
	);
	static readonly LeavingMagaUrl = GlobalEnvs.getEnv(
		'VITE_LEAVING_MAGA_URL',
		'https://leavingmaga.org/',
	);

	// --- Civic Representative Environment Variables ---
	// --- Single Worker origin; the Worker owns the civic sources + the Open States key. ---
	static readonly CivicWorkerUrl = GlobalEnvs.getEnv(
		'VITE_CIVIC_WORKER_URL',
		'http://localhost:8787',
	);

	private static getEnv(key: GlobalEnvKey, fallback = ''): string {
		const envVariables: EnvMap = import.meta.env;
		const value = envVariables[key];
		const result =
			typeof value === 'string' && value.trim().length > 0
				? value
				: fallback;

		return result;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
