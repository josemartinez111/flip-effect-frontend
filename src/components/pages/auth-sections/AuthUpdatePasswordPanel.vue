<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    COMPONENTS: PAGES > AUTH-SECTIONS
    > AUTH_UPDATE_PASSWORD_PANEL.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import clsx from 'clsx';
import { Eye, EyeOff } from '@lucide/vue';
import { twMerge } from 'tailwind-merge';
import { AuthLogoMark } from '../../../assets';
import type { AuthMode } from '../../../lib';
import AuthLoadingState from './AuthLoadingState.vue';
import { UseAuthUpdatePasswordComposable } from './auth-page-composables/UseAuthUpdatePasswordComposable';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const { authMode } = defineProps<{
	authMode: AuthMode;
}>();

const {
	newPassword,
	confirmPassword,
	newPasswordError,
	confirmPasswordError,
	showNewPassword,
	showConfirmPassword,
	isCheckingSession,
	isSubmitting,
	handleUpdatePasswordSubmit,
} = UseAuthUpdatePasswordComposable({ authMode });

const inputStyleClasses = twMerge(
	clsx(
		'block w-full rounded-lg border px-3 py-2 text-sm',
		'bg-white text-black placeholder-gray-500',
		'focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-hidden',
		'pr-10 transition-all duration-150',
	),
);

const submitButtonStyleClasses = twMerge(
	clsx(
		'w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white',
		'transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70',
	),
);

const containerStyleClasses = twMerge(
	clsx(
		'z-[74] mx-auto flex w-full max-w-md flex-col gap-8 rounded-2xl',
		'border border-gray-700 bg-gray-900 p-8 pt-20 shadow-2xl',
		'backdrop-blur-xs transition-all duration-200',
	),
);
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main class="fixed inset-0 flex min-h-screen items-center justify-center bg-auth-blue px-4 py-8">
		<AuthLoadingState v-if="isCheckingSession" label="Preparing password update..." />

		<div v-else :class="containerStyleClasses">
			<img :src="AuthLogoMark" alt="Auth Logo" class="mx-auto h-28 w-28 object-contain tablet:h-36 tablet:w-36 laptop:h-44 laptop:w-44" />
			<h1 class="mb-2 text-center font-orbitron text-3xl font-bold text-gray-100">
				Update Password
			</h1>

			<form class="flex flex-col gap-6" novalidate @submit.prevent="handleUpdatePasswordSubmit">
				<div>
					<label for="new-password" class="mb-2 block text-sm text-gray-300">
						New Password
					</label>
					<div class="relative">
						<input
							id="new-password"
							v-model="newPassword"
							:type="showNewPassword ? 'text' : 'password'"
							:class="twMerge(inputStyleClasses, newPasswordError ? 'border-red-500' : 'border-gray-300')"
							placeholder="Enter new password"
							autocomplete="new-password"
							spellcheck="false"
							:disabled="isSubmitting"
							:aria-invalid="Boolean(newPasswordError)"
							:aria-describedby="newPasswordError ? 'new-password-error' : undefined"
						/>
						<button
							type="button"
							class="absolute top-2 right-2 cursor-pointer p-1 text-gray-500 hover:text-orange-500 focus:outline-hidden"
							:aria-label="showNewPassword ? 'Hide password' : 'Show password'"
							@click="showNewPassword = !showNewPassword"
						>
							<EyeOff v-if="showNewPassword" class="h-5 w-5" />
							<Eye v-else class="h-5 w-5" />
						</button>
					</div>
					<p v-if="newPasswordError" id="new-password-error" class="mt-1 text-xs text-red-500">
						{{ newPasswordError }}
					</p>
				</div>

				<div>
					<label for="confirm-password" class="mb-2 block text-sm text-gray-300">
						Confirm Password
					</label>
					<div class="relative">
						<input
							id="confirm-password"
							v-model="confirmPassword"
							:type="showConfirmPassword ? 'text' : 'password'"
							:class="twMerge(inputStyleClasses, confirmPasswordError ? 'border-red-500' : 'border-gray-300')"
							placeholder="Confirm new password"
							autocomplete="new-password"
							spellcheck="false"
							:disabled="isSubmitting"
							:aria-invalid="Boolean(confirmPasswordError)"
							:aria-describedby="confirmPasswordError ? 'confirm-password-error' : undefined"
						/>
						<button
							type="button"
							class="absolute top-2 right-2 cursor-pointer p-1 text-gray-500 hover:text-orange-500 focus:outline-hidden"
							:aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
							@click="showConfirmPassword = !showConfirmPassword"
						>
							<EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
							<Eye v-else class="h-5 w-5" />
						</button>
					</div>
					<p v-if="confirmPasswordError" id="confirm-password-error" class="mt-1 text-xs text-red-500">
						{{ confirmPasswordError }}
					</p>
				</div>

				<button type="submit" :class="submitButtonStyleClasses" :disabled="isSubmitting">
					{{ isSubmitting ? 'Updating...' : 'Update Password' }}
				</button>
			</form>
		</div>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
