<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > GOVERNMENT_CHECKS_BALANCES_QUIZ.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { UseGovernmentChecksBalancesQuizComposable } from '../../pages-composables/UseGovernmentChecksBalancesQuizComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type GovernmentChecksBalancesQuizProps = {
	active?: boolean;
};

const props = withDefaults(
	defineProps<GovernmentChecksBalancesQuizProps>(),
	{
		active: false,
	},
);

const {
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
} = UseGovernmentChecksBalancesQuizComposable({
	active: () => props.active,
});
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                 </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div :class="quizRootStyleClasses">
		<!-- ∞∞∞∞∞∞∞∞ QUIZ: START SCREEN ∞∞∞∞∞∞∞∞ -->
		<div v-if="!quizStarted" :class="quizIntroContainerStyleClasses">
			<div :class="quizEyebrowStyleClasses">
				Ready Check
			</div>

			<h2 :class="quizTitleStyleClasses">
				Government Checks & Balances Quiz
			</h2>

			<p :class="quizLeadStyleClasses">
				Test your command of Congress, the courts, presidential power, and
				the rules that keep no branch above the Constitution.
			</p>

			<p
				v-if="quizLoadMessage"
				:class="quizLoadMessageStyleClasses"
			>
				{{ quizLoadMessage }}
			</p>

			<Button
				:loading="quizLoading"
				:class="quizPrimaryButtonStyleClasses"
				label="Start Quiz"
				type="button"
				@click="startQuiz"
			/>
		</div>

		<!-- ∞∞∞∞∞∞∞∞ QUIZ: RESULTS SCREEN ∞∞∞∞∞∞∞∞ -->
		<div v-else-if="quizCompleted" :class="quizResultsContainerStyleClasses">
			<Card
				unstyled
				:class="
					quizHighScoreAchieved
						? quizHighScoreCardStyleClasses
						: quizResultsCardStyleClasses
				"
				:pt="quizCardPassThrough"
			>
				<template #content>
					<div :class="quizResultsContentStyleClasses">
						<Tag
							:class="
								quizHighScoreAchieved
									? quizHighScoreTagStyleClasses
									: quizResultsTagStyleClasses
							"
							:value="quizHighScoreAchieved ? 'High Score' : 'Results'"
						/>

						<!-- ∞∞∞∞∞∞∞∞ QUIZ: HIGH SCORE SIGNAL ∞∞∞∞∞∞∞∞ -->
						<div
							v-if="quizHighScoreAchieved"
							:class="quizHighScoreSignalGridStyleClasses"
						>
							<span :class="quizHighScoreSignalStyleClasses"></span>
							<span :class="quizHighScoreSignalStyleClasses"></span>
							<span :class="quizHighScoreSignalStyleClasses"></span>
						</div>

						<div
							:class="
								quizHighScoreAchieved
									? quizHighScoreValueStyleClasses
									: quizScoreValueStyleClasses
							"
						>
							{{ quizScorePercentage }}%
						</div>

						<h3 :class="quizScoreLabelStyleClasses">
							{{ quizScoreLabel }}
						</h3>

						<p :class="quizScoreSummaryStyleClasses">
							{{ correctAnswerCount }} correct out of
							{{ totalQuestionCount }} questions.
						</p>

						<p :class="quizScoreSummaryStyleClasses">
							{{ quizResultMessage }}
						</p>

						<Button
							:class="quizPrimaryButtonStyleClasses"
							label="Restart Quiz"
							type="button"
							@click="startQuiz"
						/>
					</div>
				</template>
			</Card>
		</div>

		<!-- ∞∞∞∞∞∞∞∞ QUIZ: QUESTION SCREEN ∞∞∞∞∞∞∞∞ -->
		<div v-else :class="quizQuestionContainerStyleClasses">
			<!-- ∞∞∞∞∞∞∞∞ QUIZ: QUESTION HEADER ∞∞∞∞∞∞∞∞ -->
			<div :class="quizQuestionHeaderStyleClasses">
				<div :class="quizQuestionCounterStyleClasses">
					Question {{ currentQuestionIndex + 1 }} /
					{{ totalQuestionCount }}
				</div>

				<Tag
					:value="quizStatusTagValue"
					:class="quizStatusTagStyleClasses"
				/>
			</div>

			<ProgressBar
				:value="quizProgressPercentage"
				:class="quizProgressBarStyleClasses"
				:show-value="false"
			/>

			<!-- ∞∞∞∞∞∞∞∞ QUIZ: QUESTION CARD ∞∞∞∞∞∞∞∞ -->
			<Transition
				mode="out-in"
				:enter-active-class="quizCardTransitionActiveStyleClasses"
				:leave-active-class="quizCardTransitionActiveStyleClasses"
				:enter-from-class="quizCardTransitionEnterFromStyleClasses"
				:enter-to-class="quizCardTransitionDefaultStyleClasses"
				:leave-from-class="quizCardTransitionDefaultStyleClasses"
				:leave-to-class="quizCardTransitionLeaveToStyleClasses"
			>
				<Card
					v-if="currentQuestion"
					:key="questionCardKey"
					unstyled
					:class="quizCardStyleClasses"
					:pt="quizCardPassThrough"
				>
					<template #content>
						<div :class="quizQuestionCardContentStyleClasses">
							<h3 :class="quizQuestionTitleStyleClasses">
								{{ currentQuestion.question }}
							</h3>

							<!-- ∞∞∞∞∞∞∞∞ QUIZ: ANSWER OPTIONS ∞∞∞∞∞∞∞∞ -->
							<div :class="quizAnswerOptionsGridStyleClasses">
								<button
									v-for="option in currentQuestion.options"
									:key="option.id"
									type="button"
									:class="getAnswerOptionStyleClasses(option)"
									:disabled="currentQuestionAnswered"
									@click="selectAnswerOption(option)"
								>
									<span
										:class="quizAnswerOptionMarkerStyleClasses"
									>
										{{ option.id }}
									</span>
									<span :class="quizAnswerOptionLabelStyleClasses">
										{{ option.label }}
									</span>
								</button>
							</div>

							<!-- ∞∞∞∞∞∞∞∞ QUIZ: ANSWER FEEDBACK ∞∞∞∞∞∞∞∞ -->
							<div
								v-if="currentQuestionAnswered"
								:class="quizFeedbackStyleClasses"
							>
								<div :class="quizFeedbackTitleStyleClasses">
									{{
										selectedAnswerCorrect
											? 'Correct'
											: 'Correct Answer Highlighted'
									}}
								</div>

								<p
									:class="quizFeedbackCopyStyleClasses"
								>
									{{
										selectedAnswerCorrect
											? currentQuestion.explanation
											: currentQuestion.incorrectExplanation
									}}
								</p>

								<Button
									v-if="!selectedAnswerCorrect"
									:class="quizNextButtonStyleClasses"
									label="Next Question"
									type="button"
									@click="moveToNextQuestion"
								/>
							</div>
						</div>
					</template>
				</Card>
			</Transition>
		</div>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
