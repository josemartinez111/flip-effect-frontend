<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > CONGRESSIONAL
    > CONGRESSIONAL_CONTROL_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import Card from 'primevue/card';
import FWTSeatAvatar from '../../../shared/FWTSeatAvatar.vue';
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
	congressionalChamberCardStyleClasses,
	congressionalChamberCardBodyStyleClasses,
	congressionalChamberCardContentStyleClasses,
	congressionalChamberHeaderStyleClasses,
	congressionalChamberTitleStyleClasses,
	congressionalChamberStatusStyleClasses,
	congressionalChamberSummaryStyleClasses,
	congressionalChamberPathStyleClasses,
	congressionalPartyBarsStyleClasses,
	congressionalPartyBarRowStyleClasses,
	congressionalPartyBarLabelStyleClasses,
	congressionalPartyBarTrackStyleClasses,
	congressionalPartyBarCountStyleClasses,
	congressionalDemocratBarStyleClasses,
	congressionalRepublicanBarStyleClasses,
	congressionalChamberMetaStyleClasses,
	congressionalChamberMetaItemStyleClasses,
	congressionalHouseSeatGridStyleClasses,
	congressionalSenateSeatGridStyleClasses,
	congressionalSeatAvatarStyleClasses,
	getCongressionalControlBarStyle,
	getCongressionalSeatAvatarSize,
	getCongressionalSeatAvatarAriaLabel,
} = UseCongressionalControlComposable();
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
				<!-- Extractable: CongressionalChamberControlCard -->
				<Card
					v-for="chamber in chambers"
					:key="chamber.key"
					unstyled
					:class="congressionalChamberCardStyleClasses"
					:pt="{
						body: { class: congressionalChamberCardBodyStyleClasses },
						content: {
							class: congressionalChamberCardContentStyleClasses,
						},
					}"
				>
					<template #content>
						<div :class="congressionalChamberHeaderStyleClasses">
							<div>
								<h3 :class="congressionalChamberTitleStyleClasses">
									{{ chamber.title }}
								</h3>

								<div :class="congressionalChamberSummaryStyleClasses">
									<p>{{ chamber.summary }}</p>
									<p :class="congressionalChamberPathStyleClasses">
										{{ chamber.pathSummary }}
									</p>
								</div>
							</div>

							<span :class="congressionalChamberStatusStyleClasses">
								{{ chamber.statusLabel }}
							</span>
						</div>

						<!-- Extractable: CongressionalControlBars -->
						<div :class="congressionalPartyBarsStyleClasses">
							<div :class="congressionalPartyBarRowStyleClasses">
								<span :class="congressionalPartyBarLabelStyleClasses">
									{{ chamber.democratLabel }}
								</span>
								<div :class="congressionalPartyBarTrackStyleClasses">
									<div
										:class="congressionalDemocratBarStyleClasses"
										:style="
											getCongressionalControlBarStyle(
												chamber.democratPercent,
											)
										"
									/>
								</div>
								<span :class="congressionalPartyBarCountStyleClasses">
									{{ chamber.democrats }}
								</span>
							</div>

							<div :class="congressionalPartyBarRowStyleClasses">
								<span :class="congressionalPartyBarLabelStyleClasses">
									Republicans
								</span>
								<div :class="congressionalPartyBarTrackStyleClasses">
									<div
										:class="congressionalRepublicanBarStyleClasses"
										:style="
											getCongressionalControlBarStyle(
												chamber.republicanPercent,
											)
										"
									/>
								</div>
								<span :class="congressionalPartyBarCountStyleClasses">
									{{ chamber.republicans }}
								</span>
							</div>
						</div>

						<div :class="congressionalChamberMetaStyleClasses">
							<span :class="congressionalChamberMetaItemStyleClasses">
								{{ chamber.totalSeats }} seats
							</span>
							<span
								v-if="chamber.independents > 0"
								:class="congressionalChamberMetaItemStyleClasses"
							>
								{{ chamber.independents }} IND shown separately
							</span>
							<span
								v-if="chamber.vacancies > 0"
								:class="congressionalChamberMetaItemStyleClasses"
							>
								{{ chamber.vacancies }} vacancies
							</span>
						</div>

						<!-- Extractable: CongressionalSeatAvatarGrid -->
						<div
							:class="
								chamber.key === 'house'
									? congressionalHouseSeatGridStyleClasses
									: congressionalSenateSeatGridStyleClasses
							"
						>
							<FWTSeatAvatar
								v-for="seat in chamber.seats"
								:key="seat.id"
								:seat-avatar-size="
									getCongressionalSeatAvatarSize(chamber.key)
								"
								v-bind="congressionalSeatAvatarStyleClasses[seat.party]"
								:aria-label="
									getCongressionalSeatAvatarAriaLabel(seat.party)
								"
							/>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ STYLES ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
