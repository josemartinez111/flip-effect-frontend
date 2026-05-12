<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > HERO_APPROVAL_RATING_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import {
	ApprovalRatingCardBG,
	TrumanAvatar,
	TrumpAvatar,
} from '../../../../assets';
import { UseHeroApprovalRating } from './UseHeroApprovalRating';
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
} = UseHeroApprovalRating();
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
				<div :class="trumpPercentageStyleClasses">36%</div>
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
