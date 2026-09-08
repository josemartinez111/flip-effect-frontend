<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > GOVERNMENT_CHECKS_BALANCES_QUIZ.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import Button from 'primevue/button';
import Card from 'primevue/card';
import MeterGroup from 'primevue/metergroup';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { UseGovernmentChecksBalancesQuizComposable } from '../../pages-composables/UseGovernmentChecksBalancesQuizComposable.ts';
import type { GovernmentChecksBalancesQuizVariant } from '../../pages-composables/UseGovernmentChecksBalancesQuizStyleComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// --- `active` gates loading and resets; `variant` picks the modal or full-page shell. ---
type GovernmentChecksBalancesQuizProps = {
	active?: boolean;
	variant?: GovernmentChecksBalancesQuizVariant;
};

const { active = false, variant = 'modal' } =
	defineProps<GovernmentChecksBalancesQuizProps>();

// --- All state and styling live in the composable. This file only renders three screens. ---
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
} = UseGovernmentChecksBalancesQuizComposable({
	// --- Destructured props stay reactive only when read inside a getter, so the composable gets one. ---
	active: () => active,
	// --- The shell never changes after mount, so the style classes are built once from a plain value. ---
	variant,
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
							{{ quizBankCleared
								? 'Every question in the bank answered correctly. There is nothing left to ask you.'
								: quizResultMessage }}
						</p>

						<!-- ∞∞∞∞∞∞∞∞
							A clean sweep unlocks the next tier of unseen questions.
							Miss one and the run ends, so the only way deeper is a
							perfect tier.
						∞∞∞∞∞∞∞∞ -->
						<Button
							v-if="canContinueToNextTier"
							:class="quizPrimaryButtonStyleClasses"
							:label="`Continue to Tier ${quizTierNumber + 1}`"
							type="button"
							@click="continueToNextTier"
						/>

						<Button
							:class="quizPrimaryButtonStyleClasses"
							:label="canContinueToNextTier ? 'Start Over' : 'Restart Quiz'"
							type="button"
							@click="resetQuizState"
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
					<span v-if="quizTierNumber > 1">
						Tier {{ quizTierNumber }} / {{ quizTotalTierCount }} &middot;
					</span>
					Question {{ currentQuestionIndex + 1 }} /
					{{ totalQuestionCount }}
				</div>

				<div :class="quizQuestionHeaderActionsStyleClasses">
					<Tag
						:value="quizStatusTagValue"
						:class="quizStatusTagStyleClasses"
					/>

					<!-- ∞∞∞∞∞∞∞∞
						Mid-run restart. Drops tier history too, so it is a true
						start-over rather than a re-roll of the current tier.
					∞∞∞∞∞∞∞∞ -->
					<Button
						:class="quizRestartButtonStyleClasses"
						label="Restart"
						type="button"
						@click="resetQuizState"
					/>
				</div>
			</div>

			<ProgressBar
				:value="quizProgressPercentage"
				:class="quizProgressBarStyleClasses"
				:show-value="false"
			/>

			<!-- ∞∞∞∞∞∞∞∞
				One segment per tier. Cleared tiers burn bright, the tier in play
				is dimmer, untouched tiers stay near-transparent. Default labels
				are suppressed since the header already names the tier.
			∞∞∞∞∞∞∞∞ -->
			<MeterGroup
				v-if="quizTotalTierCount > 1"
				:value="quizTierMeterSegments"
				:class="quizTierMeterStyleClasses"
			>
				<template #label></template>
			</MeterGroup>

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
									v-for="(option, optionIndex) in currentQuestion.options"
									:key="option.id"
									type="button"
									:class="getAnswerOptionStyleClasses(option)"
									:disabled="currentQuestionAnswered"
									@click="selectAnswerOption(option)"
								>
									<!-- ∞∞∞∞∞∞∞∞
										Options are shuffled, so the stored id no longer
										matches its position. The marker comes from the
										rendered index to keep the column reading a, b, c, d.
									∞∞∞∞∞∞∞∞ -->
									<span
										:class="quizAnswerOptionMarkerStyleClasses"
									>
										{{ String.fromCharCode(97 + optionIndex) }}
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
