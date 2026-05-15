<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > HERO_APPROVAL_RATING_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { onMounted, onUnmounted, ref } from 'vue';
import {
	ApprovalRatingCardBG,
	TrumanAvatar,
	TrumpAvatar,
} from '../../../../assets';
import { UseHeroApprovalRatingComposable } from './UseHeroApprovalRatingComposable';
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
	trumanNameStyleClasses,
	trumpNameStyleClasses,
	trumanPercentageStyleClasses,
	trumpPercentageStyleClasses,
	trumanAvatarStyleClasses,
	trumpAvatarStyleClasses,
} = UseHeroApprovalRatingComposable();

// --- Static approval animation ---
const TRUMP_APPROVAL_RATING = 36;
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
	queueTrumpApprovalRatingAnimation(3000, {
		from: 85,
		to: TRUMP_APPROVAL_RATING,
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
			<img
				:src="ApprovalRatingCardBG"
				alt=""
				:class="cardBgImageStyleClasses"
			/>

			<div :class="cardSlotLayerStyleClasses">
				<h2 :class="cardHeaderStyleClasses">Approval Rating</h2>
				<div :class="trumanNameStyleClasses">Harry Truman</div>
				<div :class="trumpNameStyleClasses">Donald Trump</div>
				<img
					:src="TrumanAvatar"
					alt="Harry Truman"
					:class="trumanAvatarStyleClasses"
				/>
				<img
					:src="TrumpAvatar"
					alt="Trump"
					:class="trumpAvatarStyleClasses"
				/>
				<div :class="trumanPercentageStyleClasses">22%</div>
				<div
					:class="[
						trumpPercentageStyleClasses,
						'transition-[filter,transform] duration-300 ease-out',
						trumpApprovalRatingImpacting
							? 'scale-125 drop-shadow-[0_0_22px_rgba(244,63,94,0.95)]'
							: 'scale-100',
					]"
				>
					{{ animatedTrumpApprovalRating }}%
				</div>
				<p :class="cardExplanationStyleClasses">
					Truman's 22% approval rating reflects his lowest recorded
					approval
					<br />
					(1952, Gallup). Trump's approval rating reflects current
					aggregated polling.
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
