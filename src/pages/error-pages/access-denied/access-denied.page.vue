<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
    PAGES: ERROR-PAGES > ACCESS-DENIED
    > ACCESS-DENIED.PAGE.VUE
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<script setup lang="ts">
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { AuthAccessDeniedArtwork } from '../../../assets';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
</script>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                        </>MARKUP</>
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<template>
	<section class="bg-gray-600">
		<!-- ∞∞∞∞∞∞∞∞ CONTAINER ∞∞∞∞∞∞∞∞ -->
		<div class="mx-auto w-full max-w-7xl rounded-sm px-5 py-16 tablet:px-10 tablet:py-20">
			<div class="grid items-center gap-8 tablet:gap-20 laptop:grid-cols-2">
				<div>
					<div class="flex flex-col items-center">
						<div class="font-orbitron text-2xl font-bold text-indigo-500 desktop:pr-36 desktop:text-5xl">
							403 Access Denied
						</div>
						<div class="font-orbitron mt-10 text-3xl font-bold tablet:text-5xl laptop:text-6xl desktop:text-3xl">
							Your magic link is invalid or has expired.
						</div>
						<div class="mt-8 text-sm font-medium text-gray-400 tablet:text-xl laptop:text-3xl">
							Please request a new link to continue.
						</div>
					</div>

					<!-- ∞∞∞∞∞∞∞∞ BACK HOME BUTTON ∞∞∞∞∞∞∞∞ -->
					<RouterLink
						to="/"
						class="mt-6 inline-block cursor-pointer items-center rounded-md bg-indigo-950 px-6 py-3 text-center font-semibold text-white shadow-2xl transition hover:bg-rose-600 active:opacity-30 desktop:px-56"
					>
						Back Home
					</RouterLink>
				</div>
				<div class="relative h-full w-full max-w-2xl">
					<img :src="AuthAccessDeniedArtwork" alt="" class="mx-auto inline-block h-full w-full object-cover" />
				</div>
			</div>
		</div>
	</section>
</template>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
                          STYLES
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
<style scoped lang="postcss">
/* prettier-ignore */

</style>
<!-- ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ -->
