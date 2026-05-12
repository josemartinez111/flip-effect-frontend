<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: HOME > HOME_PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { onMounted, onUnmounted, ref } from 'vue';
import { BaseModal, HeroApprovalRatingCard } from '../../components';
import {
	DominoEffectBGHomePage,
	KnowYourBranches,
	ThreeBranchesOfGovernment,
} from '../../assets';
import {
	formatCountdownUnit,
	formatDate,
	getCountdownTimeLeft,
} from '../../lib';
import { useHomeComposable } from './home.composable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const MIDTERMS_DATE = '2026-11-03T00:00:00-05:00';

const threeBranchesModalOpen = ref(false);
const midtermsCountdown = ref(getCountdownTimeLeft(MIDTERMS_DATE));
const midtermsDateLabel = formatDate('long', MIDTERMS_DATE);
let midtermsCountdownIntervalId: number | undefined;

const {
	mainContainerStyleClasses,
	heroSectionStyleClasses,
	heroContentContainerStyleClasses,
	heroCardShellStyleClasses,
	countdownCardStyleClasses,
	countdownCardBodyStyleClasses,
	countdownCardContentStyleClasses,
	countdownEyebrowStyleClasses,
	countdownDaysValueStyleClasses,
	countdownDaysLabelStyleClasses,
	countdownTimeGridStyleClasses,
	countdownTimeValueStyleClasses,
	countdownTimeLabelStyleClasses,
	countdownDateLabelStyleClasses,
	branchesTriggerButtonStyleClasses,
	branchesTriggerImageStyleClasses,
	branchesModalCardStyleClasses,
	branchesModalCardBodyStyleClasses,
	branchesModalCardContentStyleClasses,
	branchesModalBgImageStyleClasses,
	branchesModalImageStyleClasses,
} = useHomeComposable();

const syncMidtermsCountdown = () => {
	midtermsCountdown.value = getCountdownTimeLeft(MIDTERMS_DATE);
};

onMounted(() => {
	syncMidtermsCountdown();
	midtermsCountdownIntervalId = window.setInterval(syncMidtermsCountdown, 1000);
});

onUnmounted(() => {
	if (midtermsCountdownIntervalId !== undefined) {
		window.clearInterval(midtermsCountdownIntervalId);
	}
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="mainContainerStyleClasses">
		<!-- Extractable: MidtermsCountdownCard -->
		<Card
			unstyled
			:class="countdownCardStyleClasses"
			:pt="{
				body: { class: countdownCardBodyStyleClasses },
				content: { class: countdownCardContentStyleClasses },
			}"
		>
			<template #content>
				<div :class="countdownEyebrowStyleClasses">2026 Midterms</div>
				<div :class="countdownDaysValueStyleClasses">
					{{ midtermsCountdown.days }}
				</div>
				<div :class="countdownDaysLabelStyleClasses">Days</div>

				<div :class="countdownTimeGridStyleClasses">
					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ formatCountdownUnit(midtermsCountdown.hours) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Hrs</span>
					</div>
					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ formatCountdownUnit(midtermsCountdown.minutes) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Min</span>
					</div>
					<div>
						<span :class="countdownTimeValueStyleClasses">
							{{ formatCountdownUnit(midtermsCountdown.seconds) }}
						</span>
						<span :class="countdownTimeLabelStyleClasses">Sec</span>
					</div>
				</div>

				<div :class="countdownDateLabelStyleClasses">
					{{ midtermsDateLabel }}
				</div>
			</template>
		</Card>

		<!-- Extractable: ThreeBranchesModalTrigger -->
		<button
			type="button"
			:class="branchesTriggerButtonStyleClasses"
			aria-label="Open three branches of government"
			@click="threeBranchesModalOpen = true"
		>
			<img
				:src="KnowYourBranches"
				alt="Know Your Branches"
				:class="branchesTriggerImageStyleClasses"
			/>
		</button>

		<section :class="heroSectionStyleClasses">
			<div :class="heroContentContainerStyleClasses">
				<div :class="heroCardShellStyleClasses">
					<HeroApprovalRatingCard />
				</div>
			</div>
		</section>

		<!-- Extractable: ThreeBranchesModal -->
		<BaseModal v-model:visible="threeBranchesModalOpen">
			<Card
				unstyled
				:class="branchesModalCardStyleClasses"
				:pt="{
					body: { class: branchesModalCardBodyStyleClasses },
					content: { class: branchesModalCardContentStyleClasses },
				}"
			>
				<template #content>
					<img
						:src="DominoEffectBGHomePage"
						alt=""
						:class="branchesModalBgImageStyleClasses"
						aria-hidden="true"
					/>
					<img
						:src="ThreeBranchesOfGovernment"
						alt="Three branches of government"
						:class="branchesModalImageStyleClasses"
					/>
				</template>
			</Card>
		</BaseModal>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
