// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//           LIB > STORES > USE_HOUSEHOLD_PRICE_STORE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                       IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	fetchHouseholdPricesAction,
	type HouseholdPrices,
} from '../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Own one last-good snapshot across route visits; failed requests never erase existing chart data. ---
export const useHouseholdPriceStore = defineStore(
	'householdPrices',
	() => {
		// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
		// --- State ---
		// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
		const householdPrices = ref<HouseholdPrices | null>(null);
		const isLoading = ref(false);
		const isStale = ref(false);
		const errorMessage = ref<string | null>(null);

		// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
		// --- Actions ---
		// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
		const fetchHouseholdPrices = async (): Promise<void> => {
			if (isLoading.value) {
				return;
			}

			isLoading.value = true;
			errorMessage.value = null;
			const result = await fetchHouseholdPricesAction();

			if (result.success) {
				householdPrices.value = result.householdPrices;
				isStale.value = result.isStale;
			} else {
				errorMessage.value = result.message;
				isStale.value = householdPrices.value !== null;
			}

			isLoading.value = false;
		};
		const householdPricesStore = {
			householdPrices,
			isLoading,
			isStale,
			errorMessage,
			fetchHouseholdPrices,
		};

		return householdPricesStore;
	},
);
