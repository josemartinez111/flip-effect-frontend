<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > SEARCH
    > CIVIC_REPRESENTATIVE_SEARCH_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import InputText from 'primevue/inputtext';
import { computed, onUnmounted, ref } from 'vue';
import {
	fetchCivicRepresentativesAction,
	type CivicRepresentative,
	type CivicRepresentativeRecord,
	type CivicRepresentativeSearchFilter,
} from '../../../../api';
import { RepresentativePlaceholder } from '../../../../assets';
import BaseModal from '../../../utils/BaseModal.vue';
import { UseCivicRepresentativeSearchComposable } from '../../pages-composables/UseCivicRepresentativeSearchComposable.ts';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type CivicSearchFilterOption = {
	label: string;
	value: CivicSearchFilterValue;
	description: string;
	helpText: string;
};

type CivicRepresentativeLink = {
	label: string;
	url: string;
};

type CivicSearchHelperLine = {
	label: string;
	copy: string;
};

type CivicSearchFilterValue =
	| 'federal'
	| 'state'
	| 'all';

type CivicRepresentativeSearchSectionProps = {
	title: string;
	placeholder: string;
	filterOptions: Array<CivicSearchFilterOption>;
	defaultSelectedFilters?: Array<CivicSearchFilterValue>;
};

const {
	title,
	placeholder,
	filterOptions,
	defaultSelectedFilters = [],
} = defineProps<CivicRepresentativeSearchSectionProps>();

const civicSearchValue = ref('');
const civicSearchFilter = ref<CivicSearchFilterValue>(
	defaultSelectedFilters[0] ?? 'federal',
);
const civicSearchLoading = ref(false);
const civicSearchMessage = ref('');
const civicSearchMessageSuccess = ref(true);
const civicSearchResultsModalOpen = ref(false);
const civicRepresentativeSearchResult = ref<CivicRepresentative>();
const civicSearchHelperLines: Array<CivicSearchHelperLine> = [
	{
		label: 'Search',
		copy: 'Use a ZIP, address, city, state, or representative name.',
	},
	{
		label: 'US Congress',
		copy: 'Finds House members and U.S. senators in Washington, DC.',
	},
	{
		label: 'State Lawmakers',
		copy: 'Finds state capitol reps who vote on state laws and budgets.',
	},
];

// --- After a failed search the message lingers; revert to the helper note so the panel resets itself. ---
const CIVIC_SEARCH_MESSAGE_REVERT_MS = 6000;
let civicSearchMessageRevertTimer: ReturnType<typeof setTimeout> | undefined;

const scheduleCivicSearchMessageRevert = () => {
	if (civicSearchMessageRevertTimer) {
		clearTimeout(civicSearchMessageRevertTimer);
	}

	civicSearchMessageRevertTimer = setTimeout(() => {
		civicSearchMessage.value = '';
		civicSearchMessageSuccess.value = true;
	}, CIVIC_SEARCH_MESSAGE_REVERT_MS);
};

onUnmounted(() => {
	if (civicSearchMessageRevertTimer) {
		clearTimeout(civicSearchMessageRevertTimer);
	}
});

const civicRepresentativeRecords = computed(() => {
	const representativeRecords =
		civicRepresentativeSearchResult.value?.representatives ?? [];

	return representativeRecords;
});

const civicSearchResultCountLabel = computed(() => {
	const representativeCount = civicRepresentativeRecords.value.length;
	const representativeLabel =
		representativeCount === 1 ? 'representative' : 'representatives';
	const result = `${representativeCount} ${representativeLabel} found`;

	return result;
});

const civicSearchModalHeader = computed(() => {
	const query = civicSearchValue.value.trim();
	const result =
		query.length > 0 ? `Representatives for ${query}` : 'Representatives';

	return result;
});

const civicSearchHasMessage = computed(() => {
	const result = civicSearchMessage.value.trim().length > 0;

	return result;
});

const workerSearchFilters = computed(() => {
	switch (civicSearchFilter.value) {
		case 'all': {
			const filters: Array<CivicRepresentativeSearchFilter> = [
				'house',
				'senate',
				'state',
			];

			return filters;
		}

		case 'federal': {
			const filters: Array<CivicRepresentativeSearchFilter> = [
				'house',
				'senate',
			];

			return filters;
		}

		default: {
			const filters: Array<CivicRepresentativeSearchFilter> = ['state'];

			return filters;
		}
	}
});

const submitCivicRepresentativeSearch = async () => {
	const query = civicSearchValue.value.trim();

	if (query.length === 0) {
		civicSearchMessage.value =
			'Enter a ZIP, city, state, address, or representative name.';
		civicSearchMessageSuccess.value = false;
		scheduleCivicSearchMessageRevert();
		return;
	}

	if (civicSearchMessageRevertTimer) {
		clearTimeout(civicSearchMessageRevertTimer);
	}

	civicSearchLoading.value = true;
	civicSearchMessage.value = '';

	// --- The worker owns source routing, key handling, and friendly error messages. ---
	const result = await fetchCivicRepresentativesAction({
		query,
		filters: workerSearchFilters.value,
	});

	civicSearchLoading.value = false;
	civicSearchMessage.value = result.message;
	civicSearchMessageSuccess.value = result.success;

	if (!result.success || !result.civicRepresentatives) {
		civicRepresentativeSearchResult.value = undefined;
		civicSearchResultsModalOpen.value = false;
		scheduleCivicSearchMessageRevert();
		return;
	}

	civicRepresentativeSearchResult.value = result.civicRepresentatives;
	civicSearchResultsModalOpen.value = true;
};

const handleCivicSearchModalHide = () => {
	civicSearchMessage.value = '';
	civicSearchMessageSuccess.value = true;
};

const getRepresentativePhotoUrl = (
	representative: CivicRepresentativeRecord,
) => {
	const result =
		representative.photoUrl && representative.photoUrl.trim().length > 0
			? representative.photoUrl
			: RepresentativePlaceholder;

	return result;
};

const handleRepresentativePhotoError = (event: Event) => {
	if (event.target instanceof HTMLImageElement) {
		event.target.src = RepresentativePlaceholder;
	}
};

const getRepresentativeChamberLabel = (
	representative: CivicRepresentativeRecord,
) => {
	const chamber = representative.chamber.replace(/-/g, ' ');
	const result = `${representative.source} ${chamber}`;

	return result;
};

const getRepresentativeLocationLabel = (
	representative: CivicRepresentativeRecord,
) => {
	const district = representative.district
		? `District ${representative.district}`
		: 'At large';
	const result = `${representative.state} · ${district}`;

	return result;
};

const getRepresentativeLinks = (
	representative: CivicRepresentativeRecord,
) => {
	const links: Array<CivicRepresentativeLink> = [
		...(representative.websiteUrl
			? [{ label: 'Website', url: representative.websiteUrl }]
			: []),
		...(representative.contactUrl
			? [{ label: 'Contact', url: representative.contactUrl }]
			: []),
	];

	return links;
};

const {
	civicSearchSectionStyleClasses,
	civicSearchShellStyleClasses,
	civicSearchTitleStyleClasses,
	civicSearchControlsStyleClasses,
	civicSearchInputStyleClasses,
	civicSearchSearchButtonStyleClasses,
	civicSearchFiltersStyleClasses,
	civicSearchFilterButtonStyleClasses,
	civicSearchFilterCopyStyleClasses,
	civicSearchFilterTitleStyleClasses,
	civicSearchFilterDescriptionStyleClasses,
	civicSearchFilterMarkerStyleClasses,
	civicSearchMessageStyleClasses,
	civicSearchApiNoteStyleClasses,
	civicSearchApiNoteLabelStyleClasses,
	civicSearchApiNoteListStyleClasses,
	civicSearchApiNoteItemStyleClasses,
	civicSearchApiNoteCopyStyleClasses,
	civicSearchResultsModalRootStyleClasses,
	civicSearchResultsModalContentStyleClasses,
	civicSearchResultsHeaderStyleClasses,
	civicSearchResultsCountStyleClasses,
	civicSearchResultsGridStyleClasses,
	civicSearchResultCardStyleClasses,
	civicSearchResultImageStyleClasses,
	civicSearchResultCardBodyStyleClasses,
	civicSearchResultMetaStyleClasses,
	civicSearchResultPartyStyleClasses,
	civicSearchResultNameStyleClasses,
	civicSearchResultInfoStyleClasses,
	civicSearchResultLinksStyleClasses,
	civicSearchResultLinkStyleClasses,
} = UseCivicRepresentativeSearchComposable();
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="civicSearchSectionStyleClasses">
		<form
			:class="civicSearchShellStyleClasses"
			@submit.prevent="submitCivicRepresentativeSearch"
		>
			<!-- SEARCH: TITLE -->

			<div :class="civicSearchTitleStyleClasses">
				{{ title }}
			</div>

			<!-- SEARCH: CONTROLS -->

			<div :class="civicSearchControlsStyleClasses">
				<InputText
					v-model="civicSearchValue"
					:placeholder="placeholder"
					:class="civicSearchInputStyleClasses"
					:disabled="civicSearchLoading"
				/>

				<div :class="civicSearchFiltersStyleClasses">
					<button
						v-for="filterOption in filterOptions"
						:key="filterOption.value"
						type="button"
						:title="filterOption.helpText"
						:class="
							civicSearchFilterButtonStyleClasses(
								civicSearchFilter === filterOption.value,
							)
						"
						:aria-pressed="civicSearchFilter === filterOption.value"
						:aria-label="`${filterOption.label}: ${filterOption.helpText}`"
						@click="civicSearchFilter = filterOption.value"
					>
						<span
							:class="
								civicSearchFilterMarkerStyleClasses(
									civicSearchFilter === filterOption.value,
								)
							"
						></span>

						<span :class="civicSearchFilterCopyStyleClasses">
							<span :class="civicSearchFilterTitleStyleClasses">
								{{ filterOption.label }}
							</span>

							<span :class="civicSearchFilterDescriptionStyleClasses">
								{{ filterOption.description }}
							</span>
						</span>
					</button>
				</div>

				<button
					type="submit"
					:class="civicSearchSearchButtonStyleClasses"
					:disabled="civicSearchLoading"
				>
					{{ civicSearchLoading ? 'Searching' : 'Search' }}
				</button>
			</div>

			<!-- SEARCH: HELPER / WORKER MESSAGE -->

			<div
				v-if="civicSearchHasMessage"
				:class="civicSearchMessageStyleClasses(civicSearchMessageSuccess)"
			>
				{{ civicSearchMessage }}
			</div>

			<div
				v-else
				:class="civicSearchApiNoteStyleClasses"
			>
				<span :class="civicSearchApiNoteLabelStyleClasses">
					How it works:
				</span>

				<ul :class="civicSearchApiNoteListStyleClasses">
					<li
						v-for="helperLine in civicSearchHelperLines"
						:key="helperLine.label"
						:class="civicSearchApiNoteItemStyleClasses"
					>
						<span :class="civicSearchApiNoteLabelStyleClasses">
							{{ helperLine.label }}:
						</span>

						<span :class="civicSearchApiNoteCopyStyleClasses">
							{{ helperLine.copy }}
						</span>
					</li>
				</ul>
			</div>
		</form>

		<!-- SEARCH: RESULTS MODAL -->

		<BaseModal
			v-model:visible="civicSearchResultsModalOpen"
			:header="civicSearchModalHeader"
			:root-class="civicSearchResultsModalRootStyleClasses"
			:content-class="civicSearchResultsModalContentStyleClasses"
			@hide="handleCivicSearchModalHide"
		>
			<div :class="civicSearchResultsHeaderStyleClasses">
				<div :class="civicSearchResultsCountStyleClasses">
					{{ civicSearchResultCountLabel }}
				</div>

				<div :class="civicSearchResultInfoStyleClasses">
					{{ civicRepresentativeSearchResult?.location?.matchedAddress }}
				</div>
			</div>

			<div :class="civicSearchResultsGridStyleClasses">
				<article
					v-for="representative in civicRepresentativeRecords"
					:key="representative.id"
					:class="civicSearchResultCardStyleClasses"
				>
					<!-- SEARCH: REPRESENTATIVE IMAGE -->

					<img
						:src="getRepresentativePhotoUrl(representative)"
						:alt="representative.fullName"
						:class="civicSearchResultImageStyleClasses"
						@error="handleRepresentativePhotoError"
					/>

					<!-- SEARCH: REPRESENTATIVE DETAILS -->

					<div :class="civicSearchResultCardBodyStyleClasses">
						<div :class="civicSearchResultMetaStyleClasses">
							<span :class="civicSearchResultPartyStyleClasses">
								{{ representative.party }}
							</span>

							<span :class="civicSearchResultInfoStyleClasses">
								{{ getRepresentativeChamberLabel(representative) }}
							</span>
						</div>

						<h3 :class="civicSearchResultNameStyleClasses">
							{{ representative.fullName }}
						</h3>

						<div :class="civicSearchResultInfoStyleClasses">
							{{ getRepresentativeLocationLabel(representative) }}
						</div>

						<div
							v-if="representative.phone"
							:class="civicSearchResultInfoStyleClasses"
						>
							{{ representative.phone }}
						</div>

						<div
							v-if="representative.office"
							:class="civicSearchResultInfoStyleClasses"
						>
							{{ representative.office }}
						</div>

						<div :class="civicSearchResultLinksStyleClasses">
							<a
								v-for="representativeLink in getRepresentativeLinks(
									representative,
								)"
								:key="representativeLink.url"
								:href="representativeLink.url"
								:class="civicSearchResultLinkStyleClasses"
								target="_blank"
								rel="noopener noreferrer"
							>
								{{ representativeLink.label }}
							</a>
						</div>
					</div>
				</article>
			</div>
		</BaseModal>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
