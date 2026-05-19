<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: HOME > HOME_PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Card from 'primevue/card';
import { onMounted, onUnmounted } from 'vue';
import {
	ApprovalRatingTierSection,
	CongressionalSeatAvatar,
	CivicRepresentativeSearchSection,
	FWTScrollReveal,
	HomeHeroSection,
	MidtermsCountdownSection,
} from '../../components';
import { UseHomeComposable } from './UseHomeComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	mainContainerStyleClasses,
	midtermsCountdown,
	midtermsDateLabel,
	startMidtermsCountdown,
	stopMidtermsCountdown,
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
} = UseHomeComposable();

type CivicRepresentativeSearchFilterOption = {
	label: string;
	value: string;
};

type CongressionalSeatParty =
	| 'democrat'
	| 'republican'
	| 'independent'
	| 'vacant';

type CongressionalSeatSize = 'house' | 'senate';

type CongressionalSeat = {
	id: string;
	party: CongressionalSeatParty;
};

type CongressionalControlChamber = {
	key: CongressionalSeatSize;
	title: string;
	statusLabel: string;
	totalSeats: number;
	democratLabel: string;
	democrats: number;
	republicans: number;
	independents: number;
	vacancies: number;
	democratPercent: number;
	republicanPercent: number;
	summary: string;
	pathSummary: string;
	seats: Array<CongressionalSeat>;
};

const civicRepresentativeSearchTitle = 'Find Your Representatives';
const civicRepresentativeSearchPlaceholder =
	'Search by ZIP, city, state, or representative';
const civicRepresentativeSearchFilterOptions: Array<CivicRepresentativeSearchFilterOption> =
	[
		{ label: 'Federal', value: 'federal' },
		{ label: 'House', value: 'house' },
		{ label: 'Senate', value: 'senate' },
		{ label: 'State', value: 'state' },
	];

const civicRepresentativeSearchDefaultFilters: Array<string> = [
	'federal',
	'house',
];

const getCongressionalSeatRange = ({
	chamberKey,
	party,
	count,
}: {
	chamberKey: CongressionalSeatSize;
	party: CongressionalSeatParty;
	count: number;
}): Array<CongressionalSeat> => {
	return Array.from({ length: count }, (_seat, index) => {
		return {
			id: `${chamberKey}-${party}-${index + 1}`,
			party,
		};
	});
};

const getCongressionalControlPercent = ({
	count,
	totalSeats,
}: {
	count: number;
	totalSeats: number;
}) => {
	return Math.round((count / totalSeats) * 1000) / 10;
};

const getCongressionalSeatCollection = ({
	chamberKey,
	democrats,
	republicans,
	independents,
	vacancies,
}: {
	chamberKey: CongressionalSeatSize;
	democrats: number;
	republicans: number;
	independents: number;
	vacancies: number;
}) => {
	return [
		...getCongressionalSeatRange({
			chamberKey,
			party: 'democrat',
			count: democrats,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'independent',
			count: independents,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'vacant',
			count: vacancies,
		}),
		...getCongressionalSeatRange({
			chamberKey,
			party: 'republican',
			count: republicans,
		}),
	];
};

const getCongressionalControlBarStyle = (percentage: number) => {
	return {
		width: `${percentage}%`,
	};
};

const congressionalControlChambers: Array<CongressionalControlChamber> = [
	{
		key: 'house',
		title: 'House Control',
		statusLabel: 'GOP Hold',
		totalSeats: 435,
		democratLabel: 'Democrats',
		democrats: 213,
		republicans: 220,
		independents: 0,
		vacancies: 2,
		democratPercent: getCongressionalControlPercent({
			count: 213,
			totalSeats: 435,
		}),
		republicanPercent: getCongressionalControlPercent({
			count: 220,
			totalSeats: 435,
		}),
		summary: 'Republicans hold the House by 7 seats.',
		pathSummary: 'Democrats need 5 seats to retake control.',
		seats: getCongressionalSeatCollection({
			chamberKey: 'house',
			democrats: 213,
			republicans: 220,
			independents: 0,
			vacancies: 2,
		}),
	},
	{
		key: 'senate',
		title: 'Senate Control',
		statusLabel: 'GOP Edge',
		totalSeats: 100,
		democratLabel: 'Dem + IND caucus',
		democrats: 47,
		republicans: 53,
		independents: 2,
		vacancies: 0,
		democratPercent: getCongressionalControlPercent({
			count: 47,
			totalSeats: 100,
		}),
		republicanPercent: getCongressionalControlPercent({
			count: 53,
			totalSeats: 100,
		}),
		summary: 'Senate control favors Republicans by 6 seats.',
		pathSummary: 'Democratic path to majority: 4 seats.',
		seats: getCongressionalSeatCollection({
			chamberKey: 'senate',
			democrats: 45,
			republicans: 53,
			independents: 2,
			vacancies: 0,
		}),
	},
];
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

onMounted(() => {
	startMidtermsCountdown();
});

onUnmounted(() => {
	stopMidtermsCountdown();
});
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main :class="mainContainerStyleClasses">
		<!-- COMPONENT: CivicRepresentativeSearchSection -->
		<CivicRepresentativeSearchSection
			:title="civicRepresentativeSearchTitle"
			:placeholder="civicRepresentativeSearchPlaceholder"
			:filter-options="civicRepresentativeSearchFilterOptions"
			:default-selected-filters="civicRepresentativeSearchDefaultFilters"
			checkbox-name="civic-representative-search-filter"
		/>

		<!-- COMPONENT: MidtermsCountdownSection -->
		<MidtermsCountdownSection
			:midterms-countdown="midtermsCountdown"
			:midterms-date-label="midtermsDateLabel"
		/>

		<FWTScrollReveal
			direction="up"
			:distance="42"
			:duration-ms="900"
		>
			<!-- COMPONENT: HomeHeroSection -->
			<HomeHeroSection />
		</FWTScrollReveal>

		<FWTScrollReveal
			direction="left"
			:distance="58"
			:duration-ms="940"
		>
			<!-- COMPONENT: ApprovalRatingTierSection -->
			<ApprovalRatingTierSection />
		</FWTScrollReveal>

		<FWTScrollReveal
			direction="right"
			:distance="64"
			:duration-ms="980"
		>
			<!-- COMPONENT: CongressionalControlSection -->
			<section :class="congressionalControlSectionStyleClasses">
				<div :class="congressionalControlShellStyleClasses">
					<div :class="congressionalControlHeaderStyleClasses">
						<div>
							<div :class="congressionalControlEyebrowStyleClasses">
								Congressional Balance
							</div>
							<h2 :class="congressionalControlTitleStyleClasses">
								House & Senate Control
							</h2>
						</div>

						<p :class="congressionalControlLeadStyleClasses">
							Track the balance of power shaping the next fight in Congress.
						</p>
					</div>

					<div :class="congressionalControlGridStyleClasses">
						<!-- Extractable: CongressionalChamberControlCard -->
						<Card
							v-for="chamber in congressionalControlChambers"
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
									<CongressionalSeatAvatar
										v-for="seat in chamber.seats"
										:key="seat.id"
										:party="seat.party"
										:size="chamber.key"
									/>
								</div>
							</template>
						</Card>
					</div>
				</div>
			</section>
		</FWTScrollReveal>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
