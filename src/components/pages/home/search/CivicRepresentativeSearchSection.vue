<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > SEARCH
    > CIVIC_REPRESENTATIVE_SEARCH_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';
import { GlobalEnvs } from '../../../../lib';
import { UseCivicRepresentativeSearchComposable } from '../../pages-composables/UseCivicRepresentativeSearchComposable.ts';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type CivicSearchFilterOption = {
	label: string;
	value: string;
};

type CivicRepresentativeSearchSectionProps = {
	title: string;
	placeholder: string;
	filterOptions: Array<CivicSearchFilterOption>;
	defaultSelectedFilters?: Array<string>;
	checkboxName?: string;
};

const {
	title,
	placeholder,
	filterOptions,
	defaultSelectedFilters = [],
	checkboxName = 'civic-search-filter',
} = defineProps<CivicRepresentativeSearchSectionProps>();

const civicSearchValue = ref('');
const civicSearchFilters = ref<Array<string>>([...defaultSelectedFilters]);
const openStatesApiKeyPlaceholder = 'replace_with_open_states_api_key';
const openStatesApiKeyUrl =
	'https://open.pluralpolicy.com/accounts/profile/#apikey';

const stateLookupSelected = computed(() => {
	return civicSearchFilters.value.includes('state');
});

const openStatesApiKeyConfigured = computed(() => {
	return (
		GlobalEnvs.OpenStatesApiKey.trim().length > 0 &&
		GlobalEnvs.OpenStatesApiKey !== openStatesApiKeyPlaceholder
	);
});

const civicSearchApiNote = computed(() => {
	if (stateLookupSelected.value && !openStatesApiKeyConfigured.value) {
		return 'State lookup needs an Open States API key. Federal, House, and Senate lookup are ready without a key.';
	}

	if (stateLookupSelected.value) {
		return 'State lookup will use Open States. Federal, House, and Senate lookup stay keyless.';
	}

	return 'Federal, House, and Senate lookup use public keyless data. State lookup needs Open States when enabled.';
});

const {
	civicSearchSectionStyleClasses,
	civicSearchShellStyleClasses,
	civicSearchTitleStyleClasses,
	civicSearchControlsStyleClasses,
	civicSearchInputStyleClasses,
	civicSearchFiltersStyleClasses,
	civicSearchFilterItemStyleClasses,
	civicSearchFilterLabelStyleClasses,
	civicSearchApiNoteStyleClasses,
	civicSearchApiNoteLabelStyleClasses,
	civicSearchApiNoteLinkStyleClasses,
} = UseCivicRepresentativeSearchComposable();
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="civicSearchSectionStyleClasses">
		<div :class="civicSearchShellStyleClasses">
			<div :class="civicSearchTitleStyleClasses">
				{{ title }}
			</div>

			<div :class="civicSearchControlsStyleClasses">
				<InputText
					v-model="civicSearchValue"
					:placeholder="placeholder"
					:class="civicSearchInputStyleClasses"
				/>

				<div :class="civicSearchFiltersStyleClasses">
					<div
						v-for="filterOption in filterOptions"
						:key="filterOption.value"
						:class="civicSearchFilterItemStyleClasses"
					>
						<Checkbox
							v-model="civicSearchFilters"
							:input-id="`civic-filter-${filterOption.value}`"
							:name="checkboxName"
							:value="filterOption.value"
							size="small"
						/>
						<label
							:for="`civic-filter-${filterOption.value}`"
							:class="civicSearchFilterLabelStyleClasses"
						>
							{{ filterOption.label }}
						</label>
					</div>
				</div>
			</div>

			<!-- SEARCH: API PLACEHOLDER -->

			<div :class="civicSearchApiNoteStyleClasses">
				<span :class="civicSearchApiNoteLabelStyleClasses">
					API Status:
				</span>
				{{ civicSearchApiNote }}
				<a
					v-if="stateLookupSelected && !openStatesApiKeyConfigured"
					:href="openStatesApiKeyUrl"
					:class="civicSearchApiNoteLinkStyleClasses"
					target="_blank"
					rel="noopener noreferrer"
				>
					Get API key
				</a>
			</div>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
