// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//  API >> TYPES >> GOVERNMENT-CHECKS-BALANCES-QUIZ-TYPE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type GovernmentChecksBalancesQuiz = {
	quizId: string;
	title: string;
	description: string;
	questions: Array<{
		id: string;
		category: string;
		question: string;
		options: Array<{
			id: string;
			label: string;
		}>;
		correctOptionId: string;
		explanation: string;
		incorrectExplanation: string;
	}>;
};

export type GovernmentChecksBalancesQuizActionResult = {
	success: boolean;
	message: string;
	quiz?: GovernmentChecksBalancesQuiz;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
