<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > HERO_APPROVAL_RATING_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
	ApprovalRatingCardBG,
	NixonAvatar,
	TrumpAvatar,
} from '../../../../assets';
import { currentTrumpApprovalRatingPercentage } from '../../pages-composables/UseApprovalRatingTierComposable.ts';
import { UseHeroApprovalRatingComposable } from '../../pages-composables/UseHeroApprovalRatingComposable.ts';
import { useApprovalStore } from '../../../../lib/stores/UseApprovalStore.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Styles composables ---
const {
	cardContainerStyleClasses,
	cardBgImageStyleClasses,
	cardBodyStyleClasses,
	cardContentStyleClasses,
	cardSlotLayerStyleClasses,
	cardHeaderStyleClasses,
	cardExplanationStyleClasses,
	nixonNameStyleClasses,
	trumpNameStyleClasses,
	nixonPercentageStyleClasses,
	trumpPercentageStyleClasses,
	nixonAvatarStyleClasses,
	trumpAvatarStyleClasses,
	trumpSourceTooltipStyleClasses,
} = UseHeroApprovalRatingComposable();

// --- Trump approval: live from the store (VoteHub); the static value is the fallback until it lands. ---
const { trumpRating } = storeToRefs(useApprovalStore());
const trumpApprovalRatingPercentage = currentTrumpApprovalRatingPercentage;

// --- Hover caption: source + neutral methodology context so the number reads as real, not cherry-picked. ---
const trumpApprovalSourceCaption = computed(() => {
	const rating = trumpRating.value;
	const source = rating?.source ?? 'New York Times';
	const updatedOn = rating
		? new Date(rating.fetchedAt).toLocaleDateString()
		: 'recently';

	return `${source}: averaged from only the pollsters NYT screens as reliable (its "select pollsters") — filtering out the partisan houses that skew a raw average high. Neutral and current. Updated ${updatedOn}.`;
});
const animatedTrumpApprovalRating = ref(100);
const trumpApprovalRatingImpacting = ref(false);
let trumpApprovalRatingAnimationFrameId: number | undefined;
const trumpApprovalRatingTimeoutIds: number[] = [];

const easeInOutSine = (progress: number) => {
	return -(Math.cos(Math.PI * progress) - 1) / 2;
};

const easeOutCubic = (progress: number) => {
	return 1 - Math.pow(1 - progress, 3);
};

const easeInQuart = (progress: number) => {
	return progress ** 4;
};

const animateTrumpApprovalRating = ({
	from,
	to,
	durationMs,
	easing,
	onComplete,
}: {
	from: number;
	to: number;
	durationMs: number;
	easing: (progress: number) => number;
	onComplete?: () => void;
}) => {
	const startedAt = performance.now();

	const tick = (currentTime: number) => {
		const elapsedMs = currentTime - startedAt;
		const progress = Math.min(elapsedMs / durationMs, 1);
		const easedProgress = easing(progress);

		animatedTrumpApprovalRating.value = Math.round(
			from + (to - from) * easedProgress,
		);

		if (progress < 1) {
			trumpApprovalRatingAnimationFrameId =
				window.requestAnimationFrame(tick);
			return;
		}

		animatedTrumpApprovalRating.value = to;
		onComplete?.();
	};

	trumpApprovalRatingAnimationFrameId = window.requestAnimationFrame(tick);
};

const queueTrumpApprovalRatingAnimation = (
	delayMs: number,
	animation: Parameters<typeof animateTrumpApprovalRating>[0],
) => {
	const timeoutId = window.setTimeout(() => {
		animateTrumpApprovalRating(animation);
	}, delayMs);

	trumpApprovalRatingTimeoutIds.push(timeoutId);
};

onMounted(() => {
	queueTrumpApprovalRatingAnimation(300, {
		from: 100,
		to: 90,
		durationMs: 1100,
		easing: easeInOutSine,
	});
	queueTrumpApprovalRatingAnimation(1450, {
		from: 90,
		to: 95,
		durationMs: 520,
		easing: easeOutCubic,
	});
	queueTrumpApprovalRatingAnimation(2070, {
		from: 95,
		to: 85,
		durationMs: 820,
		easing: easeInOutSine,
	});
	// --- Final settle resolves at execution (≈3s in), by which time the store fetch has landed the live number. ---
	const finalSettleTimeoutId = window.setTimeout(() => {
		animateTrumpApprovalRating({
			from: 85,
			to: trumpRating.value?.approve ?? trumpApprovalRatingPercentage,
			durationMs: 1250,
			easing: easeInQuart,
			onComplete: () => {
				trumpApprovalRatingImpacting.value = true;
				const timeoutId = window.setTimeout(() => {
					trumpApprovalRatingImpacting.value = false;
				}, 360);

				trumpApprovalRatingTimeoutIds.push(timeoutId);
			},
		});
	}, 3000);

	trumpApprovalRatingTimeoutIds.push(finalSettleTimeoutId);
});

onUnmounted(() => {
	if (trumpApprovalRatingAnimationFrameId !== undefined) {
		window.cancelAnimationFrame(trumpApprovalRatingAnimationFrameId);
	}

	trumpApprovalRatingTimeoutIds.forEach((timeoutId) => {
		window.clearTimeout(timeoutId);
	});
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Card
		unstyled
		:class="cardContainerStyleClasses"
		:pt="{
			body: { class: cardBodyStyleClasses },
			content: { class: cardContentStyleClasses },
		}"
	>
		<template #content>
			<div class="absolute inset-0 overflow-hidden rounded-[1.6rem]">
				<img
					:src="ApprovalRatingCardBG"
					alt=""
					:class="cardBgImageStyleClasses"
				/>
			</div>

			<div :class="cardSlotLayerStyleClasses">
				<h2 :class="cardHeaderStyleClasses">Approval Rating</h2>
				<div :class="nixonNameStyleClasses">Richard Nixon</div>
				<div :class="trumpNameStyleClasses">Donald Trump</div>
				<img
					:src="NixonAvatar"
					alt="Richard Nixon"
					:class="nixonAvatarStyleClasses"
				/>
				<img
					:src="TrumpAvatar"
					alt="Trump"
					:class="trumpAvatarStyleClasses"
				/>
				<div :class="nixonPercentageStyleClasses">24%</div>
				<div
					:class="[
						trumpPercentageStyleClasses,
						'group cursor-pointer transition-[filter,transform] duration-300 ease-out',
						trumpApprovalRatingImpacting
							? 'scale-125 drop-shadow-[0_0_22px_rgba(244,63,94,0.95)]'
							: 'scale-100',
					]"
				>
					{{ animatedTrumpApprovalRating }}%
					<span :class="trumpSourceTooltipStyleClasses">
						{{ trumpApprovalSourceCaption }}
					</span>
				</div>
				<p :class="cardExplanationStyleClasses">
					Nixon's final approval rating was 24%, measured days before he
					resigned amid Watergate
					<br />
					(August 1974, Gallup). Trump's rating reflects current aggregated
					polling.
				</p>
				<slot />
			</div>
		</template>
	</Card>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
