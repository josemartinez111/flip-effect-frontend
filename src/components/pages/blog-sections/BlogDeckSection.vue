<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
COMPONENTS: PAGES > BLOG-SECTIONS
    > BLOG_DECK_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref, computed, watch } from 'vue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BlogPost } from '../../../api';
import Show from '../../utils/Show.vue';
import {
	DefaultBlogImage1,
	DefaultBlogImage2,
	DefaultBlogImage3,
	DummyAvatar,
} from '../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// AUTHOR MAP — local constant, never fetched, never stored.
// Admin publishes only the key; UI resolves name, role, and avatar
// entirely on the frontend. Replace placeholders per project.
// ---
type AuthorInfo = {
	name: string;
	role: string;
	avatarSrc: string;
};

const AUTHOR_MAP: Record<string, AuthorInfo> = {
	'author-one': { name: 'Author One', role: 'Founder', avatarSrc: DummyAvatar },
	'author-two': { name: 'Author Two', role: 'Director', avatarSrc: DummyAvatar },
	'author-three': { name: 'Author Three', role: 'Coordinator', avatarSrc: DummyAvatar },
	'author-four': { name: 'Author Four', role: 'Editor', avatarSrc: DummyAvatar },
};

// --- Default: first placeholder author is always the fallback ---
const AUTHOR_FALLBACK: AuthorInfo = AUTHOR_MAP['author-one'] ?? {
	name: 'Author One',
	role: 'Founder',
	avatarSrc: DummyAvatar,
};

// --- Default deck images — shown when no blog post images are uploaded ---
const DECK_DEFAULTS: ReadonlyArray<string> = [
	DefaultBlogImage1,
	DefaultBlogImage2,
	DefaultBlogImage3,
];

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Props ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
const { blogPost, isLoading } = defineProps<{
	blogPost: BlogPost | null;
	isLoading: boolean;
}>();

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Helpers ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- ISO "2026-02-25" → "February 25, 2026" ---
const formatDisplayDate = (isoDate: string): string => {
	const [year, month, day] = isoDate.split('-').map(Number);
	return new Date(year, month - 1, day).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Deck state: unlimited images, always 3 cards visible ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// ---
// Full image pool — blog post images (any count) padded with
// defaults so the deck always has at least 3 to cycle through.
// ---
const allImages = computed<Array<string>>(() => {
	const uploaded = blogPost?.blogPostImgUrl ?? [];
	return uploaded.length >= 3
		? uploaded
		: [...uploaded, ...DECK_DEFAULTS.slice(uploaded.length)];
});

// ---
// The 3 card slots each hold a src from the pool. Cycling flies the
// top card off, then reloads that slot with the NEXT image from the
// pool — so any number of uploaded images rotates through in stacks of 3.
// ---
const cardSrcs = ref<Array<string>>([...DECK_DEFAULTS]);
const nextImagePointer = ref<number>(3);
const deckOrder = ref<Array<number>>([0, 1, 2]);
const isAnimating = ref<boolean>(false);
const activeDot = ref<number>(0);
const flyingCardIndex = ref<number | null>(null);
const snapCardIndex = ref<number | null>(null);

// --- Reset deck whenever the image pool changes (blog post loads async) ---
watch(
	allImages,
	(pool) => {
		cardSrcs.value = [pool[0], pool[1], pool[2]];
		nextImagePointer.value = 3 % pool.length;
		deckOrder.value = [0, 1, 2];
		activeDot.value = 0;
		flyingCardIndex.value = null;
		snapCardIndex.value = null;
		isAnimating.value = false;
	},
	{ immediate: true },
);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Deck carousel: cycle top card to back, pull next image in ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
const handleDeckCycle = (): void => {
	if (isAnimating.value) {
		return;
	}
	isAnimating.value = true;

	const topCardIndex = deckOrder.value[0];
	flyingCardIndex.value = topCardIndex;

	setTimeout(() => {
		const newOrder = [deckOrder.value[1], deckOrder.value[2], deckOrder.value[0]];
		const newBackCardIndex = newOrder[2];

		// --- Recycled slot gets the next image from the full pool ---
		cardSrcs.value[newBackCardIndex] = allImages.value[nextImagePointer.value];
		nextImagePointer.value = (nextImagePointer.value + 1) % allImages.value.length;

		flyingCardIndex.value = null;
		snapCardIndex.value = newBackCardIndex;
		deckOrder.value = newOrder;
		activeDot.value = (activeDot.value + 1) % allImages.value.length;

		setTimeout(() => {
			snapCardIndex.value = null;
			setTimeout(() => {
				isAnimating.value = false;
			}, 420);
		}, 20);
	}, 430);
};

// ---
// Returns the CSS utility class string for a given card slot based on
// deck position, fly-off, or snap state. No inline styles — all
// positions defined as @utility classes in app.css.
// ---
const getDeckCardClass = (cardIndex: number): string => {
	const base = twMerge(
		clsx(
			'absolute inset-0 overflow-hidden rounded-2xl',
			'origin-bottom cursor-pointer will-change-transform',
			'border-2 border-white/60 dark:border-gray-600',
		),
	);

	if (flyingCardIndex.value === cardIndex) {
		return `${base} deck-fly-off`;
	}
	if (snapCardIndex.value === cardIndex) {
		return `${base} deck-snap`;
	}

	const posIndex = deckOrder.value.indexOf(cardIndex);
	const posClass =
		posIndex === 0
			? 'deck-pos-top shadow-xl'
			: posIndex === 1
				? 'deck-pos-mid shadow-md'
				: 'deck-pos-back shadow-sm';

	return `${base} ${posClass}`;
};

// --- Dot indicators: one index per image in the pool ---
const dotIndexes = computed<Array<number>>(() => Array.from(allImages.value.keys()));

const getDotStyleClasses = (dotIndex: number): string =>
	twMerge(
		clsx(
			'h-1.5 w-1.5 rounded-full transition-all duration-300',
			activeDot.value === dotIndex ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600',
		),
	);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Derived values ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
const authorInfo = computed<AuthorInfo>(() =>
	blogPost ? (AUTHOR_MAP[blogPost.author] ?? AUTHOR_FALLBACK) : AUTHOR_FALLBACK,
);

const formattedDate = computed<string>(() =>
	blogPost
		? formatDisplayDate(blogPost.displayDate)
		: formatDisplayDate(new Date().toISOString().split('T')[0]),
);

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// --- Class strings ---
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
const titleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-xl laptop:text-2xl font-bold leading-snug text-start',
		'text-gray-900 dark:text-white',
	),
);

const bodyStyleClasses = twMerge(
	clsx('text-base laptop:text-lg leading-loose', 'text-gray-900 dark:text-gray-300'),
);

const backLinkStyleClasses = twMerge(
	clsx(
		'inline-flex w-fit items-center gap-2 text-sm font-medium',
		'rounded-lg px-4 py-2 transition-colors',
		'border border-blue-500 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<!-- --- No outer card — past-blogs side column goes next to this section --- -->
	<section class="fade-up relative z-10 flex w-full max-w-7xl flex-col">
		<!-- --- DECK ROW: centered, full width, own section --- -->
		<div class="flex justify-center px-10 pt-10 pb-10 laptop:px-14 laptop:pt-14">
			<div class="relative h-100 w-72" @click="handleDeckCycle">
				<div class="relative h-full w-full">
					<!-- --- Card slots 0-2 (srcs rotate through the full image pool) --- -->
					<div v-for="cardIndex in [0, 1, 2]" :key="cardIndex" :class="getDeckCardClass(cardIndex)">
						<img
							:src="cardSrcs[cardIndex]"
							:alt="`Slide ${cardIndex + 1}`"
							class="h-full w-full object-cover"
						/>
						<div
							class="absolute right-3 bottom-2 text-xs text-white/70 drop-shadow select-none"
						>
							tap ›
						</div>
					</div>
				</div>

				<!-- --- Dot indicators: one per image in the pool --- -->
				<div class="absolute right-0 -bottom-5 left-0 flex justify-center gap-1.5">
					<span
						v-for="dotIndex in dotIndexes"
						:key="dotIndex"
						:class="getDotStyleClasses(dotIndex)"
					/>
				</div>
			</div>
		</div>

		<!-- --- CONTENT SECTION: Author → Title → Body → Back link --- -->
		<div class="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-5 px-10 pb-10 laptop:px-14 laptop:pb-14">
			<!-- --- Author byline: compact inline row above the title --- -->
			<div class="flex items-center gap-3">
				<div class="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-600">
					<img :src="authorInfo.avatarSrc" :alt="authorInfo.name" class="h-full w-full object-cover" />
				</div>
				<div>
					<p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
						{{ authorInfo.name }}
					</p>
					<p class="text-xs text-gray-600 dark:text-gray-400">
						{{ authorInfo.role }} · {{ formattedDate }}
					</p>
				</div>
			</div>

			<!-- --- Title --- -->
			<h2 :class="titleStyleClasses">
				{{ isLoading ? 'Loading...' : (blogPost?.header ?? 'Welcome to the Blog') }}
			</h2>

			<!-- --- Body: live content when blog post exists, default otherwise --- -->
			<Show :when="isLoading">
				<p :class="bodyStyleClasses">Fetching latest blogPost...</p>
				<template #fallback>
					<Show :when="blogPost">
						<template #default="{ value }">
							<p :class="bodyStyleClasses">{{ value.blogBody }}</p>
						</template>
						<template #fallback>
							<div :class="`${bodyStyleClasses} flex flex-col gap-4`">
								<p>
									This is the default blog post body. Publish a blog post
									with the admin controls above to replace this placeholder content
									with live data from your backend.
								</p>
								<p>
									Images uploaded with a blog post rotate through the photo deck
									above — tap the top card to cycle through the stack.
								</p>
							</div>
						</template>
					</Show>
				</template>
			</Show>

			<!-- --- Back to Home --- -->
			<RouterLink to="/" :class="backLinkStyleClasses">
				<span aria-hidden="true">←</span> Back to Home
			</RouterLink>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */

</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
