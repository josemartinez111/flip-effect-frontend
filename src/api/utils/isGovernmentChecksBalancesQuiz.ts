// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//       API >> UTILS >> IS-GOVERNMENT-CHECKS-BALANCES-QUIZ.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

import type { GovernmentChecksBalancesQuiz } from '../types/GovernmentChecksBalancesQuizType';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type GovernmentChecksBalancesQuizQuestion =
	GovernmentChecksBalancesQuiz['questions'][number];

type GovernmentChecksBalancesQuizOption =
	GovernmentChecksBalancesQuizQuestion['options'][number];

const isRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null;
};

const isGovernmentChecksBalancesQuizOption = (
	value: unknown,
): value is GovernmentChecksBalancesQuizOption => {
	if (!isRecord(value)) {
		return false;
	}
	
	let result = typeof value.id === 'string' && typeof value.label === 'string';
	return result;
};

const isGovernmentChecksBalancesQuizQuestion = (
	value: unknown,
): value is GovernmentChecksBalancesQuizQuestion => {
	if (!isRecord(value)) {
		return false;
	}
	
	const difficultyValid = (
		value.difficulty === undefined ||
		value.difficulty === 'easy' ||
		value.difficulty === 'medium' ||
		value.difficulty === 'hard'
	);

	let result = (
		typeof value.id === 'string' &&
		typeof value.category === 'string' &&
		difficultyValid &&
		typeof value.question === 'string' &&
		Array.isArray(value.options) &&
		value.options.every(isGovernmentChecksBalancesQuizOption) &&
		typeof value.correctOptionId === 'string' &&
		typeof value.explanation === 'string' &&
		typeof value.incorrectExplanation === 'string' &&
		value.options.some((option) => {
			return option.id === value.correctOptionId;
		})
	);
	
	return result;
};

export const isGovernmentChecksBalancesQuiz = (
	value: unknown,
): value is GovernmentChecksBalancesQuiz => {
	if (!isRecord(value)) {
		return false;
	}
	
	let result = (
		typeof value.quizId === 'string' &&
		typeof value.title === 'string' &&
		typeof value.description === 'string' &&
		Array.isArray(value.questions) &&
		value.questions.length > 0 &&
		value.questions.every(isGovernmentChecksBalancesQuizQuestion)
	);
	
	return result;
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
