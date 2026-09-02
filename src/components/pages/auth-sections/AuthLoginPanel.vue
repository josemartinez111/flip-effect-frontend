<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > AUTH-SECTIONS
    > AUTH_LOGIN_PANEL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { Eye, EyeOff } from '@lucide/vue';
import { twMerge } from 'tailwind-merge';
import { sendResetPasswordLinkAction } from '../../../api';
import { AuthLogoMark } from '../../../assets';
import type { AuthRouteMode } from '../../../lib';
import AuthLoadingState from './AuthLoadingState.vue';
import AuthShell from './AuthShell.vue';
import AuthVerificationLinkPanel from './AuthVerificationLinkPanel.vue';
import { UseAuthLoginComposable } from './auth-page-composables/UseAuthLoginComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const {
	authMode,
	redirectAfterLogin = '/blog',
} = defineProps<{
	authMode: AuthRouteMode;
	redirectAfterLogin?: string;
}>();

const {
	email,
	password,
	emailError,
	passwordError,
	isCheckingAuth,
	isSubmitting,
	showPassword,
	showPasswordReset,
	loginIntroText,
	clearFormErrors,
	handleLoginSubmit,
	goHome,
} = UseAuthLoginComposable({
	authMode,
	redirectAfterLogin,
});

const inputStyleClasses = twMerge(
	clsx(
		'w-full cursor-pointer rounded-lg border px-3 py-2 text-sm',
		'bg-white text-black placeholder:text-gray-500 transition-all duration-150',
		'focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none',
	),
);

const submitButtonStyleClasses = twMerge(
	clsx(
		'w-full cursor-pointer rounded-lg bg-orange-500 px-4 py-2',
		'font-medium text-white transition-colors hover:bg-orange-600',
		'active:opacity-70 disabled:cursor-not-allowed disabled:opacity-60',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<AuthShell title="Admin Login">
		<AuthLoadingState v-if="isCheckingAuth" />

		<AuthVerificationLinkPanel
			v-else-if="showPasswordReset"
			header-text="Update Password"
			instruction-text="Enter your email to receive a password update link."
			button-text="Send Update Link"
			success-title="Update Link Sent"
			success-message="Check your inbox for your password update link."
			success-info="You can close this window."
			footer-label="Back to Login"
			secondary-footer-label="Home Page"
			:send-link-callback="sendResetPasswordLinkAction"
			@footer="showPasswordReset = false"
			@secondary-footer="goHome"
			@close="goHome"
		/>

		<div v-else>
			<header class="flex flex-col items-start">
				<div class="mb-4 text-orange-500">
					<img
						:src="AuthLogoMark"
						alt="Auth Logo"
						class="h-[18.8rem] w-[18.8rem] object-contain"
					/>
				</div>
				<h1 class="font-orbitron text-4xl font-bold text-gray-100">
					ADMIN LOGIN
				</h1>
				<p class="font-orbitron text-sm text-gray-400">
					{{ loginIntroText }}
				</p>
			</header>

			<form class="flex flex-col gap-6 pt-0" novalidate @submit.prevent="handleLoginSubmit">
				<div>
					<label for="admin-email" class="mb-2 block text-sm">
						YOUR EMAIL
					</label>
					<input
						id="admin-email"
						v-model="email"
						type="email"
						:class="twMerge(inputStyleClasses, emailError ? 'border-red-500' : 'border-gray-300')"
						placeholder="ENTER YOUR EMAIL"
						autocomplete="email"
						:aria-invalid="Boolean(emailError)"
						:aria-describedby="emailError ? 'admin-email-error' : undefined"
						@input="clearFormErrors"
					/>
					<p v-if="emailError" id="admin-email-error" class="mt-1 text-xs text-red-500">
						{{ emailError }}
					</p>
				</div>

				<div class="relative">
					<label for="admin-password" class="mb-2 block text-sm font-semibold text-gray-700">
						Your Password
					</label>
					<div class="relative">
						<input
							id="admin-password"
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							:class="twMerge(inputStyleClasses, passwordError ? 'border-red-500' : 'border-gray-300', 'block pr-10')"
							placeholder="Enter your password"
							autocomplete="current-password"
							spellcheck="false"
							:aria-invalid="Boolean(passwordError)"
							:aria-describedby="passwordError ? 'admin-password-error' : undefined"
							@input="clearFormErrors"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-gray-500 hover:text-orange-500 focus:outline-none"
							:aria-label="showPassword ? 'Hide password' : 'Show password'"
							@click="showPassword = !showPassword"
						>
							<EyeOff v-if="showPassword" class="h-5 w-5" />
							<Eye v-else class="h-5 w-5" />
						</button>
					</div>
					<p v-if="passwordError" id="admin-password-error" class="mt-1 text-xs text-red-500">
						{{ passwordError }}
					</p>
				</div>

				<button
					type="submit"
					:class="submitButtonStyleClasses"
					:disabled="isSubmitting"
				>
					{{ isSubmitting ? 'LOGGING IN...' : 'LOG IN' }}
				</button>

				<div class="mt-2 text-right">
					<button
						type="button"
						class="cursor-pointer text-xs text-orange-500 underline transition-colors hover:text-orange-600 desktop:text-[0.95rem]"
						@click="showPasswordReset = true"
					>
						Forgot your password?
					</button>
				</div>

				<div class="mt-6 text-center text-sm text-gray-600">
					ENDED UP IN THE WRONG PAGE?
					<RouterLink
						to="/"
						class="font-medium text-orange-500 underline"
					>
						Home Page
					</RouterLink>
				</div>
			</form>
		</div>
	</AuthShell>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
