// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > UTILS > YOUTUBE_IFRAME_API_UTILS.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type { YouTubeIframeAPI } from '../types/YouTubePlayerTypes';
import { Utils } from './utils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export class YouTubeIframeAPIUtils {
	private static readonly IFRAME_API_URL =
		'https://www.youtube.com/iframe_api';
	private static readonly VIDEO_ID_PATTERN = /^[0-9A-Za-z_-]{11}$/;
	private static iframeAPIPromise: Promise<YouTubeIframeAPI> | undefined;

	private static fetchValidVideoId(
		videoId: string | null | undefined,
	): string | undefined {
		const normalizedVideoId = videoId?.trim();

		if (
			!normalizedVideoId ||
			!YouTubeIframeAPIUtils.VIDEO_ID_PATTERN.test(normalizedVideoId)
		) {
			return undefined;
		}

		return normalizedVideoId;
	}

	// --- Accept standard, short, Shorts, live, embed, and raw YouTube video IDs. ---
	static fetchVideoId(videoUrl: string): string | undefined {
		const directVideoId =
			YouTubeIframeAPIUtils.fetchValidVideoId(videoUrl);

		if (directVideoId) {
			return directVideoId;
		}

		const parseYouTubeURLCallback = (): URL => new URL(videoUrl);
		
		const parsedURLResults = Utils.runTryCatchSync<URL>({
			callback: parseYouTubeURLCallback,
			errorContext: 'PARSE_YOUTUBE_VIDEO_URL',
		});

		if (parsedURLResults.error !== undefined) {
			return undefined;
		}

		const parsedURL = parsedURLResults.result;
		const hostname = parsedURL.hostname.toLowerCase();
		const pathnameParts = parsedURL.pathname.split('/').filter(Boolean);
		
		const isYouTubeHostname =
			hostname === 'youtube.com' ||
			hostname.endsWith('.youtube.com') ||
			hostname === 'youtube-nocookie.com' ||
			hostname.endsWith('.youtube-nocookie.com');

		if (hostname === 'youtu.be') {
			return YouTubeIframeAPIUtils.fetchValidVideoId(pathnameParts[0]);
		}

		if (!isYouTubeHostname) {
			return undefined;
		}

		const queryVideoId = YouTubeIframeAPIUtils.fetchValidVideoId(
			parsedURL.searchParams.get('v'),
		);

		if (queryVideoId) {
			return queryVideoId;
		}

		const pathType = pathnameParts[0];
		const pathVideoId = pathnameParts[1];

		if (
			pathType === 'embed' ||
			pathType === 'shorts' ||
			pathType === 'live'
		) {
			return YouTubeIframeAPIUtils.fetchValidVideoId(pathVideoId);
		}

		return undefined;
	}

	static fetchThumbnailUrl(videoId: string): string {
		return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
	}

	// --- One shared script promise supports every mounted player without replacing another instance's ready callback. ---
	static fetchIframeAPI(): Promise<YouTubeIframeAPI> {
		if (window.YT?.Player) {
			return Promise.resolve(window.YT);
		}

		if (YouTubeIframeAPIUtils.iframeAPIPromise) {
			return YouTubeIframeAPIUtils.iframeAPIPromise;
		}

		const iframeAPIPromise = new Promise<YouTubeIframeAPI>(
			(resolve, reject) => {
				const previousReadyCallback = window.onYouTubeIframeAPIReady;
				let iframeAPIScript = document.querySelector<HTMLScriptElement>(
					`script[src="${YouTubeIframeAPIUtils.IFRAME_API_URL}"]`,
				);

				window.onYouTubeIframeAPIReady = (): void => {
					if (previousReadyCallback) {
						const runPreviousReadyCallback = (): void => {
							previousReadyCallback();
						};
						const previousCallbackResults = Utils.runTryCatchSync<void>({
							callback: runPreviousReadyCallback,
							errorContext: 'YOUTUBE_IFRAME_PREVIOUS_READY_CALLBACK',
						});

						if (previousCallbackResults.error !== undefined) {
							console.error(previousCallbackResults.error.message);
						}
					}

					const iframeAPI = window.YT;

					if (!iframeAPI?.Player) {
						reject(
							new Error('The YouTube player API did not initialize.'),
						);

						return;
					}

					resolve(iframeAPI);
				};

				if (!iframeAPIScript) {
					iframeAPIScript = document.createElement('script');
					iframeAPIScript.src = YouTubeIframeAPIUtils.IFRAME_API_URL;
					iframeAPIScript.async = true;
					document.head.append(iframeAPIScript);
				}

				iframeAPIScript.addEventListener(
					'error',
					() => {
						iframeAPIScript?.remove();
						reject(
							new Error('The YouTube player API could not be loaded.'),
						);
					},
					{ once: true },
				);
			},
		);

		YouTubeIframeAPIUtils.iframeAPIPromise = iframeAPIPromise.catch(
			(error: unknown) => {
				YouTubeIframeAPIUtils.iframeAPIPromise = undefined;

				throw error;
			},
		);

		return YouTubeIframeAPIUtils.iframeAPIPromise;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
