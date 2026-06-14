// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// API: ACTIONS > CIVIC_REPRESENTATIVES
// > GET_CIVIC_REPRESENTATIVES_ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { ST, tryCatchHandler } from '../../../lib';
import type { CivicRepresentativeActionResult } from '../../action-results/CivicRepresentativeActionResult';
import type { CivicRepresentativeSearchParams } from '../../models/CivicRepresentativeModel';
import {
	getCensusRepresentativeLocation,
	getFederalRepresentatives,
	getOpenStatesApiReady,
	getOpenStatesRepresentatives,
} from './getCivicRepresentativesActionUtils';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function getCivicRepresentativesAction(
	searchParams: CivicRepresentativeSearchParams,
): Promise<CivicRepresentativeActionResult> {
	const getCivicRepresentativesRequest =
		async (): Promise<CivicRepresentativeActionResult> => {
			if (searchParams.query.trim().length === 0) {
				return {
					success: false,
					statusCode: ST.BAD_REQUEST,
					message: 'Enter a ZIP, city, state, address, or representative name.',
				};
			}

			if (searchParams.filters.length === 0) {
				return {
					success: false,
					statusCode: ST.BAD_REQUEST,
					message: 'Choose at least one representative filter.',
				};
			}

			if (searchParams.filters.includes('state') && !getOpenStatesApiReady()) {
				return {
					success: false,
					statusCode: ST.BAD_REQUEST,
					message: 'Open States API key is missing for state representative lookup.',
				};
			}

			const location = await getCensusRepresentativeLocation(searchParams);
			const federalRepresentatives = await getFederalRepresentatives({
				location,
				searchParams,
			});
			const stateRepresentatives = await getOpenStatesRepresentatives({
				location,
				searchParams,
			});
			const representatives = [
				...federalRepresentatives,
				...stateRepresentatives,
			];

			if (representatives.length === 0) {
				return {
					success: false,
					statusCode: ST.NOT_FOUND,
					message: 'No representatives found for that search.',
					civicRepresentatives: {
						representatives,
						location,
					},
				};
			}
			
			const result = {
				success: true,
				statusCode: ST.OK,
				message: 'Representatives loaded.',
				civicRepresentatives: {
					representatives,
					location,
				},
			};
			
			return result;
		};

	const result = await tryCatchHandler<CivicRepresentativeActionResult>({
		asyncActionCallback: getCivicRepresentativesRequest,
		errorContext: 'Error loading civic representatives',
	});
	
	const response = result ?? {
		success: false,
		statusCode: ST.INTERNAL_SERVER_ERROR,
		message: 'Representative lookup failed.',
	};
	
	return response;
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
