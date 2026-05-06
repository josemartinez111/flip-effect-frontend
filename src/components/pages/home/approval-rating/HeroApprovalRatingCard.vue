<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > HOME > APPROVAL_RATING
    > HERO_APPROVAL_RATING_CARD.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import Card from 'primevue/card';
import { twMerge } from 'tailwind-merge';
import {
	ApprovalRatingCardBG,
	TrumanAvatar,
	TrumpAvatar,
} from '../../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const cardContainerStyleClasses = twMerge(
	clsx(
		'relative mx-auto h-[28rem] w-[min(98vw,100rem)] overflow-hidden',
		'rounded-[1.6rem] border-none bg-white/20',
		'backdrop-blur-sm',
		'tablet:h-[34rem] laptop:h-[40rem]',
		'dark:bg-slate-950/25',
	),
);

const cardBgImageStyleClasses = twMerge(
	clsx(
		'absolute inset-0 h-full w-full object-fill',
		'saturate-[0.96] contrast-[1.02] brightness-[1.08]',
		'dark:brightness-[1.14] dark:saturate-[0.9] dark:contrast-[0.95]',
	),
);

const cardBodyStyleClasses = twMerge(
	clsx('relative z-10 h-full p-0'),
);

const cardContentStyleClasses = twMerge(
	clsx('relative h-full p-0'),
);

const cardSlotLayerStyleClasses = twMerge(
	clsx('relative z-10 h-full'),
);

const cardHeaderStyleClasses = twMerge(
	clsx(
		'absolute inset-x-0 top-2 z-30 text-center',
		'bg-gradient-to-r from-flipeffect-sky via-flipeffect-cyan to-flipeffect-effect',
		'bg-clip-text font-orbitron text-xl font-black tracking-normal text-transparent',
		'drop-shadow-[0_3px_8px_rgba(14,165,233,0.7)]',
		'tablet:text-3xl laptop:text-4xl',
	),
);

const cardExplanationStyleClasses = twMerge(
	clsx(
		'absolute bottom-16 left-[16%] z-30 text-left',
		'text-sm font-bold leading-6 text-slate-200/88',
		'drop-shadow-[0_2px_6px_rgba(15,23,42,0.58)]',
		'tablet:bottom-20 tablet:text-base laptop:text-lg',
		'dark:text-slate-300/70 dark:drop-shadow-[0_2px_7px_rgba(0,0,0,0.7)]',
	),
);

const presidentNameStyleClasses = twMerge(
	clsx(
		'absolute top-[18%] z-30 -translate-x-1/2 text-center',
		'bg-gradient-to-r from-flipeffect-presidential-white via-flipeffect-presidential-silver to-flipeffect-presidential-charcoal',
		'bg-clip-text font-orbitron text-base font-black text-transparent',
		'drop-shadow-[0_3px_8px_rgba(15,23,42,0.5)]',
		'tablet:text-2xl laptop:text-3xl',
	),
);

const trumanNameStyleClasses = twMerge(
	clsx(presidentNameStyleClasses, 'left-[calc(21%+min(10vw,11.5rem))]'),
);

const trumpNameStyleClasses = twMerge(
	clsx(presidentNameStyleClasses, 'right-[calc(21%+min(10vw,11.5rem))] translate-x-1/2'),
);

const trumanPercentageStyleClasses = twMerge(
	clsx(
		'absolute left-[calc(22%+min(10vw,11.5rem))] top-[57%] z-30 -translate-x-1/2',
		'bg-gradient-to-b from-flipeffect-truman-gold via-flipeffect-truman-amber to-flipeffect-truman-bronze',
		'bg-clip-text font-[Impact] text-4xl leading-none text-transparent',
		'drop-shadow-[0_5px_12px_rgba(245,158,11,0.55)]',
		'tablet:text-5xl laptop:text-6xl',
	),
);

const trumpPercentageStyleClasses = twMerge(
	clsx(
		'absolute right-[calc(19%+min(10vw,11.5rem))] top-[57%] z-30 translate-x-1/2',
		'bg-gradient-to-b from-flipeffect-rose-bright via-flipeffect-flip to-flipeffect-rose',
		'bg-clip-text font-[Impact] text-4xl leading-none text-transparent',
		'drop-shadow-[0_5px_12px_rgba(225,29,72,0.58)]',
		'tablet:text-5xl laptop:text-6xl',
	),
);

const avatarImageStyleClasses = twMerge(
	clsx(
		'absolute top-[39%] z-20 w-[min(30vw,17rem)] -translate-y-1/2',
		'object-contain tablet:w-[min(24vw,20rem)] laptop:w-[min(20vw,23rem)]',
	),
);

const trumanAvatarStyleClasses = twMerge(
	clsx(avatarImageStyleClasses, 'left-[21%]'),
);

const trumpAvatarStyleClasses = twMerge(
	clsx(avatarImageStyleClasses, 'right-[21%]'),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<Card
		unstyled
		:class="cardContainerStyleClasses"
		:pt="{
			body: { class: cardBodyStyleClasses },
			content: { class: cardContentStyleClasses },
		}"
	>
		<template #content>
			<img
				:src="ApprovalRatingCardBG"
				alt=""
				:class="cardBgImageStyleClasses"
			/>

			<div :class="cardSlotLayerStyleClasses">
				<h2 :class="cardHeaderStyleClasses">Approval Rating</h2>
				<div :class="trumanNameStyleClasses">Harry Truman</div>
				<div :class="trumpNameStyleClasses">Donald Trump</div>
				<img
					:src="TrumanAvatar"
					alt="Harry Truman"
					:class="trumanAvatarStyleClasses"
				/>
				<img
					:src="TrumpAvatar"
					alt="Trump"
					:class="trumpAvatarStyleClasses"
				/>
				<div :class="trumanPercentageStyleClasses">22%</div>
				<div :class="trumpPercentageStyleClasses">40%</div>
				<p :class="cardExplanationStyleClasses">
					Truman's 22% approval rating reflects his lowest recorded approval
					<br />
					(1952, Gallup). Trump's approval rating reflects current aggregated polling.
				</p>
				<slot />
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
