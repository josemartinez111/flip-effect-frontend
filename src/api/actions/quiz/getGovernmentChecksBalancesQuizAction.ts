// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//   API >> ACTIONS >> QUIZ >> GET-GOVERNMENT-CHECKS-BALANCES-QUIZ-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import kyMap from 'ky';
import { ST, tryCatchHandler } from '../../../lib';
import governmentChecksBalancesQuizUrl from '../../data/government-checks-balances-quiz.json?url';
import { isGovernmentChecksBalancesQuiz } from '../../utils/isGovernmentChecksBalancesQuiz';
import type { GovernmentChecksBalancesQuizActionResult } from '../../types/GovernmentChecksBalancesQuizType';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export async function getGovernmentChecksBalancesQuizAction(): Promise<GovernmentChecksBalancesQuizActionResult> {
	const getGovernmentChecksBalancesQuizRequest =
		async (): Promise<GovernmentChecksBalancesQuizActionResult> => {
			const response = await kyMap.get(governmentChecksBalancesQuizUrl, {
				throwHttpErrors: false,
			});

			if (response.status !== ST.OK) {
				return {
					success: false,
					message: `Quiz data request failed with status ${response.status}.`,
				};
			}

			const quizData = await response.json<unknown>();

			if (!isGovernmentChecksBalancesQuiz(quizData)) {
				return {
					success: false,
					message: 'Quiz data is invalid.',
				};
			}

			return {
				success: true,
				message: 'Quiz data loaded.',
				quiz: quizData,
			};
		};

	const result =
		await tryCatchHandler<GovernmentChecksBalancesQuizActionResult>({
			asyncActionCallback: getGovernmentChecksBalancesQuizRequest,
			errorContext: 'Error loading government checks and balances quiz',
		});

	const quizLoadError = {
		success: false,
		message: 'Quiz data failed to load.',
	};

	return result ?? quizLoadError;
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
