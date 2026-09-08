<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > HERO
    > HOME_QUIZ_BADGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ref } from 'vue';
import { GovernmentChecksBalancesClick } from '../../../../assets';
import GovernmentChecksBalancesQuiz from '../approval-rating/GovernmentChecksBalancesQuiz.vue';
import { UseHomeHeroComposable } from '../../pages-composables/UseHomeHeroComposable.ts';
import BaseModal from '../../../utils/BaseModal.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Keep the trigger and active quiz state together so closing the hero dialog resets the existing quiz. ---
const quizModalOpen = ref(false);

const {
	quizTriggerButtonStyleClasses,
	quizTriggerImageStyleClasses,
	quizModalRootStyleClasses,
	quizModalContentWrapperStyleClasses,
	quizModalHeaderStyleClasses,
	quizModalCloseButtonStyleClasses,
	quizModalCloseIconStyleClasses,
} = UseHomeHeroComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                    </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<!-- ∞∞∞∞∞∞∞∞ HERO QUIZ TRIGGER ∞∞∞∞∞∞∞∞ -->
	<button
		type="button"
		:class="quizTriggerButtonStyleClasses"
		aria-label="Open government checks and balances quiz"
		@click="quizModalOpen = true"
	>
		<img
			:src="GovernmentChecksBalancesClick"
			alt="Government checks and balances quiz"
			:class="quizTriggerImageStyleClasses"
		/>
	</button>

	<!-- ∞∞∞∞∞∞∞∞ CHECKS AND BALANCES QUIZ MODAL ∞∞∞∞∞∞∞∞ -->
	<BaseModal
		v-model:visible="quizModalOpen"
		:root-class="quizModalRootStyleClasses"
		:header-class="quizModalHeaderStyleClasses"
		:content-class="quizModalContentWrapperStyleClasses"
		:close-button-class="quizModalCloseButtonStyleClasses"
		:close-button-icon-class="quizModalCloseIconStyleClasses"
	>
		<GovernmentChecksBalancesQuiz :active="quizModalOpen" />
	</BaseModal>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
