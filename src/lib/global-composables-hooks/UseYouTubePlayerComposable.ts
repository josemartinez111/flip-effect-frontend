// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > GLOBAL-COMPOSABLES-HOOKS > USE_YOUTUBE_PLAYER_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	watch,
	type ComputedRef,
	type Ref,
	type ShallowRef,
} from 'vue';
import type {
	YouTubePlayerInstance,
	YouTubePlayerState,
	YouTubePlayerVideo,
} from '../types/YouTubePlayerTypes';
import { YouTubeIframeAPIUtils } from '../utils/YouTubeIframeAPIUtils';
import { Utils } from '../utils/utils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type YouTubePlayerComposableOptions = {
	selectedVideo: ComputedRef<YouTubePlayerVideo | undefined>;
	playerElement: Readonly<ShallowRef<HTMLDivElement | null>>;
};

type YouTubePlayerComposable = {
	playerState: Ref<YouTubePlayerState>;
	playerError: Ref<string | undefined>;
	isPlayerReady: ComputedRef<boolean>;
	playVideo: () => void;
	pauseVideo: () => void;
	stopVideo: () => void;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Each composable owns one player while the shared loader safely serves every mounted instance. ---
export const UseYouTubePlayerComposable = ({
	selectedVideo,
	playerElement,
}: YouTubePlayerComposableOptions): YouTubePlayerComposable => {
	const playerState = ref<YouTubePlayerState>('unstarted');
	const playerError = ref<string>();
	const isPlayerReady = ref(false);
	let player: YouTubePlayerInstance | undefined;
	let isMounted = false;

	const syncPlayerState = (stateCode: number): void => {
		switch (stateCode) {
			case 0:
				playerState.value = 'ended';
				break;
			case 1:
				playerState.value = 'playing';
				break;
			case 2:
				playerState.value = 'paused';
				break;
			case 3:
				playerState.value = 'buffering';
				break;
			case 5:
				playerState.value = 'cued';
				break;
			default:
				playerState.value = 'unstarted';
		}
	};

	const playVideo = (): void => {
		player?.playVideo();
	};

	const pauseVideo = (): void => {
		player?.pauseVideo();
	};

	const stopVideo = (): void => {
		player?.stopVideo();
	};

	const initializeYouTubePlayer = async (): Promise<void> => {
		const initialVideo = selectedVideo.value;
		const initialElement = playerElement.value;

		if (!isMounted || !initialVideo || !initialElement || player) {
			return;
		}

		const fetchYouTubeIframeAPICallback = async () =>
			YouTubeIframeAPIUtils.fetchIframeAPI();
		const iframeAPIResults = await Utils.runTryCatch({
			callback: fetchYouTubeIframeAPICallback,
			errorContext: 'LOAD_YOUTUBE_IFRAME_API',
		});

		const videoToInitialize = selectedVideo.value;

		// --- The source or container may disappear while the shared SDK is loading. ---
		if (
			!isMounted ||
			playerElement.value !== initialElement ||
			!videoToInitialize ||
			player
		) {
			return;
		}

		if (iframeAPIResults.error !== undefined) {
			playerError.value = iframeAPIResults.error.message;

			return;
		}

		const iframeAPI = iframeAPIResults.result;
		player = new iframeAPI.Player(initialElement, {
			videoId: videoToInitialize.videoId,
			height: '100%',
			width: '100%',
			playerVars: {
				autoplay: 0,
				controls: 1,
				origin: window.location.origin,
				playsinline: 1,
				rel: 0,
			},
			events: {
				onReady: () => {
					if (!isMounted || playerElement.value !== initialElement) {
						return;
					}

					isPlayerReady.value = true;
					playerError.value = undefined;
					const readyVideo = selectedVideo.value ?? videoToInitialize;
					player?.getIframe().setAttribute('title', readyVideo.title);

					if (readyVideo.videoId !== videoToInitialize.videoId) {
						player?.cueVideoById(readyVideo.videoId);
					}
				},
				onStateChange: ({ data }) => {
					syncPlayerState(data);
				},
				onError: ({ data }) => {
					playerError.value = `YouTube could not play this video (error ${data}).`;
				},
			},
		});
	};

	// --- Post-render observation supports API-loaded URLs and Show removing/recreating the stage. ---
	watch(
		[selectedVideo, playerElement],
		async ([currentVideo, currentElement], [previousVideo]) => {
			if (!currentVideo || !currentElement) {
				player?.destroy();
				player = undefined;
				isPlayerReady.value = false;
				playerState.value = 'unstarted';
				playerError.value = undefined;

				return;
			}

			if (!player) {
				await initializeYouTubePlayer();

				return;
			}

			if (!isPlayerReady.value) {
				return;
			}

			player.getIframe().setAttribute('title', currentVideo.title);

			if (currentVideo.videoId !== previousVideo?.videoId) {
				playerError.value = undefined;
				player.cueVideoById(currentVideo.videoId);
			}
		},
		{ flush: 'post' },
	);

	onMounted(async () => {
		isMounted = true;
		await initializeYouTubePlayer();
	});

	onUnmounted(() => {
		isMounted = false;
		player?.destroy();
		player = undefined;
		isPlayerReady.value = false;
	});

	const youtubePlayerComposable: YouTubePlayerComposable = {
		playerState,
		playerError,
		isPlayerReady: computed(() => isPlayerReady.value),
		playVideo,
		pauseVideo,
		stopVideo,
	};

	return youtubePlayerComposable;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
