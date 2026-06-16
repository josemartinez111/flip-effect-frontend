// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: PAGES > PAGES_COMPOSABLES
// > USE_GOVERNMENT_CHECKS_BALANCES_QUIZ_COMPOSABLE.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	computed,
	onUnmounted,
	ref,
	toValue,
	watch,
	type MaybeRefOrGetter,
} from 'vue';
import {
	fetchGovernmentChecksBalancesQuizAction,
	type GovernmentChecksBalancesQuiz,
} from '../../../api';
import { UseGovernmentChecksBalancesQuizStyleComposable } from './UseGovernmentChecksBalancesQuizStyleComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type QuizQuestion = GovernmentChecksBalancesQuiz['questions'][number];
type QuizOption = QuizQuestion['options'][number];

type UseGovernmentChecksBalancesQuizComposableProps = {
	active: MaybeRefOrGetter<boolean>;
};

export const UseGovernmentChecksBalancesQuizComposable = ({
	active,
}: UseGovernmentChecksBalancesQuizComposableProps) => {
	const QUIZ_QUESTION_COUNT = 17;
	const quiz = ref<GovernmentChecksBalancesQuiz>();
	const activeQuizQuestions = ref<Array<QuizQuestion>>([]);
	const quizLoading = ref(false);
	const quizLoadMessage = ref('');
	const quizStarted = ref(false);
	const quizCompleted = ref(false);
	const currentQuestionIndex = ref(0);
	const selectedOptionId = ref<string>();
	const currentQuestionAnswered = ref(false);
	const correctAnswerCount = ref(0);
	const questionCardKey = ref(0);
	let quizAdvanceTimeoutId: number | undefined;

	const currentQuestion = computed(() => {
		return activeQuizQuestions.value[currentQuestionIndex.value];
	});

	const totalQuestionCount = computed(() => {
		return activeQuizQuestions.value.length;
	});

	const quizProgressPercentage = computed(() => {
		if (totalQuestionCount.value === 0) {
			return 0;
		}

		return Math.round(
			((currentQuestionIndex.value + 1) / totalQuestionCount.value) * 100,
		);
	});

	const quizScorePercentage = computed(() => {
		if (totalQuestionCount.value === 0) {
			return 0;
		}

		return Math.round(
			(correctAnswerCount.value / totalQuestionCount.value) * 100,
		);
	});

	const selectedAnswerCorrect = computed(() => {
		return selectedOptionId.value === currentQuestion.value?.correctOptionId;
	});

	const quizScoreLabel = computed(() => {
		switch (true) {
			case quizScorePercentage.value >= 90:
				return 'Constitutional Operator';
			case quizScorePercentage.value >= 70:
				return 'Checks & Balances Ready';
			case quizScorePercentage.value >= 50:
				return 'Civic Warning Light';
			default:
				return 'Retake Recommended';
		}
	});

	const quizHighScoreAchieved = computed(() => quizScorePercentage.value >= 82);

	const quizResultMessage = computed(() => {
		return quizHighScoreAchieved.value
			? 'Civic command confirmed. You know the rules authoritarians hope people skip.'
			: 'Keep sharpening the fundamentals. The Constitution works better when voters know where power is supposed to stop.';
	});

	const quizStatusTagValue = computed(() => {
		if (!currentQuestionAnswered.value) {
			return 'Choose One';
		}

		return selectedAnswerCorrect.value ? 'Correct' : 'Review';
	});

	const quizStatusTagStyleClasses = computed(() => {
		return twMerge(
			clsx(
				'font-orbitron! text-[0.65rem]! font-black! uppercase! tracking-[0.16em]',
				currentQuestionAnswered.value && selectedAnswerCorrect.value
					? 'bg-emerald-400/16! text-emerald-100!'
					: currentQuestionAnswered.value
						? 'bg-flipeffect-rose-bright/16! text-rose-100!'
						: 'bg-white/10! text-slate-200!',
			),
		);
	});

	const quizFeedbackTitleStyleClasses = computed(() => {
		return twMerge(
			clsx(
				'font-orbitron text-xs font-black uppercase tracking-[0.18em]',
				selectedAnswerCorrect.value
					? 'text-emerald-200'
					: 'text-flipeffect-rose-bright',
			),
		);
	});

	const clearQuizAdvanceTimeout = () => {
		if (quizAdvanceTimeoutId !== undefined) {
			window.clearTimeout(quizAdvanceTimeoutId);
			quizAdvanceTimeoutId = undefined;
		}
	};

	const resetCurrentQuestion = () => {
		selectedOptionId.value = undefined;
		currentQuestionAnswered.value = false;
	};

	const getShuffledQuizQuestions = (questions: Array<QuizQuestion>) => {
		const shuffledQuestions = [...questions];

		for (
			let currentIndex = shuffledQuestions.length - 1;
			currentIndex > 0;
			currentIndex -= 1
		) {
			const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
			const currentQuestion = shuffledQuestions[currentIndex];

			shuffledQuestions[currentIndex] = shuffledQuestions[randomIndex];
			shuffledQuestions[randomIndex] = currentQuestion;
		}

		return shuffledQuestions;
	};

	const getQuizQuestionDeck = (questions: Array<QuizQuestion>) => {
		return getShuffledQuizQuestions(questions).slice(0, QUIZ_QUESTION_COUNT);
	};

	const resetQuizState = () => {
		clearQuizAdvanceTimeout();
		quizStarted.value = false;
		quizCompleted.value = false;
		currentQuestionIndex.value = 0;
		correctAnswerCount.value = 0;
		questionCardKey.value = 0;
		activeQuizQuestions.value = [];
		resetCurrentQuestion();
	};

	const loadQuiz = async () => {
		if (quiz.value || quizLoading.value) {
			return;
		}

		quizLoading.value = true;
		quizLoadMessage.value = '';

		const result = await fetchGovernmentChecksBalancesQuizAction();

		if (result.success && result.quiz) {
			quiz.value = result.quiz;
			quizLoadMessage.value = '';
		} else {
			quizLoadMessage.value = result.message;
		}

		quizLoading.value = false;
	};

	const startQuiz = async () => {
		await loadQuiz();

		if (!quiz.value) {
			return;
		}

		resetQuizState();
		activeQuizQuestions.value = getQuizQuestionDeck(quiz.value.questions);
		quizStarted.value = true;
	};

	const moveToNextQuestion = () => {
		clearQuizAdvanceTimeout();

		if (currentQuestionIndex.value >= totalQuestionCount.value - 1) {
			quizCompleted.value = true;
			return;
		}

		currentQuestionIndex.value += 1;
		questionCardKey.value += 1;
		resetCurrentQuestion();
	};

	const selectAnswerOption = (option: QuizOption) => {
		const question = currentQuestion.value;

		if (!question || currentQuestionAnswered.value) {
			return;
		}

		selectedOptionId.value = option.id;
		currentQuestionAnswered.value = true;

		if (option.id === question.correctOptionId) {
			correctAnswerCount.value += 1;
			quizAdvanceTimeoutId = window.setTimeout(moveToNextQuestion, 1900);
			return;
		}

		quizAdvanceTimeoutId = window.setTimeout(moveToNextQuestion, 5200);
	};

	const getAnswerOptionStyleClasses = (option: QuizOption) => {
		const question = currentQuestion.value;
		const correctOptionSelected = option.id === question?.correctOptionId;
		const wrongOptionSelected =
			currentQuestionAnswered.value &&
			option.id === selectedOptionId.value &&
			!correctOptionSelected;

		return twMerge(
			clsx(
				'group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3',
				'text-left transition duration-200',
				'border-white/10 bg-white/6 text-slate-100',
				'hover:border-flipeffect-cyan/60 hover:bg-flipeffect-cyan/10',
				'disabled:cursor-default',
				currentQuestionAnswered.value &&
					!correctOptionSelected &&
					!wrongOptionSelected &&
					'opacity-52',
				currentQuestionAnswered.value &&
					correctOptionSelected &&
					'border-emerald-300/70 bg-emerald-400/16 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.22)]',
				wrongOptionSelected &&
					'border-flipeffect-rose-bright/80 bg-flipeffect-rose-bright/14 text-rose-50 shadow-[0_0_22px_rgba(251,113,133,0.22)]',
			),
		);
	};

	const {
		quizCardPassThrough,
		quizCardTransitionActiveStyleClasses,
		quizCardTransitionEnterFromStyleClasses,
		quizCardTransitionLeaveToStyleClasses,
		quizCardTransitionDefaultStyleClasses,
		quizRootStyleClasses,
		quizIntroContainerStyleClasses,
		quizEyebrowStyleClasses,
		quizTitleStyleClasses,
		quizLeadStyleClasses,
		quizLoadMessageStyleClasses,
		quizPrimaryButtonStyleClasses,
		quizResultsContainerStyleClasses,
		quizCardStyleClasses,
		quizResultsCardStyleClasses,
		quizHighScoreCardStyleClasses,
		quizResultsContentStyleClasses,
		quizResultsTagStyleClasses,
		quizHighScoreTagStyleClasses,
		quizHighScoreSignalGridStyleClasses,
		quizHighScoreSignalStyleClasses,
		quizScoreValueStyleClasses,
		quizHighScoreValueStyleClasses,
		quizScoreLabelStyleClasses,
		quizScoreSummaryStyleClasses,
		quizQuestionContainerStyleClasses,
		quizQuestionHeaderStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizQuestionCardContentStyleClasses,
		quizQuestionTitleStyleClasses,
		quizAnswerOptionsGridStyleClasses,
		quizAnswerOptionMarkerStyleClasses,
		quizAnswerOptionLabelStyleClasses,
		quizFeedbackStyleClasses,
		quizFeedbackCopyStyleClasses,
		quizNextButtonStyleClasses,
	} = UseGovernmentChecksBalancesQuizStyleComposable();

	watch(
		() => toValue(active),
		(activeValue) => {
			if (activeValue) {
				void loadQuiz();
				return;
			}

			resetQuizState();
		},
		{ immediate: true },
	);

	onUnmounted(() => {
		clearQuizAdvanceTimeout();
	});

	return {
		quizLoading,
		quizLoadMessage,
		quizStarted,
		quizCompleted,
		currentQuestionIndex,
		currentQuestionAnswered,
		correctAnswerCount,
		questionCardKey,
		currentQuestion,
		totalQuestionCount,
		quizProgressPercentage,
		quizScorePercentage,
		selectedAnswerCorrect,
		quizScoreLabel,
		quizHighScoreAchieved,
		quizResultMessage,
		quizStatusTagValue,
		quizStatusTagStyleClasses,
		quizFeedbackTitleStyleClasses,
		startQuiz,
		moveToNextQuestion,
		selectAnswerOption,
		getAnswerOptionStyleClasses,
		quizCardPassThrough,
		quizCardTransitionActiveStyleClasses,
		quizCardTransitionEnterFromStyleClasses,
		quizCardTransitionLeaveToStyleClasses,
		quizCardTransitionDefaultStyleClasses,
		quizRootStyleClasses,
		quizIntroContainerStyleClasses,
		quizEyebrowStyleClasses,
		quizTitleStyleClasses,
		quizLeadStyleClasses,
		quizLoadMessageStyleClasses,
		quizPrimaryButtonStyleClasses,
		quizResultsContainerStyleClasses,
		quizCardStyleClasses,
		quizResultsCardStyleClasses,
		quizHighScoreCardStyleClasses,
		quizResultsContentStyleClasses,
		quizResultsTagStyleClasses,
		quizHighScoreTagStyleClasses,
		quizHighScoreSignalGridStyleClasses,
		quizHighScoreSignalStyleClasses,
		quizScoreValueStyleClasses,
		quizHighScoreValueStyleClasses,
		quizScoreLabelStyleClasses,
		quizScoreSummaryStyleClasses,
		quizQuestionContainerStyleClasses,
		quizQuestionHeaderStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizQuestionCardContentStyleClasses,
		quizQuestionTitleStyleClasses,
		quizAnswerOptionsGridStyleClasses,
		quizAnswerOptionMarkerStyleClasses,
		quizAnswerOptionLabelStyleClasses,
		quizFeedbackStyleClasses,
		quizFeedbackCopyStyleClasses,
		quizNextButtonStyleClasses,
	};
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
