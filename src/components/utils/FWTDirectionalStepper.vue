<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: UTILS
    > FWT_DIRECTIONAL_STEPPER.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import FWTDirectionalStepperArrowIcon from './FWTDirectionalStepperArrowIcon.vue';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type FWTDirectionalStepperProps = {
	previousAriaLabel?: string;
	nextAriaLabel?: string;
	previousDisabled?: boolean;
	nextDisabled?: boolean;
};

type FWTDirectionalStepperEmits = (eventName: 'previous' | 'next') => void;

const {
	previousAriaLabel = 'Go to previous item',
	nextAriaLabel = 'Go to next item',
	previousDisabled = false,
	nextDisabled = false,
} = defineProps<FWTDirectionalStepperProps>();

const emit = defineEmits<FWTDirectionalStepperEmits>();

const UseFWTDirectionalStepperStyleComposable = () => {
	const rootStyleClasses = twMerge(
		clsx(
			'group/stepper relative flex h-64 w-64',
			'items-center justify-center overflow-visible',
		),
	);

	const touchZoneBaseStyleClasses = twMerge(
		clsx(
			'absolute top-0 z-30 h-full w-1/2',
			'cursor-pointer border-0 bg-transparent p-0',
			'disabled:cursor-not-allowed disabled:opacity-40',
		),
	);

	const previousTouchZoneStyleClasses = twMerge(
		clsx(
			touchZoneBaseStyleClasses,
			'fwt-directional-previous-touch left-0',
		),
	);

	const nextTouchZoneStyleClasses = twMerge(
		clsx(touchZoneBaseStyleClasses, 'fwt-directional-next-touch right-0'),
	);

	const containerStyleClasses = twMerge(clsx('relative z-10'));

	const outerRingStyleClasses = twMerge(
		clsx(
			'flex h-50 w-50 items-center',
			'justify-center rounded-full',
			'bg-[linear-gradient(0deg,#f5f8fa,#9da4a8)]',
		),
	);

	const handleStyleClasses = twMerge(
		clsx(
			'flex h-38.75 w-38.75 items-center',
			'justify-center rounded-full bg-[#c5d1da]',
			'shadow-[0_0_10px_rgba(0,0,0,0.5),0_10px_10px_rgba(0,0,0,0.2),inset_0_0_16px_rgba(0,0,0,0.85),inset_0_0_24px_rgba(0,0,0,0.75),inset_0_0_48px_rgba(0,0,0,0.2)]',
			'[perspective:300px]',
		),
	);

	const buttonWrapperStyleClasses = twMerge(
		clsx(
			'flex h-25.5 w-25.5',
			'items-center justify-center rounded-full transition',
			'duration-300 ease-out',
			'bg-[linear-gradient(0deg,#86969c,#eff1f1)]',
			'shadow-[0_9px_14px_rgba(0,0,0,0.5),0_19px_8px_-2px_rgba(0,0,0,0.2),0_33px_8px_rgba(0,0,0,0.4),0_-12px_10px_rgba(255,255,255,0.5),inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-3px_3px_rgba(89,91,92,0.6)]',
			'group-has-[.fwt-directional-previous-touch:hover]/stepper:[transform:translate(-5px,0)_rotateY(-8deg)]',
			'group-has-[.fwt-directional-previous-touch:hover]/stepper:[transform-style:preserve-3d]',
			'group-has-[.fwt-directional-previous-touch:hover]/stepper:shadow-[-2px_9px_14px_rgba(0,0,0,0.4),-2px_19px_8px_-2px_rgba(0,0,0,0.2),-2px_30px_8px_rgba(0,0,0,0.3),6px_-14px_10px_rgba(255,255,255,0.5),inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-3px_3px_rgba(89,91,92,0.6)]',
			'group-has-[.fwt-directional-next-touch:hover]/stepper:[transform:translate(5px,0)_rotateY(8deg)]',
			'group-has-[.fwt-directional-next-touch:hover]/stepper:[transform-style:preserve-3d]',
			'group-has-[.fwt-directional-next-touch:hover]/stepper:shadow-[2px_9px_14px_rgba(0,0,0,0.4),2px_19px_8px_-2px_rgba(0,0,0,0.2),2px_30px_8px_rgba(0,0,0,0.3),-6px_-14px_10px_rgba(255,255,255,0.5),inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-3px_3px_rgba(89,91,92,0.6)]',
		),
	);

	const insideStyleClasses = twMerge(
		clsx(
			'relative h-21.25 w-21.25 rounded-full',
			'bg-[linear-gradient(180deg,#adb9bf,#d4dbdd)]',
			'shadow-[inset_0_3px_6px_rgba(152,160,163,0.4),inset_0_-3px_6px_rgba(238,244,246,0.4)]',
		),
	);

	const dotBaseStyleClasses = twMerge(
		clsx(
			'absolute h-2 w-2 -translate-x-1/2',
			'-translate-y-1/2 rounded-full bg-[#e7ecef]',
			'shadow-[0_2px_2px_rgba(0,0,0,0.3),inset_0_-2px_2px_rgba(0,0,0,0.2)]',
		),
	);

	const dotStyleClasses: Array<string> = [
		twMerge(clsx(dotBaseStyleClasses, 'left-1/2 top-[10%]')),
		twMerge(clsx(dotBaseStyleClasses, 'left-[90%] top-1/2')),
		twMerge(clsx(dotBaseStyleClasses, 'left-1/2 top-[90%]')),
		twMerge(clsx(dotBaseStyleClasses, 'left-[10%] top-1/2')),
	];

	const arrowIconBaseStyleClasses = twMerge(
		clsx(
			'pointer-events-none absolute top-1/2 z-20',
			'w-9 -translate-y-1/2 fill-[#b4b9bd]',
			'[filter:drop-shadow(1px_1px_1px_#f4f4f4)]',
		),
	);

	const previousArrowIconStyleClasses = twMerge(
		clsx(
			arrowIconBaseStyleClasses,
			'left-[-18%]',
			'group-has-[.fwt-directional-previous-touch:hover]/stepper:fill-[#e3a560]',
			'group-has-[.fwt-directional-previous-touch:hover]/stepper:[filter:brightness(0.9)_drop-shadow(0_0_2px_#e3a15b)_drop-shadow(0_0_1px_#ffffff)]',
		),
	);

	const nextArrowIconStyleClasses = twMerge(
		clsx(
			arrowIconBaseStyleClasses,
			'right-[-18%]',
			'group-has-[.fwt-directional-next-touch:hover]/stepper:fill-[#e3a560]',
			'group-has-[.fwt-directional-next-touch:hover]/stepper:[filter:brightness(0.9)_drop-shadow(0_0_2px_#e3a15b)_drop-shadow(0_0_1px_#ffffff)]',
		),
	);

	return {
		rootStyleClasses,
		previousTouchZoneStyleClasses,
		nextTouchZoneStyleClasses,
		containerStyleClasses,
		outerRingStyleClasses,
		handleStyleClasses,
		buttonWrapperStyleClasses,
		insideStyleClasses,
		dotStyleClasses,
		previousArrowIconStyleClasses,
		nextArrowIconStyleClasses,
	};
};

const {
	rootStyleClasses,
	previousTouchZoneStyleClasses,
	nextTouchZoneStyleClasses,
	containerStyleClasses,
	outerRingStyleClasses,
	handleStyleClasses,
	buttonWrapperStyleClasses,
	insideStyleClasses,
	dotStyleClasses,
	previousArrowIconStyleClasses,
	nextArrowIconStyleClasses,
} = UseFWTDirectionalStepperStyleComposable();

const handlePreviousClick = () => {
	if (previousDisabled) {
		return;
	}

	emit('previous');
};

const handleNextClick = () => {
	if (nextDisabled) {
		return;
	}

	emit('next');
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                  </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section :class="rootStyleClasses" aria-label="Timeline navigation">
		<!-- STEPPER: TOUCH ZONES -->
		<button
			type="button"
			:class="previousTouchZoneStyleClasses"
			:aria-label="previousAriaLabel"
			:disabled="previousDisabled"
			@click="handlePreviousClick"
		></button>

		<button
			type="button"
			:class="nextTouchZoneStyleClasses"
			:aria-label="nextAriaLabel"
			:disabled="nextDisabled"
			@click="handleNextClick"
		></button>

		<!-- STEPPER: CONTROL BODY -->
		<div :class="containerStyleClasses">
			<div :class="outerRingStyleClasses">
				<div :class="handleStyleClasses">
					<div :class="buttonWrapperStyleClasses">
						<div :class="insideStyleClasses">
							<div
								v-for="dotStyleClass in dotStyleClasses"
								:key="dotStyleClass"
								:class="dotStyleClass"
							></div>
						</div>
					</div>
				</div>
			</div>

			<!-- STEPPER: ARROWS -->
			<FWTDirectionalStepperArrowIcon
				direction="previous"
				:class="previousArrowIconStyleClasses"
			/>

			<FWTDirectionalStepperArrowIcon
				direction="next"
				:class="nextArrowIconStyleClasses"
			/>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                    STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */
</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
