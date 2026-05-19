// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
//     LIB > COMPOSABLES > USE_ANIMATED_PERCENTAGE_COMPOSABLE.TS
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
import { ref, toValue, type MaybeRefOrGetter } from 'vue';
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

type AnimatedPercentageEasing =
	| 'linear'
	| 'easeInOutSine'
	| 'easeOutCubic'
	| 'easeInQuart';

type AnimatedPercentageStep = {
	fromPercentage: number;
	toPercentage: number;
	delayMs: number;
	durationMs: number;
	easing?: AnimatedPercentageEasing;
};

type UseAnimatedPercentageComposableProps = {
	initialPercentage: number;
	targetPercentage: MaybeRefOrGetter<number>;
	getPercentageAnimationSteps: (
		targetPercentage: number,
	) => Array<AnimatedPercentageStep>;
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
// --- Usage ---
// const liveApprovalRatingPercentage = ref(36);
//
// const {
// 	animatedPercentage,
// 	startAnimatedPercentage,
// 	stopAnimatedPercentage,
// } = UseAnimatedPercentageComposable({
// 	initialPercentage: 100,
// 	targetPercentage: liveApprovalRatingPercentage,
// 	getPercentageAnimationSteps: (targetPercentage) => [
// 		{
// 			fromPercentage: 100,
// 			toPercentage: 90,
// 			delayMs: 300,
// 			durationMs: 1100,
// 			easing: 'easeInOutSine',
// 		},
// 		{
// 			fromPercentage: 90,
// 			toPercentage: targetPercentage,
// 			delayMs: 1500,
// 			durationMs: 1200,
// 			easing: 'easeInQuart',
// 		},
// 	],
// });
//
// --- Future API usage ---
// liveApprovalRatingPercentage.value = apiApprovalRatingPercentage;
// startAnimatedPercentage();
// stopAnimatedPercentage();
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --

const easingActions: Record<
	AnimatedPercentageEasing,
	(progress: number) => number
> = {
	linear: (progress) => progress,
	easeInOutSine: (progress) => {
		return -(Math.cos(Math.PI * progress) - 1) / 2;
	},
	easeOutCubic: (progress) => {
		return 1 - Math.pow(1 - progress, 3);
	},
	easeInQuart: (progress) => {
		return progress ** 4;
	},
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
export const UseAnimatedPercentageComposable = ({
	initialPercentage,
	targetPercentage,
	getPercentageAnimationSteps,
}: UseAnimatedPercentageComposableProps) => {
	const animatedPercentage = ref(initialPercentage);
	const animatedPercentageAnimating = ref(false);
	const animatedPercentageTimeoutIds: number[] = [];
	let animatedPercentageAnimationFrameId: number | undefined;

	const stopAnimatedPercentage = () => {
		if (animatedPercentageAnimationFrameId !== undefined) {
			window.cancelAnimationFrame(animatedPercentageAnimationFrameId);
			animatedPercentageAnimationFrameId = undefined;
		}

		animatedPercentageTimeoutIds.forEach((timeoutId) => {
			window.clearTimeout(timeoutId);
		});

		animatedPercentageTimeoutIds.length = 0;
		animatedPercentageAnimating.value = false;
	};

	const animatePercentageStep = ({
		fromPercentage,
		toPercentage,
		durationMs,
		easing = 'linear',
	}: AnimatedPercentageStep) => {
		const startedAt = performance.now();
		const easingAction = easingActions[easing];

		const tick = (currentTime: number) => {
			const elapsedMs = currentTime - startedAt;
			const progress = Math.min(elapsedMs / durationMs, 1);
			const easedProgress = easingAction(progress);

			animatedPercentage.value = Math.round(
				fromPercentage + (toPercentage - fromPercentage) * easedProgress,
			);

			if (progress < 1) {
				animatedPercentageAnimationFrameId =
					window.requestAnimationFrame(tick);
				return;
			}

			animatedPercentage.value = toPercentage;
			animatedPercentageAnimationFrameId = undefined;
		};

		animatedPercentageAnimationFrameId = window.requestAnimationFrame(tick);
	};

	const startAnimatedPercentage = () => {
		stopAnimatedPercentage();
		animatedPercentage.value = initialPercentage;
		animatedPercentageAnimating.value = true;

		const percentageAnimationSteps = getPercentageAnimationSteps(
			toValue(targetPercentage),
		);
		const finalStep = percentageAnimationSteps.at(-1);

		percentageAnimationSteps.forEach((percentageAnimationStep) => {
			const timeoutId = window.setTimeout(() => {
				animatePercentageStep(percentageAnimationStep);

				if (percentageAnimationStep === finalStep) {
					const animationDoneTimeoutId = window.setTimeout(() => {
						animatedPercentageAnimating.value = false;
					}, percentageAnimationStep.durationMs);

					animatedPercentageTimeoutIds.push(animationDoneTimeoutId);
				}
			}, percentageAnimationStep.delayMs);

			animatedPercentageTimeoutIds.push(timeoutId);
		});
	};

	return {
		animatedPercentage,
		animatedPercentageAnimating,
		startAnimatedPercentage,
		stopAnimatedPercentage,
	};
};
// -- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ --
