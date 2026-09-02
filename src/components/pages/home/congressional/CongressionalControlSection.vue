<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > CONGRESSIONAL
    > CONGRESSIONAL_CONTROL_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import { computed } from 'vue';
import SeatGridCard from '../../../shared/seat-grid-card/SeatGridCard.vue';
import {
	type CongressionalControlChamber,
	UseCongressionalControlComposable,
} from '../../pages-composables/UseCongressionalControlComposable.ts';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type CongressionalControlSectionProps = {
	eyebrow: string;
	title: string;
	lead: string;
	chambers: Array<CongressionalControlChamber>;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// <CongressionalControlSection
// 	eyebrow="Congressional Balance"
// 	title="House & Senate Control"
// 	lead="Track the balance of power shaping the next fight in Congress."
// 	:chambers="congressionalControlChambers"
// />
//
// `:chambers` is one-way prop binding. Use `v-model` only if this component
// must edit parent-owned chamber data.
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ Usage ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const { eyebrow, title, lead, chambers } =
	defineProps<CongressionalControlSectionProps>();

const {
	congressionalControlSectionStyleClasses,
	congressionalControlShellStyleClasses,
	congressionalControlHeaderStyleClasses,
	congressionalControlEyebrowStyleClasses,
	congressionalControlTitleStyleClasses,
	congressionalControlLeadStyleClasses,
	congressionalControlGridStyleClasses,
	getCongressionalSeatGridCards,
} = UseCongressionalControlComposable();

const congressionalSeatGridCards = computed(() => {
	return getCongressionalSeatGridCards(chambers);
});
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ MARKUP ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="congressionalControlSectionStyleClasses">
		<div :class="congressionalControlShellStyleClasses">
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
