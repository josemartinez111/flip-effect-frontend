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
import {
	UseGovernmentChecksBalancesQuizStyleComposable,
	type GovernmentChecksBalancesQuizVariant,
} from './UseGovernmentChecksBalancesQuizStyleComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type QuizQuestion = GovernmentChecksBalancesQuiz['questions'][number];
type QuizOption = QuizQuestion['options'][number];

type UseGovernmentChecksBalancesQuizComposableProps = {
	active: MaybeRefOrGetter<boolean>;
	variant?: GovernmentChecksBalancesQuizVariant;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

export const UseGovernmentChecksBalancesQuizComposable = ({
	active,
	variant = 'modal',
}: UseGovernmentChecksBalancesQuizComposableProps) => {
	// --- One run pulls this many questions out of the full bank. ---
	const QUIZ_QUESTION_COUNT = 17;
	// --- Quiz state: the fetched bank, the deck for this run, and where the player is in it. ---
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
	// --- Ids already served this session, so a perfect run can continue into fresh questions. ---
	const servedQuestionIds = ref<Array<string>>([]);
	const quizTierNumber = ref(1);
	let quizAdvanceTimeoutId: number | undefined;

	// --- The question on screen right now. ---
	const currentQuestion = computed(() => {
		return activeQuizQuestions.value[currentQuestionIndex.value];
	});

	const totalQuestionCount = computed(() => {
		return activeQuizQuestions.value.length;
	});

	// --- Progress bar fill. One-based, so the first question does not read as 0%. ---
	const quizProgressPercentage = computed(() => {
		if (totalQuestionCount.value === 0) {
			return 0;
		}

		return Math.round(
			((currentQuestionIndex.value + 1) / totalQuestionCount.value) * 100,
		);
	});

	// --- Final score, used for both the results number and the rank below. ---
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

	// --- Rank shown on the results card, by score band. ---
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

	// --- 82% is the cutoff that swaps in the glowing high-score card. ---
	const quizHighScoreAchieved = computed(() => quizScorePercentage.value >= 82);

	// --- Questions in the bank that this session has not served yet. ---
	const remainingQuestions = computed(() => {
		const bankQuestions = quiz.value?.questions ?? [];

		return bankQuestions.filter(
			(question) => !servedQuestionIds.value.includes(question.id),
		);
	});

	// --- How many tiers it takes to clear the whole bank at this deck size. ---
	const quizTotalTierCount = computed(() => {
		const bankSize = quiz.value?.questions.length ?? 0;

		return Math.max(1, Math.ceil(bankSize / QUIZ_QUESTION_COUNT));
	});

	// ---
	// A clean sweep unlocks the next tier. Missing even one ends the run, so the reward
	// for a perfect tier is more questions rather than a saved score or an account.
	// ---
	const quizPerfectTier = computed(() => {
		return (
			totalQuestionCount.value > 0 &&
			correctAnswerCount.value === totalQuestionCount.value
		);
	});

	const canContinueToNextTier = computed(() => {
		return quizPerfectTier.value && remainingQuestions.value.length > 0;
	});

	// ---
	// Tier progress as MeterGroup segments: one per tier, equal width. Cleared tiers burn
	// cyan, the tier in play is dimmer, and untouched tiers sit near-transparent. Colors are
	// passed as data because MeterGroup paints its own segments from this array.
	// ---
	const quizTierMeterSegments = computed(() => {
		const tierCount = quizTotalTierCount.value;
		const segmentValue = 100 / tierCount;

		return Array.from({ length: tierCount }, (_unusedTier, tierIndex) => {
			const tierNumber = tierIndex + 1;
			const segmentColor =
				tierNumber < quizTierNumber.value
					? 'rgba(103, 232, 249, 0.92)'
					: tierNumber === quizTierNumber.value
						? 'rgba(103, 232, 249, 0.42)'
						: 'rgba(255, 255, 255, 0.10)';

			return {
				label: `Tier ${tierNumber}`,
				value: segmentValue,
				color: segmentColor,
			};
		});
	});

	const quizBankCleared = computed(() => {
		return quizPerfectTier.value && remainingQuestions.value.length === 0;
	});

	const quizResultMessage = computed(() => {
		return quizHighScoreAchieved.value
			? 'Civic command confirmed. You know the rules authoritarians hope people skip.'
			: 'Keep sharpening the fundamentals. The Constitution works better when voters know where power is supposed to stop.';
	});

	// --- Tag above the question: a prompt before answering, a verdict after. ---
	const quizStatusTagValue = computed(() => {
		if (!currentQuestionAnswered.value) {
			return 'Choose One';
		}

		return selectedAnswerCorrect.value ? 'Correct' : 'Review';
	});

	// --- Tag color follows that verdict. ---
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

	// --- Feedback heading goes green on a right answer, rose on a wrong one. ---
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

	// --- Cancels a pending auto-advance so timers never stack or fire after teardown. ---
	const clearQuizAdvanceTimeout = () => {
		if (quizAdvanceTimeoutId !== undefined) {
			window.clearTimeout(quizAdvanceTimeoutId);
			quizAdvanceTimeoutId = undefined;
		}
	};

	// --- Clears the selection so the next question starts unanswered. ---
	const resetCurrentQuestion = () => {
		selectedOptionId.value = undefined;
		currentQuestionAnswered.value = false;
	};

	// --- Fisher-Yates over a copy; used for both the question deck and each question's options. ---
	const getShuffledItems = <TItem>(items: Array<TItem>): Array<TItem> => {
		const shuffledItems = [...items];

		for (
			let currentIndex = shuffledItems.length - 1;
			currentIndex > 0;
			currentIndex -= 1
		) {
			const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
			const currentItem = shuffledItems[currentIndex];

			shuffledItems[currentIndex] = shuffledItems[randomIndex];
			shuffledItems[randomIndex] = currentItem;
		}

		return shuffledItems;
	};

	// ---
	// Options are shuffled per question, not just the deck. Authored data drifts toward
	// putting the correct answer in the same slot, which lets people pattern-match the
	// position instead of the civics. Shuffling here makes slot position meaningless for
	// every question, including ones added later. `correctOptionId` still matches on the
	// stored id, so order carries no meaning; the displayed a/b/c/d marker comes from the
	// rendered index instead.
	// ---
	const getQuizQuestionDeck = (questions: Array<QuizQuestion>) => {
		const questionDeck = getShuffledItems(questions)
			.slice(0, QUIZ_QUESTION_COUNT)
			.map((question) => ({
				...question,
				options: getShuffledItems(question.options),
			}));

		servedQuestionIds.value = [
			...servedQuestionIds.value,
			...questionDeck.map((question) => question.id),
		];

		return questionDeck;
	};

	// --- Clears one tier's progress but keeps the session's served-question history. ---
	const resetQuizRound = () => {
		clearQuizAdvanceTimeout();
		quizCompleted.value = false;
		currentQuestionIndex.value = 0;
		correctAnswerCount.value = 0;
		questionCardKey.value = 0;
		activeQuizQuestions.value = [];
		resetCurrentQuestion();
	};

	// --- Full reset back to the start screen, tier history included. ---
	const resetQuizState = () => {
		resetQuizRound();
		quizStarted.value = false;
		servedQuestionIds.value = [];
		quizTierNumber.value = 1;
	};

	// --- Fetches the question bank once per instance; later calls are no-ops. ---
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

	// --- Builds a fresh deck and enters the question flow. ---
	const startQuiz = async () => {
		await loadQuiz();

		if (!quiz.value) {
			return;
		}

		resetQuizState();
		activeQuizQuestions.value = getQuizQuestionDeck(quiz.value.questions);
		quizStarted.value = true;
	};

	// --- Serves the next tier from questions this session has not shown yet. ---
	const continueToNextTier = () => {
		if (!canContinueToNextTier.value) {
			return;
		}

		const nextTierQuestions = remainingQuestions.value;

		resetQuizRound();
		quizTierNumber.value += 1;
		activeQuizQuestions.value = getQuizQuestionDeck(nextTierQuestions);
	};

	// --- Advances one question, or finishes the run on the last one. ---
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

	// ---
	// Locks in the answer, scores it, and schedules the auto-advance. A right answer
	// moves on quickly; a wrong one holds longer so the explanation can be read.
	// ---
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

		quizAdvanceTimeoutId = window.setTimeout(moveToNextQuestion, 2500);
	};

	// --- Per-option styling: neutral until answered, then correct, wrong, or dimmed. ---
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

	// --- Every presentation class comes from the style composable, keyed to the shell variant. ---
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
		quizQuestionHeaderActionsStyleClasses,
		quizRestartButtonStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizTierMeterStyleClasses,
		quizQuestionCardContentStyleClasses,
		quizQuestionTitleStyleClasses,
		quizAnswerOptionsGridStyleClasses,
		quizAnswerOptionMarkerStyleClasses,
		quizAnswerOptionLabelStyleClasses,
		quizFeedbackStyleClasses,
		quizFeedbackCopyStyleClasses,
		quizNextButtonStyleClasses,
	} = UseGovernmentChecksBalancesQuizStyleComposable(variant);

	// --- Preload when the quiz becomes visible; reset when it closes so reopening starts clean. ---
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

	// --- Never leave a timer running after the component is gone. ---
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
		quizTierNumber,
		quizTotalTierCount,
		quizTierMeterSegments,
		canContinueToNextTier,
		quizBankCleared,
		startQuiz,
		resetQuizState,
		continueToNextTier,
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
		quizQuestionHeaderActionsStyleClasses,
		quizRestartButtonStyleClasses,
		quizQuestionCounterStyleClasses,
		quizProgressBarStyleClasses,
		quizTierMeterStyleClasses,
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
