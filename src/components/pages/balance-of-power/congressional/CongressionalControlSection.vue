<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > BALANCE-OF-POWER > CONGRESSIONAL
    > CONGRESSIONAL_CONTROL_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import { computed, onMounted } from 'vue';
import SeatGridCard from '../../../shared/seat-grid-card/SeatGridCard.vue';
import { UseCongressControlComposable } from '../balance-of-power-page-composables/UseCongressControlComposable.ts';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type CongressionalControlSectionProps = {
	eyebrow: string;
	title: string;
	lead: string;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// <CongressionalControlSection
// 	eyebrow="Congressional Balance"
// 	title="House & Senate Control"
// 	lead="Track the balance of power shaping the next fight in Congress."
// />
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const { eyebrow, title, lead } =
	defineProps<CongressionalControlSectionProps>();

const {
	congressionalControlSectionStyleClasses,
	congressionalControlShellStyleClasses,
	congressionalControlHeaderStyleClasses,
	congressionalControlEyebrowStyleClasses,
	congressionalControlTitleStyleClasses,
	congressionalControlLeadStyleClasses,
	congressionalControlSourceStyleClasses,
	congressionalControlGridStyleClasses,
	congressionalBalanceSourceCaption,
	congressionalBalanceSourceUrl,
	congressionalControlChambers,
	congressionalBalanceStore,
	getCongressionalSeatGridCards,
} = UseCongressControlComposable();

const congressionalSeatGridCards = computed(() => {
	return getCongressionalSeatGridCards(congressionalControlChambers.value);
});

// --- Fetch once when this page-owned section mounts; every seat is derived from that one snapshot. ---
onMounted(async () => {
	await congressionalBalanceStore.fetchCongressBalance();
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ MARKUP ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="congressionalControlSectionStyleClasses">
		<div :class="congressionalControlShellStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ CONTROL SUMMARY ∞∞∞∞∞∞∞∞ -->
			<div :class="congressionalControlHeaderStyleClasses">
				<div>
					<div :class="congressionalControlEyebrowStyleClasses">
						{{ eyebrow }}
					</div>
					<h2 :class="congressionalControlTitleStyleClasses">
						{{ title }}
					</h2>
				</div>

				<p :class="congressionalControlLeadStyleClasses">
					{{ lead }}
				</p>
			</div>

			<!-- ∞∞∞∞∞∞∞∞ LIVE DATA SOURCE ∞∞∞∞∞∞∞∞ -->
			<a
				v-if="congressionalBalanceSourceCaption"
				:href="congressionalBalanceSourceUrl"
				target="_blank"
				rel="noreferrer"
				:class="congressionalControlSourceStyleClasses"
			>
				{{ congressionalBalanceSourceCaption }}
			</a>

			<!-- ∞∞∞∞∞∞∞∞ HOUSE AND SENATE SEAT GRIDS ∞∞∞∞∞∞∞∞ -->
			<div :class="congressionalControlGridStyleClasses">
				<SeatGridCard
					v-for="seatGridCard in congressionalSeatGridCards"
					:key="seatGridCard.key"
					:seat-grid-card="seatGridCard"
				/>
			</div>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ STYLES ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
