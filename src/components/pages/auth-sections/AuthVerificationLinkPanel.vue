<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > AUTH-SECTIONS
    > AUTH_VERIFICATION_LINK_PANEL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { CheckCircle2 } from '@lucide/vue';
import { twMerge } from 'tailwind-merge';
import type { VerificationLinkResultType } from '../../../api';
import { AuthLogoMark } from '../../../assets';
import { UseAuthVerificationLinkComposable } from './auth-page-composables/UseAuthVerificationLinkComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

type AuthVerificationLinkPanelProps = {
	headerText?: string;
	instructionText?: string;
	emailPlaceholder?: string;
	buttonText?: string;
	successTitle?: string;
	successMessage?: string;
	successInfo?: string;
	errorMessage?: string;
	footerLabel?: string;
	secondaryFooterLabel?: string;
	sendLinkCallback: (email: string) => Promise<VerificationLinkResultType>;
};

const {
	headerText = 'Admin Verification',
	instructionText = 'Enter your admin email to receive a secure link.',
	emailPlaceholder = 'you@email.com',
	buttonText = 'Send Link',
	successTitle = 'Link Sent',
	successMessage = 'Check your inbox for the secure link.',
	successInfo = 'This window is no longer needed.',
	errorMessage = 'An error occurred.',
	footerLabel = '',
	secondaryFooterLabel = '',
	sendLinkCallback,
} = defineProps<AuthVerificationLinkPanelProps>();

const emit = defineEmits<{
	footer: [];
	secondaryFooter: [];
	close: [];
}>();

const {
	email,
	status,
	message,
	handleInput,
	handleSendLink,
} = UseAuthVerificationLinkComposable({
	sendLinkCallback,
	successMessage,
	errorMessage,
});

const containerStyleClasses = twMerge(
	clsx(
		'flex min-h-[380px] w-full items-center justify-center py-8',
		'transition-all duration-200',
	),
);

const innerContainerStyleClasses = twMerge(
	clsx(
		'relative z-[74] mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl',
		'border border-gray-700 bg-gray-900 p-4 shadow-2xl backdrop-blur-sm',
		'transition-all duration-200 tablet:p-6 laptop:max-w-lg laptop:p-8',
	),
);

const inputStyleClasses = twMerge(
	clsx(
		'block w-full cursor-pointer rounded-lg border border-gray-600',
		'bg-gray-800 p-3 text-base text-gray-200 placeholder-gray-400',
		'outline-none focus:border-blue-500 tablet:p-3 laptop:p-4',
	),
);

const buttonStyleClasses = twMerge(
	clsx(
		'w-full cursor-pointer rounded-lg bg-orange-500 px-4 py-2',
		'text-base font-semibold text-white transition-colors hover:bg-orange-600',
		'active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<div :class="containerStyleClasses">
		<div :class="innerContainerStyleClasses">
			<img
				:src="AuthLogoMark"
				alt="Auth Logo"
				class="mx-auto mb-4 h-28 w-28 object-contain tablet:h-36 tablet:w-36 laptop:h-44 laptop:w-44"
			/>

			<div class="flex items-center justify-center">
				<h1 class="font-orbitron text-center text-2xl font-bold text-gray-100 tablet:text-3xl laptop:text-4xl">
					{{ headerText }}
				</h1>
			</div>

			<template v-if="status !== 'sent'">
				<p class="px-1 text-center text-sm text-gray-400">
					{{ instructionText }}
				</p>

			<form class="space-y-4" @submit.prevent="handleSendLink">
				<input
					v-model="email"
					type="email"
					:class="inputStyleClasses"
					:placeholder="emailPlaceholder"
					:disabled="status === 'loading'"
					autocomplete="email"
					spellcheck="false"
					@input="handleInput"
				/>

				<p
					v-if="message"
					class="text-center text-sm font-semibold"
					:class="status === 'error' ? 'text-red-400' : 'text-emerald-400'"
				>
					{{ message }}
				</p>

				<button
					type="submit"
					:class="buttonStyleClasses"
					:disabled="status === 'loading'"
				>
					{{ status === 'loading' ? 'Sending...' : buttonText }}
				</button>
			</form>

				<div v-if="footerLabel || secondaryFooterLabel" class="mt-3 flex flex-col items-center gap-1">
					<div v-if="footerLabel" class="text-center text-xs text-gray-600 desktop:text-[0.95rem]">
						{{ footerLabel === 'Back to Login' ? 'Remembered your password?' : 'ENDED UP IN THE WRONG PAGE?' }}
						<button
							type="button"
							class="cursor-pointer font-medium text-orange-500 underline transition-colors hover:text-orange-600 desktop:text-[0.95rem]"
							@click="emit('footer')"
						>
							{{ footerLabel }}
						</button>
					</div>
					<div v-if="secondaryFooterLabel" class="text-center text-xs text-gray-600">
						<button
							type="button"
							class="cursor-pointer pt-3 text-sm text-orange-500 underline transition-colors hover:text-orange-600 desktop:text-[0.95rem]"
							@click="emit('secondaryFooter')"
						>
							{{ secondaryFooterLabel }}
						</button>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="flex flex-col items-center justify-center px-2 py-2 text-center">
					<div class="mb-3 flex justify-center">
						<span class="inline-flex items-center justify-center rounded-full bg-green-900/40 p-3">
							<CheckCircle2 class="h-10 w-10 animate-bounce text-green-400" />
						</span>
					</div>
					<h2 class="mb-2 text-xl font-semibold text-green-400 tablet:text-2xl">
						{{ successTitle }}
					</h2>
					<p class="mb-1 text-base text-gray-300">
						{{ successMessage }}
					</p>
					<p class="mb-2 text-sm text-orange-400">
						{{ successInfo }}
					</p>
					<p class="mb-4 text-sm text-gray-400">
						Please <b>close this window</b> and continue logging in on your main tab.
					</p>
					<button type="button" :class="twMerge(buttonStyleClasses, 'mt-1 max-w-xs desktop:w-36')" @click="emit('close')">
						Close
					</button>
					<span class="mt-4 block text-xs text-gray-500">
						Or just close this tab manually.
				</span>
				</div>
			</template>
		</div>
	</div>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
