// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                        LIB > STORES > USE_APPROVAL_STORE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                       IMPORTS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchApprovalRatingAction } from '../../api';
import type { ApprovalRating } from '../../api';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const useApprovalStore = defineStore('approval', () => {
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	// --- State ---
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	const trumpRating = ref<ApprovalRating | null>(null);
	const economyRating = ref<ApprovalRating | null>(null);
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);

	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	// --- Actions ---
	// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
	// --- Pull both feeds in parallel; each falls back independently so one source down never blanks the other. ---
	const fetchApprovalRatings = async (): Promise<void> => {
		isLoading.value = true;
		errorMessage.value = null;

		const [trump, economy] = await Promise.all([
			fetchApprovalRatingAction('trump'),
			fetchApprovalRatingAction('economy'),
		]);

		if (trump.success && trump.rating) {
			trumpRating.value = trump.rating;
		} else {
			errorMessage.value = trump.message;
		}

		if (economy.success && economy.rating) {
			economyRating.value = economy.rating;
		} else {
			errorMessage.value = economy.message;
		}

		isLoading.value = false;
	};

	return {
		trumpRating,
		economyRating,
		isLoading,
		errorMessage,
		fetchApprovalRatings,
	};
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
