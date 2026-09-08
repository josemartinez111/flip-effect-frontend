// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//           LIB > STORES > USE_TARIFF_ACTIVITY_STORE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                       IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchTariffActivityAction, type TariffActivity } from '../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- Own one last-good snapshot across route visits; failed requests never erase existing chart data. ---
export const useTariffActivityStore = defineStore('tariffActivity', () => {
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	// --- State ---
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	const tariffActivity = ref<TariffActivity | null>(null);
	const isLoading = ref(false);
	const isStale = ref(false);
	const errorMessage = ref<string | null>(null);

	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	// --- Actions ---
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	const fetchTariffActivity = async (): Promise<void> => {
		if (isLoading.value) {
			return;
		}

		isLoading.value = true;
		errorMessage.value = null;
		const result = await fetchTariffActivityAction();

		if (result.success) {
			tariffActivity.value = result.tariffActivity;
			isStale.value = result.isStale;
		} else {
			errorMessage.value = result.message;
			isStale.value = tariffActivity.value !== null;
		}

		isLoading.value = false;
	};
	const tariffActivityStore = {
		tariffActivity,
		isLoading,
		isStale,
		errorMessage,
		fetchTariffActivity,
	};

	return tariffActivityStore;
});
