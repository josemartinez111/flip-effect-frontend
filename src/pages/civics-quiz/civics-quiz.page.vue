<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
PAGES: CIVICS-QUIZ > CIVICS_QUIZ.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { FWTScrollAnimation } from '../../components';
import GovernmentChecksBalancesQuiz from '../../components/pages/home/approval-rating/GovernmentChecksBalancesQuiz.vue';
import { UseCivicsQuizPageComposable } from '../../components/pages/civics-quiz/civics-quiz-page-composables/UseCivicsQuizPageComposable.ts';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	civicsQuizEyebrow,
	civicsQuizTitle,
	civicsQuizLead,
	civicsQuizStats,
	civicsQuizSectionShellStyleClasses,
	civicsQuizIntroShellStyleClasses,
	civicsQuizIntroLayoutStyleClasses,
	civicsQuizIntroCopyStyleClasses,
	civicsQuizEyebrowStyleClasses,
	civicsQuizTitleStyleClasses,
	civicsQuizLeadStyleClasses,
	civicsQuizStatGridStyleClasses,
	civicsQuizStatTileStyleClasses,
	civicsQuizStatValueStyleClasses,
	civicsQuizStatLabelStyleClasses,
} = UseCivicsQuizPageComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main class="relative min-h-screen bg-transparent text-slate-950">
		<FWTScrollAnimation direction="up" :distance="42" :duration-ms="900">
			<div :class="civicsQuizSectionShellStyleClasses">
				<!-- ∞∞∞∞∞∞∞∞ CIVICS QUIZ: PAGE INTRO ∞∞∞∞∞∞∞∞ -->
				<header :class="civicsQuizIntroShellStyleClasses">
					<div :class="civicsQuizIntroLayoutStyleClasses">
						<div :class="civicsQuizIntroCopyStyleClasses">
							<p :class="civicsQuizEyebrowStyleClasses">
								{{ civicsQuizEyebrow }}
							</p>

							<h1 :class="civicsQuizTitleStyleClasses">
								{{ civicsQuizTitle }}
							</h1>

							<p :class="civicsQuizLeadStyleClasses">
								{{ civicsQuizLead }}
							</p>
						</div>

						<!-- ∞∞∞∞∞∞∞∞ CIVICS QUIZ: INTRO STAT TILES ∞∞∞∞∞∞∞∞ -->
						<div :class="civicsQuizStatGridStyleClasses">
							<div
								v-for="stat in civicsQuizStats"
								:key="stat.label"
								:class="civicsQuizStatTileStyleClasses"
							>
								<span :class="civicsQuizStatValueStyleClasses">
									{{ stat.value }}
								</span>

								<span :class="civicsQuizStatLabelStyleClasses">
									{{ stat.label }}
								</span>
							</div>
						</div>
					</div>
				</header>

				<!-- ∞∞∞∞∞∞∞∞ CIVICS QUIZ ∞∞∞∞∞∞∞∞ -->
				<GovernmentChecksBalancesQuiz active variant="page" />
			</div>
		</FWTScrollAnimation>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
