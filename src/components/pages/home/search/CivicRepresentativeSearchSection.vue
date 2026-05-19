<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > SEARCH
    > CIVIC_REPRESENTATIVE_SEARCH_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { UseHomeComposable } from '../../../../pages/home/UseHomeComposable.ts';
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

const {
	civicSearchSectionStyleClasses,
	civicSearchShellStyleClasses,
	civicSearchTitleStyleClasses,
	civicSearchControlsStyleClasses,
	civicSearchInputStyleClasses,
	civicSearchFiltersStyleClasses,
	civicSearchFilterItemStyleClasses,
	civicSearchFilterLabelStyleClasses,
} = UseHomeComposable();
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
