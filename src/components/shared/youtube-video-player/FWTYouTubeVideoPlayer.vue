<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: SHARED > YOUTUBE-VIDEO-PLAYER
    > FWT_YOUTUBE_VIDEO_PLAYER.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import Button from 'primevue/button';
import Carousel, {
	type CarouselResponsiveOptions,
} from 'primevue/carousel';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { twMerge } from 'tailwind-merge';
import { UseYouTubePlayerComposable } from '../../../lib/global-composables-hooks/UseYouTubePlayerComposable';
import type {
	PlayableYouTubeVideo,
	YouTubePlayerVideo,
	YouTubeVideoPlayerProps,
} from '../../../lib/types/YouTubePlayerTypes';
import { YouTubeIframeAPIUtils } from '../../../lib/utils/YouTubeIframeAPIUtils';
import Show from '../../utils/Show.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// Every prop except the video source is optional. Passing none renders the shipped card.
//
// Single video:
// <FWTYouTubeVideoPlayer
// 	:video-url="YOUTUBE_VIDEO_URL"
// 	title="Featured Video"
// />
//
// Multiple videos — two or more URLs adds the thumbnail carousel automatically:
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	title="Featured Videos"
// />
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Card size and color ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// `cardWidthClasses` replaces only the width defaults, so `mx-auto` and the padding survive.
// Pass any Tailwind width or max-width utilities; the presets are only autocomplete hints.
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	card-width-classes="laptop:w-3/4 desktop:max-w-6xl"
// />
//
// `cardColorLight` and `cardColorDark` are merged over the defaults, so the last class wins per
// property group. Write the `dark:` prefix yourself — Tailwind reads class names as literal text
// and cannot add a variant at runtime.
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	card-color-light="border-cyan-600/20 bg-cyan-50 shadow-cyan-950/15"
// 	card-color-dark="dark:border-cyan-300/20 dark:bg-slate-900 dark:shadow-black/50"
// />
//
// Both props also drive the empty-state fallback, so the layout keeps its size and palette when
// no valid video URL is supplied.
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Card size and color ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Play / pause / stop buttons ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// Color is a `severity` prop per button, never a Tailwind class. See the cascade note below for
// why. Valid values: secondary, success, info, warn, help, danger, contrast.
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	play-button-severity="success"
// 	pause-button-severity="secondary"
// 	stop-button-severity="contrast"
// />
//
// `buttonClasses` applies to all three and is for shape, not color:
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	button-classes="tablet:w-40 rounded-full text-sm"
// />
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Play / pause / stop buttons ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Carousel arrows ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// Two colors, two targets:
//   `carouselNavigationColor`     -> the round button surface behind the arrow
//   `carouselNavigationIconColor` -> the `<` `>` glyph itself
//
// Both take a color VALUE, not a class, so a hex works directly:
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	carousel-navigation-color="#778FFB"
// 	carousel-navigation-icon-color="#FFFFFF"
// />
//
// Theme tokens from `app.css` are CSS variables, so they pass through the same props:
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	carousel-navigation-color="var(--color-brand-teal)"
// />
//
// The glyph defaults to `currentColor`, which the component reads as "use the built-in pair"
// and renders as `text-slate-800 dark:text-slate-100` — legible on both the light and dark card,
// unlike PrimeVue's muted secondary gray. Pass any other value and that value wins instead.
//
// The button surface defaults to `transparent`, and while it stays transparent the component
// adds no background class at all — so the untouched button keeps PrimeVue's own hover fill.
// Supply a color and the background is pinned with an important flag, since unlayered PrimeVue
// would otherwise win; hover feedback then comes from a brightness shift instead of a fill swap.
//
// `carouselNavigationSeverity` still drives the PrimeVue palette underneath, which is what colors
// the ring and the default hover fill. `carouselNavigationClasses` adds classes to the glyph, for
// sizing and similar:
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	carousel-navigation-severity="contrast"
// 	carousel-navigation-color="var(--color-brand-pink)"
// 	carousel-navigation-classes="text-xl"
// />
//
// Known limit: a `hover:text-*` class passed through `carouselNavigationClasses` only fires while
// the cursor is over the glyph, because the class sits on the icon rather than the button. A
// button-wide hover glyph color needs a dedicated prop and has not been added.
//
// `carouselCircular` defaults to true so both arrows stay live and the list wraps. Setting it to
// false restores PrimeVue's clamped behavior, where the previous arrow is disabled on the first
// page and the next arrow on the last:
//
// <FWTYouTubeVideoPlayer
// 	:video-urls="YOUTUBE_VIDEO_URLS"
// 	:carousel-circular="false"
// />
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Carousel arrows ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞ PrimeVue vs Tailwind overrides ∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// Button color comes from `severity`, not Tailwind, on purpose. PrimeVue is registered in
// `src/main.ts` without the `cssLayer` option, so its CSS is unlayered while Tailwind v4
// utilities live in `@layer utilities`. Unlayered CSS always outranks layered CSS, so a
// plain `bg-*` class on a PrimeVue Button silently loses to the Aura theme.
//
// Safe through `buttonClasses`: layout, spacing, sizing, font, cursor — anything the Aura
// theme does not already set on the button.
// Not safe: background, border, and text color; those need `!bg-emerald-600` style important
// classes to win, which is why they are exposed as `severity` props instead.
//
// The carousel arrows are the exception: this component supplies their icon elements through
// the `previcon` / `nexticon` slots, so arrow styling lands on an element we own rather than on
// PrimeVue's button. A direct rule always beats an inherited color, so no important prefix.
//
// Arrow color travels as a CSS custom property, which is Tailwind's own documented answer for a
// color chosen at runtime: the utility class stays static and readable to the compiler while the
// value arrives through the variable. Tailwind can only emit classes it sees as literal text, so
// building `text-[${color}]` at runtime produces nothing at all.
//
// This is the single place the component sets a style binding, and it sets only a custom
// property — never a real CSS declaration — so all actual styling still lives in classes.
// The global fix (`cssLayer: true`) was rejected — it changes cascade order for every
// PrimeVue component in the app and in the scaffold template.
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞ PrimeVue vs Tailwind overrides ∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const {
	videoUrl,
	videoUrls = [],
	title = 'Video Section',
	cardWidthClasses = 'laptop:w-1/2',
	cardColorLight = 'border-slate-900/10 bg-white/80 shadow-slate-950/15',
	cardColorDark = 'dark:border-white/10 dark:bg-slate-950/90 dark:shadow-black/40',
	buttonClasses = '',
	playButtonSeverity = 'info',
	pauseButtonSeverity = 'warn',
	stopButtonSeverity = 'danger',
	carouselCircular = true,
	carouselNavigationSeverity = 'secondary',
	carouselNavigationColor = 'transparent',
	carouselNavigationIconColor = 'currentColor',
	carouselNavigationClasses = '',
} = defineProps<YouTubeVideoPlayerProps>();

const playerElement = useTemplateRef<HTMLDivElement>('playerElement');
const selectedVideoUrl = ref('');

// --- Build the player and carousel data from either the single URL or optional URL collection. ---
const playableVideos = computed((): Array<PlayableYouTubeVideo> => {
	const requestedVideoUrls =
		videoUrls.length > 1 ? videoUrls : videoUrl ? [videoUrl] : videoUrls;
	const videos: Array<PlayableYouTubeVideo> = [];

	for (const currentVideoUrl of requestedVideoUrls) {
		const videoId = YouTubeIframeAPIUtils.fetchVideoId(currentVideoUrl);

		if (!videoId) {
			continue;
		}

		const video: PlayableYouTubeVideo = {
			videoId,
			videoUrl: currentVideoUrl,
			thumbnailUrl: YouTubeIframeAPIUtils.fetchThumbnailUrl(videoId),
			position: videos.length + 1,
		};
		videos.push(video);
	}

	return videos;
});

const hasMultipleVideos = computed(() => playableVideos.value.length > 1);
const selectedVideo = computed((): YouTubePlayerVideo | undefined => {
	const currentVideo =
		playableVideos.value.find(
			(video) => video.videoUrl === selectedVideoUrl.value,
		) ?? playableVideos.value[0];

	if (!currentVideo) {
		return undefined;
	}

	const video: YouTubePlayerVideo = {
		videoId: currentVideo.videoId,
		title,
	};

	return video;
});

watch(
	playableVideos,
	(currentVideos) => {
		const selectedVideoStillExists = currentVideos.some(
			(video) => video.videoUrl === selectedVideoUrl.value,
		);

		if (!selectedVideoStillExists) {
			selectedVideoUrl.value = currentVideos[0]?.videoUrl ?? '';
		}
	},
	{ immediate: true },
);

const {
	playerState,
	playerError,
	isPlayerReady,
	playVideo,
	pauseVideo,
	stopVideo,
} = UseYouTubePlayerComposable({
	selectedVideo,
	playerElement,
});

const isPlaying = computed(() => playerState.value === 'playing');
const canPauseVideo = computed(
	() => isPlayerReady.value && playerState.value === 'playing',
);
const canStopVideo = computed(
	() =>
		isPlayerReady.value &&
		playerState.value !== 'unstarted' &&
		playerState.value !== 'ended',
);

// ---
// Without `circular` PrimeVue disables the previous arrow on the first page and the next arrow
// on the last, so one control always looks dead. Wrapping keeps both live, and the carousel
// only ever shows as many thumbnails as there are videos so a short list still fills the row.
// ---
const carouselVisibleCount = computed(() =>
	Math.min(playableVideos.value.length, 4),
);

// ---
// Order is load-bearing and must stay descending. Carousel builds its item-width CSS from a
// sorted copy of this array but reads `numVisible` from the raw array, taking the last entry
// whose breakpoint is at or above the window width. Listed ascending, a phone matches all three
// and lands on the widest count, so the track shifts in thirds while each item is a full column
// wide and thumbnails slide off screen. Each breakpoint is also clamped to the video count so a
// short list never leaves a half-empty row.
// ---
const responsiveOptions = computed((): Array<CarouselResponsiveOptions> => [
	{
		breakpoint: '1199px',
		numVisible: Math.min(playableVideos.value.length, 3),
		numScroll: 1,
	},
	{
		breakpoint: '899px',
		numVisible: Math.min(playableVideos.value.length, 2),
		numScroll: 1,
	},
	{
		breakpoint: '639px',
		numVisible: Math.min(playableVideos.value.length, 1),
		numScroll: 1,
	},
]);

// ---
// PrimeVue replaces its whole `prevButtonProps` / `nextButtonProps` default object when one is
// supplied, so `severity`, `text`, and `rounded` must be restated here. Dropping them is what
// turned the arrows into filled Aura primary buttons instead of quiet text arrows.
// ---
const carouselNavigationButtonProps = computed(() => ({
	severity: carouselNavigationSeverity,
	text: true,
	rounded: true,
	class: twMerge(
		clsx('cursor-pointer disabled:cursor-not-allowed', {
			// --- Applied only when a color is supplied, so the untouched button keeps
			// --- PrimeVue's own hover fill instead of being pinned to transparent.
			'bg-(--fwt-carousel-button-color)! hover:brightness-110':
				carouselNavigationColor !== 'transparent',
		}),
	),
}));

// ---
// Carousel 4.5.5 hands its previous arrow `slotProps.icon` while Button's icon slot actually
// exposes `class`, so the built-in previous chevron renders with no icon class and disappears.
// Supplying both icon slots here fixes that and puts arrow color on an element this component
// owns, which is why these classes need no important prefix.
// ---
const carouselNavigationIconStyleClasses = computed(() =>
	twMerge(
		clsx(
			'text-base leading-none',
			{
				// --- Left on the default, the glyph follows the card instead of PrimeVue's
				// --- muted secondary gray, which reads as disabled in both themes.
				'text-slate-800 dark:text-slate-100':
					carouselNavigationIconColor === 'currentColor',
				'text-[color:var(--fwt-carousel-arrow-color)]':
					carouselNavigationIconColor !== 'currentColor',
			},
			carouselNavigationClasses,
		),
	),
);

// ---
// Carries both runtime colors down to the arrows; the utility classes themselves stay static so
// Tailwind can still compile them. The button surface needs the important flag because PrimeVue
// is unlayered and would otherwise win, while the glyph sits on an element this component owns
// and needs no such flag.
// ---
const carouselNavigationColorVariables = computed(() => ({
	'--fwt-carousel-button-color': carouselNavigationColor,
	'--fwt-carousel-arrow-color': carouselNavigationIconColor,
}));

// --- Caller classes land last so twMerge lets them beat the matching default utility. ---
const playerContainerStyleClasses = computed(() =>
	twMerge(
		clsx(
			'mx-auto w-full overflow-hidden rounded-2xl border p-4 shadow-2xl tablet:p-5',
			cardWidthClasses,
			cardColorLight,
			cardColorDark,
		),
	),
);

// --- Shared button chrome; color stays on the severity props for cascade reasons noted above. ---
const playerButtonStyleClasses = computed(() =>
	twMerge(
		clsx(
			'font-orbitron tablet:w-auto w-full cursor-pointer text-xs font-black',
			buttonClasses,
		),
	),
);

const playerTitleStyleClasses = twMerge(
	clsx(
		'mb-4 font-orbitron text-base font-black tracking-[0.04em]',
		'text-slate-950 dark:text-white tablet:text-lg',
	),
);

const videoStageStyleClasses = twMerge(
	clsx(
		'aspect-video min-h-50 w-full overflow-hidden rounded-xl bg-black',
		'ring-1 ring-slate-950/12 dark:ring-white/10',
	),
);

const playerErrorStyleClasses = twMerge(
	clsx(
		'mt-3 rounded-lg border px-3 py-2 font-montserrat text-sm font-bold',
		'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-200',
	),
);

// ---
// The fallback inherits the card width and colors so the layout does not jump size or
// change palette when no valid video URL is supplied; only the dashed border marks the state.
// ---
const emptyPlayerStyleClasses = computed(() =>
	twMerge(
		clsx(
			'mx-auto flex min-h-50 w-full items-center justify-center rounded-2xl',
			'border border-dashed px-6 text-center',
			'font-montserrat text-sm font-bold text-slate-600 dark:text-slate-300',
			cardWidthClasses,
			cardColorLight,
			cardColorDark,
		),
	),
);

const carouselStyleClasses = twMerge(
	clsx(
		'mt-4 rounded-2xl border px-2 py-3',
		'border-slate-900/10 bg-slate-950/6 dark:border-white/10 dark:bg-black/20',
	),
);

const carouselItemButtonStyleClasses = twMerge(
	clsx(
		'group relative mx-2 block w-[calc(100%-1rem)] cursor-pointer overflow-hidden',
		'rounded-xl border text-left shadow-lg transition duration-200',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400',
	),
);

const resolveCarouselItemStyleClasses = (
	currentVideoUrl: string,
): string => {
	return twMerge(
		clsx(carouselItemButtonStyleClasses, {
			'-translate-y-1 scale-[1.025] border-cyan-300 ring-2 ring-cyan-300/60 shadow-cyan-500/25':
				currentVideoUrl === selectedVideoUrl.value,
			'border-white/12 opacity-72 hover:opacity-100':
				currentVideoUrl !== selectedVideoUrl.value,
		}),
	);
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Show :when="selectedVideo">
		<section :class="playerContainerStyleClasses">
			<h2 :class="playerTitleStyleClasses">{{ title }}</h2>

			<!-- ∞∞∞∞∞∞∞∞ VIDEO STAGE ∞∞∞∞∞∞∞∞ -->
			<div :class="videoStageStyleClasses">
				<div ref="playerElement" class="h-full w-full" />
			</div>

			<!-- ∞∞∞∞∞∞∞∞ PLAYER CONTROLS ∞∞∞∞∞∞∞∞ -->
			<div class="tablet:flex-row mt-4 flex flex-col gap-2">
				<Button
					label="Play Video"
					icon="pi pi-play"
					:severity="playButtonSeverity"
					:disabled="!isPlayerReady || isPlaying"
					:class="playerButtonStyleClasses"
					@click="playVideo"
				/>
				<Button
					label="Pause Video"
					icon="pi pi-pause"
					:severity="pauseButtonSeverity"
					:disabled="!canPauseVideo"
					:class="playerButtonStyleClasses"
					@click="pauseVideo"
				/>
				<Button
					label="Stop Video"
					icon="pi pi-stop"
					:severity="stopButtonSeverity"
					:disabled="!canStopVideo"
					:class="playerButtonStyleClasses"
					@click="stopVideo"
				/>
			</div>

			<Show :when="playerError">
				<template #default="{ value: errorMessage }">
					<p :class="playerErrorStyleClasses" role="alert">
						{{ errorMessage }}
					</p>
				</template>
			</Show>

			<!-- ∞∞∞∞∞∞∞∞ MULTI-VIDEO SELECTOR ∞∞∞∞∞∞∞∞ -->
			<Show :when="hasMultipleVideos">
				<Carousel
					:value="playableVideos"
					:circular="carouselCircular"
					:num-visible="carouselVisibleCount"
					:num-scroll="1"
					:responsive-options="responsiveOptions"
					:show-indicators="false"
					:prev-button-props="carouselNavigationButtonProps"
					:next-button-props="carouselNavigationButtonProps"
					:class="carouselStyleClasses"
					:style="carouselNavigationColorVariables"
					aria-label="Choose a video"
					aria-roledescription="video carousel"
				>
					<template #previcon>
						<i
							:class="carouselNavigationIconStyleClasses"
							class="pi pi-chevron-left"
						/>
					</template>

					<template #nexticon>
						<i
							:class="carouselNavigationIconStyleClasses"
							class="pi pi-chevron-right"
						/>
					</template>

					<template #item="{ data: video }: { data: PlayableYouTubeVideo }">
						<button
							type="button"
							:class="resolveCarouselItemStyleClasses(video.videoUrl)"
							:aria-label="`Load video ${video.position}`"
							:aria-pressed="video.videoUrl === selectedVideoUrl"
							@click="selectedVideoUrl = video.videoUrl"
						>
							<img
								:src="video.thumbnailUrl"
								:alt="`Video ${video.position} thumbnail`"
								class="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.025]"
								loading="lazy"
							/>
							<span
								class="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/15 to-transparent"
							/>
							<span
								class="font-orbitron absolute right-2 bottom-2 rounded-full bg-slate-950/80 px-2 py-1 text-[0.65rem] font-black text-white"
							>
								{{ video.position }}
							</span>
						</button>
					</template>
				</Carousel>
			</Show>
		</section>

		<template #fallback>
			<div :class="emptyPlayerStyleClasses" role="status">
				Add a valid YouTube video link.
			</div>
		</template>
	</Show>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
