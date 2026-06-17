<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > GOVERNMENT_CORRUPTION_TIMELINE_DECK.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import Tag from 'primevue/tag';
import Timeline from 'primevue/timeline';
import type { TimelinePassThroughOptions } from 'primevue/timeline';
import { twMerge } from 'tailwind-merge';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GovernmentCorruptionTimelineEvent } from '../../../../app/models/GovernmentCorruptionTimelineModel';
import {
	governmentCorruptionTimeline,
	governmentCorruptionTimelineImageMap,
} from '../../../../api/data/government-corruption-timeline-data.ts';
import BaseModal from '../../../utils/BaseModal.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type GovernmentCorruptionTimelineDeckProps = { active?: boolean };

const { active = false } =
	defineProps<GovernmentCorruptionTimelineDeckProps>();

// --- The deck pages multiple events at once so the modal feels like a timeline, not one isolated card. ---
const timelineEvents = governmentCorruptionTimeline.events;
const activeTimelinePageIndex = ref(0);
const timelineCardKey = ref(0);
const timelineMoveDirection = ref<'previous' | 'next'>('next');
const focusedTimelineEvent = ref<GovernmentCorruptionTimelineEvent>();
const focusedTimelineEventModalOpen = ref(false);

// --- Below laptop the deck stays horizontal but pages one scaled-down card at a time. ---
const isCompactTimeline = ref(false);
let compactTimelineMediaQuery: MediaQueryList | undefined;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const syncCompactTimeline = (
	event: MediaQueryListEvent | MediaQueryList,
) => {
	isCompactTimeline.value = event.matches;
};

// --- One card per page on phone/tablet, three across on desktop. ---
const timelineEventsPerPage = computed(() => {
	return isCompactTimeline.value ? 1 : 3;
});

const timelinePageCount = computed(() => {
	return Math.ceil(timelineEvents.length / timelineEventsPerPage.value);
});

const activeTimelineEvents = computed(() => {
	const startIndex =
		activeTimelinePageIndex.value * timelineEventsPerPage.value;
	return timelineEvents.slice(
		startIndex,
		startIndex + timelineEventsPerPage.value,
	);
});

const activeTimelinePageLabel = computed(() => {
	const startEventNumber =
		activeTimelinePageIndex.value * timelineEventsPerPage.value + 1;
	const endEventNumber = Math.min(
		startEventNumber + timelineEventsPerPage.value - 1,
		timelineEvents.length,
	);

	if (startEventNumber === endEventNumber) {
		return `${startEventNumber} / ${timelineEvents.length}`;
	}

	return `${startEventNumber}-${endEventNumber} / ${timelineEvents.length}`;
});

// --- Page index is sized per page; reset to the first card when the layout flips. ---
watch(isCompactTimeline, () => {
	activeTimelinePageIndex.value = 0;
	timelineCardKey.value += 1;
});

const getTimelineEventImage = (
	timelineEvent: GovernmentCorruptionTimelineEvent,
) => {
	return governmentCorruptionTimelineImageMap[timelineEvent.imageKey];
};

const getTimelinePageIndex = (nextTimelinePageIndex: number) => {
	if (nextTimelinePageIndex < 0) return timelinePageCount.value - 1;
	if (nextTimelinePageIndex >= timelinePageCount.value) return 0;
	return nextTimelinePageIndex;
};

// --- Page key forces Vue to slide the whole group of visible events. ---
const moveTimelinePage = (direction: 'previous' | 'next') => {
	timelineMoveDirection.value = direction;
	activeTimelinePageIndex.value = getTimelinePageIndex(
		activeTimelinePageIndex.value + (direction === 'next' ? 1 : -1),
	);
	timelineCardKey.value += 1;
	startAutoAdvance();
};

const goToTimelinePage = (pageIndex: number) => {
	if (pageIndex === activeTimelinePageIndex.value) return;
	timelineMoveDirection.value =
		pageIndex > activeTimelinePageIndex.value ? 'next' : 'previous';
	activeTimelinePageIndex.value = pageIndex;
	timelineCardKey.value += 1;
	startAutoAdvance();
};

// --- Focus modal pauses the timeline so users can inspect one event without losing position. ---
const openFocusedTimelineEventModal = (
	timelineEvent: GovernmentCorruptionTimelineEvent,
) => {
	focusedTimelineEvent.value = timelineEvent;
	stopAutoAdvance();
	focusedTimelineEventModalOpen.value = true;
};

const handleFocusedTimelineEventModalHide = () => {
	focusedTimelineEvent.value = undefined;

	if (active) {
		startAutoAdvance();
	}
};

// --- Auto-advance: moves to the next page every interval. ---
const TIMELINE_AUTO_ADVANCE_INTERVAL_MS = 8000;
let autoAdvanceTimer: ReturnType<typeof setInterval> | undefined;

const stopAutoAdvance = () => {
	if (autoAdvanceTimer !== undefined) {
		clearInterval(autoAdvanceTimer);
		autoAdvanceTimer = undefined;
	}
};

const startAutoAdvance = () => {
	stopAutoAdvance();
	autoAdvanceTimer = setInterval(() => {
		moveTimelinePage('next');
	}, TIMELINE_AUTO_ADVANCE_INTERVAL_MS);
};

onMounted(() => {
	compactTimelineMediaQuery = window.matchMedia('(max-width: 1023px)');
	syncCompactTimeline(compactTimelineMediaQuery);
	compactTimelineMediaQuery.addEventListener(
		'change',
		syncCompactTimeline,
	);
});

onUnmounted(() => {
	compactTimelineMediaQuery?.removeEventListener(
		'change',
		syncCompactTimeline,
	);
	stopAutoAdvance();
});

const getSeverityTagStyleClasses = (
	severity: GovernmentCorruptionTimelineEvent['severity'],
) => {
	return twMerge(
		clsx(
			'font-orbitron! text-[0.58rem]! font-black! uppercase! tracking-[0.14em]',
			severity === 'critical' &&
				'bg-rose-600/16! text-rose-800! dark:bg-flipeffect-rose-bright/18! dark:text-rose-100!',
			severity === 'high' &&
				'bg-amber-500/18! text-amber-800! dark:bg-amber-300/16! dark:text-amber-100!',
			severity === 'medium' &&
				'bg-cyan-500/14! text-cyan-800! dark:bg-flipeffect-cyan/14! dark:text-cyan-100!',
		),
	);
};

const getSeverityTagLabel = (
	severity: GovernmentCorruptionTimelineEvent['severity'],
) => {
	return severity.toUpperCase();
};

const getTimelineMarkerIcon = (
	timelineEvent: GovernmentCorruptionTimelineEvent,
) => {
	const iconByCategory: Partial<
		Record<GovernmentCorruptionTimelineEvent['category'], string>
	> = {
		'Budget Power': 'pi pi-dollar',
		'Checks And Balances': 'pi pi-building-columns',
		'Executive Power': 'pi pi-file-edit',
		'Federal Spending': 'pi pi-wallet',
		'Immigration Enforcement': 'pi pi-shield',
		'Justice Department': 'pi pi-lock',
		'Legal Resistance': 'pi pi-gavel',
		Oversight: 'pi pi-eye',
		'Personal Enrichment': 'pi pi-money-bill',
		'War Powers': 'pi pi-bolt',
	};
	return iconByCategory[timelineEvent.category] ?? 'pi pi-flag';
};

const getPageDotStyleClasses = (pageIndex: number) => {
	return twMerge(
		clsx(
			'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
			pageIndex === activeTimelinePageIndex.value
				? 'w-4 bg-flipeffect-cyan shadow-[0_0_6px_rgba(103,232,249,0.6)]'
				: 'w-1.5 bg-white/25 hover:bg-white/50',
		),
	);
};

const rootStyleClasses = twMerge(
	clsx(
		'grid h-[min(88vh,54rem)] w-[min(94vw,82rem)] grid-rows-[auto_minmax(0,1fr)]',
		'overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/45',
	),
);
const headerStyleClasses = twMerge(
	clsx(
		'flex items-start justify-between gap-3 border-b border-white/10 px-4 py-2.5 pr-14 tablet:px-7 tablet:py-3 tablet:pr-20',
	),
);
const titleStyleClasses = twMerge(
	clsx('font-orbitron text-base font-black uppercase tablet:text-3xl'),
);
const subtitleStyleClasses = twMerge(
	clsx(
		'mt-1 max-w-4xl text-[0.7rem] font-semibold leading-4 text-slate-300/82 tablet:text-sm tablet:leading-5',
	),
);
const subtitleCallToActionStyleClasses = twMerge(
	clsx(
		'mt-1 block font-orbitron text-[0.7rem] font-black uppercase tracking-[0.12em]',
		'text-flipeffect-cyan tablet:text-sm',
	),
);
const pageBadgeStyleClasses = twMerge(
	clsx('bg-white/10! font-orbitron! text-xs! font-black! text-slate-200!'),
);
const stageStyleClasses = twMerge(clsx('min-h-0 p-4'));

// --- Surface uses a true two-row grid: cards fill row 1, nav bar lives in row 2. ---
// --- No overlay/grid-area tricks needed; controls can never block card content. ---
const surfaceStyleClasses = twMerge(
	clsx(
		'grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]',
		'overflow-hidden rounded-xl border border-white/12 bg-white/7',
	),
);
const timelineViewportStyleClasses = twMerge(
	clsx('min-w-0 overflow-hidden'),
);

const timelinePageStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'h-full',
			isCompactTimeline.value ? 'overflow-hidden' : 'overflow-x-auto',
		),
	);
});

const timelineScaleShellStyleClasses = computed(() => {
	return isCompactTimeline.value
		? twMerge(clsx('h-full w-full'))
		: twMerge(clsx('h-[111.12%] w-[111.12%] origin-top-left scale-[0.9]'));
});

// --- PrimeVue owns the timeline line/marker structure; Tailwind owns the sizing and cards. ---
// --- Compact = one full-width horizontal card per page; desktop = three fixed-width events. ---
const timelinePassThrough = computed<TimelinePassThroughOptions>(() => {
	if (isCompactTimeline.value) {
		return {
			root: { class: 'h-full w-full px-2 py-2' },
			event: {
				class: 'w-full! max-w-full! min-w-0! flex-none! basis-full! px-1',
			},
			eventOpposite: { class: 'hidden' },
			eventSeparator: { class: 'items-center' },
			eventConnector: { class: 'bg-white/18' },
			eventContent: { class: 'min-h-0 pt-3' },
		};
	}

	return {
		root: { class: 'h-full min-w-[64rem] px-4 py-4' },
		event: {
			class:
				'w-1/3! max-w-[33.333333%]! min-w-[20rem] flex-none! basis-1/3! px-3',
		},
		eventOpposite: { class: 'hidden' },
		eventSeparator: { class: 'items-center' },
		eventConnector: { class: 'bg-white/18' },
		eventContent: { class: 'min-h-0 pt-3' },
	};
});

const markerButtonStyleClasses = twMerge(
	clsx(
		'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border',
		'border-flipeffect-flip bg-flipeffect-flip text-slate-950',
		'transition duration-200 hover:scale-105 hover:bg-flipeffect-cyan',
		'shadow-[0_0_18px_rgba(103,232,249,0.36)]',
	),
);
const eventCardStyleClasses = computed(() => {
	return twMerge(
		clsx(
			'group grid grid-rows-[auto_minmax(0,1fr)]',
			'overflow-hidden rounded-xl border border-white/10',
			'bg-slate-950/72 shadow-xl shadow-black/28',
			'cursor-pointer transition duration-300 hover:z-50',
			'hover:border-flipeffect-cyan/45 hover:shadow-2xl hover:shadow-black/40',
			isCompactTimeline.value
				? 'h-[min(60vh,30rem)]'
				: 'h-[min(62vh,36rem)] hover:scale-[1.18]',
		),
	);
});
const getTimelineEventImageStyleClasses = (
	timelineEvent: GovernmentCorruptionTimelineEvent,
) => {
	return twMerge(
		clsx(
			'h-40 w-full bg-black object-contain object-center tablet:h-48',
			'transition duration-300 group-hover:scale-[1.05]',
			timelineEvent.imageKey === 'tulsi-gabbard-beginning-end'
				? 'p-1'
				: 'p-0',
		),
	);
};

const eventBodyStyleClasses = twMerge(
	clsx('grid gap-2 overflow-y-auto p-4'),
);

const eventMetaStyleClasses = twMerge(
	clsx('flex flex-wrap items-center gap-x-2 gap-y-1'),
);

const eventDateStyleClasses = twMerge(
	clsx(
		'min-w-0 font-orbitron text-[0.62rem] font-black uppercase',
		'tracking-[0.14em] text-cyan-100',
	),
);

const eventTitleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-lg font-black uppercase leading-tight text-white',
	),
);

const eventCopyStyleClasses = twMerge(
	clsx('text-xs font-semibold leading-5 text-slate-200/84 tablet:text-sm'),
);

const eventWhyStyleClasses = twMerge(
	clsx('rounded-lg border border-white/10 bg-black/22 px-3 py-2'),
);

const eventWhyTitleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-[0.62rem] font-black uppercase tracking-[0.14em] text-flipeffect-cyan',
	),
);

const timelineTransitionActiveStyleClasses = twMerge(
	clsx(
		'transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
	),
);

const timelineTransitionDefaultStyleClasses = twMerge(
	clsx('translate-x-0 rotate-0 scale-100 opacity-100'),
);

const timelineTransitionEnterFromStyleClasses = computed(() => {
	return twMerge(
		clsx(
			timelineMoveDirection.value === 'next'
				? 'translate-x-[52px]'
				: '-translate-x-[52px]',
			'scale-[0.985] opacity-0',
		),
	);
});

const timelineTransitionLeaveToStyleClasses = computed(() => {
	return twMerge(
		clsx(
			timelineMoveDirection.value === 'next'
				? '-translate-x-[120px]'
				: 'translate-x-[120px]',
			'scale-[0.96] opacity-0',
		),
	);
});

const controlsBarStyleClasses = twMerge(
	clsx(
		'flex items-center justify-between gap-3 border-t border-white/10',
		'bg-slate-950/80 px-4 py-2.5 backdrop-blur-sm',
	),
);
const navButtonStyleClasses = twMerge(
	clsx(
		'flex cursor-pointer items-center gap-1.5 rounded-lg',
		'border border-white/10 bg-white/6',
		'px-3.5 py-2 font-orbitron text-[0.58rem] font-black uppercase tracking-[0.12em]',
		'text-slate-200 transition-all duration-200',
		'hover:border-flipeffect-cyan/60 hover:bg-flipeffect-cyan/12 hover:text-flipeffect-cyan',
		'active:scale-95',
	),
);
const pageDotsContainerStyleClasses = twMerge(
	clsx('hidden items-center gap-1.5 laptop:flex'),
);

const focusedModalRootStyleClasses = twMerge(
	clsx(
		'w-[min(94vw,72rem)] overflow-visible rounded-2xl',
		'border border-cyan-950/12 bg-slate-100 text-slate-950',
		'shadow-2xl shadow-slate-950/28',
		'dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/55',
	),
);

const focusedModalHeaderStyleClasses = twMerge(
	clsx(
		'border-b border-cyan-950/10 bg-slate-950/6 px-5 py-4 tablet:px-7',
		'dark:border-white/10',
	),
);

const focusedModalContentStyleClasses = twMerge(
	clsx('overflow-visible! p-0!'),
);

const focusedModalCloseButtonStyleClasses = twMerge(
	clsx(
		'cursor-pointer border border-slate-300/70! bg-white/80! text-slate-700!',
		'h-8! w-8! tablet:h-10! tablet:w-10!',
		'shadow-lg shadow-slate-950/12!',
		'transition duration-200 hover:border-flipeffect-cyan/70!',
		'hover:bg-flipeffect-cyan/14! hover:text-flipeffect-cyan!',
		'dark:border-white/20! dark:bg-white/8! dark:text-white!',
	),
);

const focusedModalCloseButtonIconStyleClasses = twMerge(
	clsx(
		'text-xs! text-slate-700! hover:text-flipeffect-cyan! tablet:text-sm! dark:text-white!',
	),
);

const focusedModalGridStyleClasses = twMerge(
	clsx(
		'grid max-h-[min(82vh,52rem)] overflow-visible',
		'laptop:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)]',
	),
);

const focusedModalImageStyleClasses = twMerge(
	clsx(
		'h-full min-h-52 w-full bg-black object-contain object-center tablet:min-h-80',
	),
);

const focusedModalCopyStyleClasses = twMerge(
	clsx(
		'grid content-center gap-4 overflow-y-auto',
		'bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50/62 p-4',
		'dark:bg-none dark:bg-slate-950 tablet:p-7',
	),
);

const focusedModalTitleStyleClasses = twMerge(
	clsx(
		'font-orbitron text-xl font-black uppercase leading-tight',
		'text-slate-950 drop-shadow-[0_0_14px_rgba(14,165,233,0.18)]',
		'dark:text-white dark:drop-shadow-none tablet:text-4xl',
	),
);

const focusedModalMetaStyleClasses = twMerge(
	clsx('flex flex-wrap items-center gap-x-2 gap-y-1'),
);

const focusedModalDateStyleClasses = twMerge(
	clsx(
		'font-orbitron text-xs font-black uppercase tracking-[0.16em]',
		'text-cyan-700 dark:text-cyan-100',
	),
);

const focusedModalCopyTextStyleClasses = twMerge(
	clsx(
		'text-sm font-semibold leading-7 text-slate-700',
		'dark:text-slate-200/86 tablet:text-base',
	),
);

const focusedModalWhyStyleClasses = twMerge(
	clsx(
		'rounded-lg border border-slate-200/80 bg-slate-950/[0.03] px-3 py-2',
		'shadow-[inset_0_0_0_1px_rgba(14,165,233,0.04)]',
		'dark:border-white/10 dark:bg-black/22 dark:shadow-none',
	),
);

watch(
	() => active,
	(activeValue) => {
		if (activeValue) {
			startAutoAdvance();
			return;
		}
		stopAutoAdvance();
		activeTimelinePageIndex.value = 0;
		timelineCardKey.value = 0;
		timelineMoveDirection.value = 'next';
		focusedTimelineEventModalOpen.value = false;
		focusedTimelineEvent.value = undefined;
	},
	{ immediate: true },
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                     </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div :class="rootStyleClasses">
		<!-- TIMELINE: HEADER -->
		<header :class="headerStyleClasses">
			<div>
				<h2 :class="titleStyleClasses">{{
					governmentCorruptionTimeline.title
				}}</h2>
				<p :class="subtitleStyleClasses">
					{{ governmentCorruptionTimeline.description }}
					<span :class="subtitleCallToActionStyleClasses">
						Press any card for a larger view.
					</span>
				</p>
			</div>

			<Tag
				:value="activeTimelinePageLabel"
				:class="pageBadgeStyleClasses"
			/>
		</header>

		<!-- TIMELINE: PAGED EVENT GROUP -->
		<div :class="stageStyleClasses">
			<div :class="surfaceStyleClasses">
				<!-- TIMELINE: CARD RAIL -->
				<div :class="timelineViewportStyleClasses">
					<Transition
						mode="out-in"
						:enter-active-class="timelineTransitionActiveStyleClasses"
						:leave-active-class="timelineTransitionActiveStyleClasses"
						:enter-from-class="timelineTransitionEnterFromStyleClasses"
						:enter-to-class="timelineTransitionDefaultStyleClasses"
						:leave-from-class="timelineTransitionDefaultStyleClasses"
						:leave-to-class="timelineTransitionLeaveToStyleClasses"
					>
						<div :key="timelineCardKey" :class="timelinePageStyleClasses">
							<div :class="timelineScaleShellStyleClasses">
								<Timeline
									:value="activeTimelineEvents"
									layout="horizontal"
									:pt="timelinePassThrough"
								>
									<template #marker="{ item }">
										<button
											type="button"
											:class="markerButtonStyleClasses"
											:aria-label="`Open ${item.title}`"
											@click="openFocusedTimelineEventModal(item)"
										>
											<i :class="getTimelineMarkerIcon(item)"></i>
										</button>
									</template>

									<template #content="{ item }">
										<article
											:class="eventCardStyleClasses"
											tabindex="0"
											@click="openFocusedTimelineEventModal(item)"
											@keydown.enter="openFocusedTimelineEventModal(item)"
											@keydown.space.prevent="
												openFocusedTimelineEventModal(item)
											"
										>
											<img
												:src="getTimelineEventImage(item)"
												:alt="item.title"
												:class="getTimelineEventImageStyleClasses(item)"
											/>

											<div :class="eventBodyStyleClasses">
												<div :class="eventMetaStyleClasses">
													<Tag
														:value="getSeverityTagLabel(item.severity)"
														:class="
															getSeverityTagStyleClasses(item.severity)
														"
													/>
													<span :class="eventDateStyleClasses">{{
														item.dateLabel
													}}</span>
												</div>

												<h3 :class="eventTitleStyleClasses">{{
													item.title
												}}</h3>
												<p :class="eventCopyStyleClasses">{{
													item.summary
												}}</p>

												<div :class="eventWhyStyleClasses">
													<div :class="eventWhyTitleStyleClasses"
														>Why it matters</div
													>
													<p :class="eventCopyStyleClasses">{{
														item.whyItMatters
													}}</p>
												</div>
											</div>
										</article>
									</template>
								</Timeline>
							</div>
						</div>
					</Transition>
				</div>

				<!-- TIMELINE: NAVIGATION BAR -->
				<div :class="controlsBarStyleClasses">
					<button
						type="button"
						:class="navButtonStyleClasses"
						@click="moveTimelinePage('previous')"
					>
						<i class="pi pi-chevron-left text-[0.65rem]"></i>
						Previous
					</button>

					<div :class="pageDotsContainerStyleClasses">
						<button
							v-for="pageIndex in timelinePageCount"
							:key="pageIndex"
							type="button"
							:aria-label="`Go to page ${pageIndex}`"
							:class="getPageDotStyleClasses(pageIndex - 1)"
							@click="goToTimelinePage(pageIndex - 1)"
						></button>
					</div>

					<button
						type="button"
						:class="navButtonStyleClasses"
						@click="moveTimelinePage('next')"
					>
						Next
						<i class="pi pi-chevron-right text-[0.65rem]"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- TIMELINE: FOCUSED EVENT MODAL -->
		<BaseModal
			v-model:visible="focusedTimelineEventModalOpen"
			:header="focusedTimelineEvent?.title"
			:root-class="focusedModalRootStyleClasses"
			:header-class="focusedModalHeaderStyleClasses"
			:content-class="focusedModalContentStyleClasses"
			:close-button-class="focusedModalCloseButtonStyleClasses"
			:close-button-icon-class="focusedModalCloseButtonIconStyleClasses"
			@hide="handleFocusedTimelineEventModalHide"
		>
			<div
				v-if="focusedTimelineEvent"
				:class="focusedModalGridStyleClasses"
			>
				<img
					:src="getTimelineEventImage(focusedTimelineEvent)"
					:alt="focusedTimelineEvent.title"
					:class="focusedModalImageStyleClasses"
				/>

				<div :class="focusedModalCopyStyleClasses">
					<div :class="focusedModalMetaStyleClasses">
						<Tag
							:value="getSeverityTagLabel(focusedTimelineEvent.severity)"
							:class="
								getSeverityTagStyleClasses(focusedTimelineEvent.severity)
							"
						/>

						<span :class="focusedModalDateStyleClasses">
							{{ focusedTimelineEvent.dateLabel }}
						</span>
					</div>

					<h3 :class="focusedModalTitleStyleClasses">
						{{ focusedTimelineEvent.title }}
					</h3>

					<p :class="focusedModalCopyTextStyleClasses">
						{{ focusedTimelineEvent.summary }}
					</p>

					<div :class="focusedModalWhyStyleClasses">
						<div :class="eventWhyTitleStyleClasses"> Why it matters </div>

						<p :class="focusedModalCopyTextStyleClasses">
							{{ focusedTimelineEvent.whyItMatters }}
						</p>
					</div>
				</div>
			</div>
		</BaseModal>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
