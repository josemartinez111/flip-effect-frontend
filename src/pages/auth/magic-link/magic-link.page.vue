<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    PAGES: AUTH > MAGIC-LINK
    > MAGIC_LINK.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useRouter } from 'vue-router';
import { sendMagicLinkAction } from '../../../api';
import AuthVerificationLinkPanel from '../../../components/pages/auth-sections/AuthVerificationLinkPanel.vue';
import type { AuthRouteMode } from '../../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

defineProps<{
	authMode: AuthRouteMode;
}>();

const router = useRouter();

const goHome = async (): Promise<void> => {
	await router.push('/');
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<main class="min-h-screen bg-auth-blue px-4 py-8">
		<AuthVerificationLinkPanel
			header-text="Admin Verification"
			instruction-text="Enter your admin email to receive a secure magic link."
			button-text="Send Magic Link"
			success-title="Magic Link Sent"
			success-message="Check your inbox for your magic link."
			success-info="This window is no longer needed."
			secondary-footer-label="Home Page"
			:send-link-callback="sendMagicLinkAction"
			@secondary-footer="goHome"
			@close="goHome"
		/>
	</main>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
