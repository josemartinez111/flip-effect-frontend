// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > TYPES > YOUTUBE_PLAYER_TYPES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type YouTubePlayerState =
	'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export type YouTubePlayerVideo = {
	videoId: string;
	title: string;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// --- `position` is carried on the item itself because a circular carousel clones items and
// hands cloned slots a clone-local index that no longer matches the source collection. ---
export type PlayableYouTubeVideo = {
	videoId: string;
	videoUrl: string;
	thumbnailUrl: string;
	position: number;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export type YouTubePlayerEvent = {
	data: number;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export type YouTubePlayerOptions = {
	videoId: string;
	height?: string;
	width?: string;
	playerVars?: Record<string, string | number>;
	events?: {
		onReady?: () => void;
		onStateChange?: (event: YouTubePlayerEvent) => void;
		onError?: (event: YouTubePlayerEvent) => void;
	};
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export interface YouTubePlayerInstance {
	playVideo(): void;
	pauseVideo(): void;
	stopVideo(): void;
	cueVideoById(videoId: string): void;
	destroy(): void;
	getIframe(): HTMLIFrameElement;
}
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export interface YouTubePlayerConstructor {
	new (
		element: HTMLElement,
		options: YouTubePlayerOptions,
	): YouTubePlayerInstance;
}
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export type YouTubeIframeAPI = {
	Player: YouTubePlayerConstructor;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// --- PrimeVue Button color tokens; keeps the caller on autocomplete instead of guessing raw strings. ---
export type YouTubeButtonSeverity =
	| 'secondary'
	| 'success'
	| 'info'
	| 'warn'
	| 'help'
	| 'danger'
	| 'contrast';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// ---
// Tailwind class props stay open-ended, but the preset members keep IDE autocomplete alive.
// `string & NonNullable<unknown>` is the union-preserving trick: without a widening member
// TypeScript collapses the whole union down to plain `string` and every suggestion disappears.
// `NonNullable<unknown>` resolves to `{}` for TypeScript, so literals stay suggestible, while
// Vue's prop compiler treats it as unknown and drops it — leaving the strict runtime
// `type: String`. The older `(string & {})` widens the runtime prop to `[String, Object]`
// and a `${string}` member erases the runtime type entirely, so both are avoided.
// ---
export type YouTubeCardWidthClasses =
	| 'laptop:w-1/2'
	| 'laptop:w-3/4'
	| 'laptop:w-full'
	| 'laptop:w-3/4 desktop:max-w-6xl'
	| (string & NonNullable<unknown>);
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// ---
// Runtime color values, not class names. Tailwind cannot emit a class it never sees as literal
// text, so a color chosen at runtime has to travel as a CSS custom property instead. Theme
// tokens from `app.css` are already CSS variables, which is why `var(--color-brand-teal)` and a
// raw `#778FFB` are both valid here. `transparent` is also valid and is the shipped default for
// the navigation button surface.
// ---
export type YouTubeCarouselNavigationColor =
	| 'transparent'
	| 'currentColor'
	| 'var(--color-brand-blue)'
	| 'var(--color-brand-teal)'
	| 'var(--color-brand-pink)'
	| 'var(--color-brand-purple)'
	| 'var(--color-brand-orange)'
	| (string & NonNullable<unknown>);
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export type YouTubeCardColorClasses =
	| 'border-slate-900/10 bg-white/80 shadow-slate-950/15'
	| 'dark:border-white/10 dark:bg-slate-950/90 dark:shadow-black/40'
	| (string & NonNullable<unknown>);
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// ---
// Public contract for FWTYouTubeVideoPlayer. Every visual prop is optional and falls back to
// the component defaults, so existing call sites keep rendering exactly as they do today.
// ---
export type YouTubeVideoPlayerProps = {
	videoUrl?: string;
	videoUrls?: Array<string>;
	title?: string;
	cardWidthClasses?: YouTubeCardWidthClasses;
	cardColorLight?: YouTubeCardColorClasses;
	cardColorDark?: YouTubeCardColorClasses;
	buttonClasses?: string;
	playButtonSeverity?: YouTubeButtonSeverity;
	pauseButtonSeverity?: YouTubeButtonSeverity;
	stopButtonSeverity?: YouTubeButtonSeverity;
	carouselCircular?: boolean;
	carouselNavigationSeverity?: YouTubeButtonSeverity;
	carouselNavigationColor?: YouTubeCarouselNavigationColor;
	carouselNavigationIconColor?: YouTubeCarouselNavigationColor;
	carouselNavigationClasses?: string;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// ---
// Every browser tab has one big shared box called `window`. Anything a script
// hangs on it, any other script can reach. TypeScript ships its own list of
// what lives in that box, and YouTube's player script is not on the list,
// because we load that script ourselves at runtime from YouTube's servers.
//
// When it lands, it bolts two brand-new things onto `window`:
//   window.YT                       -> the player toolkit we build players with
//   window.onYouTubeIframeAPIReady  -> a function slot we fill in first, that
//                                      YouTube calls once the toolkit is ready
//
// `declare global` is us reaching out of this file and adding those two names
// to TypeScript's list. It only works because `interface` merges: writing
// `interface Window` a second time does not replace the built-in Window, it
// glues our two fields onto it. So `window.location` still works fine.
//
// The `?` on both is honest, not lazy. Until YouTube's script finishes
// downloading, they really are `undefined`, so TypeScript makes us check
// before touching them (`if (!window.YT) { ... }`).
//
// And `declare` means describe only, never create. It is a note to the
// compiler, so it produces zero JavaScript. At runtime the real values come
// from YouTube's script, not from this file.
// ---
declare global {
	interface Window {
		YT?: YouTubeIframeAPI;
		onYouTubeIframeAPIReady?: () => void;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
