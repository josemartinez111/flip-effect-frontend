<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
         COMPONENTS: PAGES > HOME > MIDTERMS_COUNTDOWN_SECTION.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { type CountdownTimeLeft, formatCountdownUnit } from '../../../lib';
import { UseHomeComposable } from '../../../pages/home/UseHomeComposable.ts';
import Card from 'primevue/card';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type MidtermsCountdownSectionProps = {
	midtermsCountdown: CountdownTimeLeft;
	midtermsDateLabel: string;
};

defineProps<MidtermsCountdownSectionProps>();

const {
	countdownCardStyleClasses,
	countdownCardBodyStyleClasses,
	countdownCardContentStyleClasses,
	countdownEyebrowStyleClasses,
	countdownDaysValueStyleClasses,
	countdownDaysLabelStyleClasses,
	countdownTimeGridStyleClasses,
	countdownTimeValueStyleClasses,
	countdownTimeLabelStyleClasses,
	countdownDateLabelStyleClasses,
} = UseHomeComposable();
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Card
		unstyled
		:class="countdownCardStyleClasses"
		:pt="{
			body: { class: countdownCardBodyStyleClasses },
			content: { class: countdownCardContentStyleClasses },
		}"
	>
		<template #content>
			<div :class="countdownEyebrowStyleClasses">2026 Midterms</div>

			<div :class="countdownDaysValueStyleClasses">
				{{ midtermsCountdown.days }}
			</div>

			<div :class="countdownDaysLabelStyleClasses">
				{{ midtermsCountdown.days === 1 ? 'Day' : 'Days' }}
			</div>

			<div :class="countdownTimeGridStyleClasses">
				<div>
					<span :class="countdownTimeValueStyleClasses">
						{{ formatCountdownUnit(midtermsCountdown.hours) }}
					</span>
					<span :class="countdownTimeLabelStyleClasses">Hrs</span>
				</div>

				<div>
					<span :class="countdownTimeValueStyleClasses">
						{{ formatCountdownUnit(midtermsCountdown.minutes) }}
					</span>
					<span :class="countdownTimeLabelStyleClasses">Min</span>
				</div>

				<div>
					<span :class="countdownTimeValueStyleClasses">
						{{ formatCountdownUnit(midtermsCountdown.seconds) }}
					</span>
					<span :class="countdownTimeLabelStyleClasses">Sec</span>
				</div>
			</div>

			<div :class="countdownDateLabelStyleClasses">
				{{ midtermsDateLabel }}
			</div>
		</template>
	</Card>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
