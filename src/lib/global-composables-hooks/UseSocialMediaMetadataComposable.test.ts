import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createHead } from '@unhead/vue/client';
import { defineComponent, h } from 'vue';
import { UseSocialMediaMetadataComposable } from './UseSocialMediaMetadataComposable';

const renderHead = async () => {
	const head = createHead();

	const host = defineComponent({
		setup() {
			UseSocialMediaMetadataComposable({
				siteUrl: 'https://example.test',
				path: '/civics-quiz',
				title: 'Civics Quiz | The Flip Effect',
				description: 'Limits of power.',
				image: 'https://example.test/og-civics-quiz.jpg',
				platforms: ['threads'],
			});

			return () => h('div');
		},
	});

	mount(host, { global: { plugins: [head] } });
	await flushPromises();
	// --- unhead patches the DOM on a debounced task, so a microtask flush is not enough. ---
	await new Promise((resolve) => setTimeout(resolve, 0));
};

// --- createHead patches the real document, so assert on the head a browser would end up with. ---
const metaContent = (attribute: 'property' | 'name', value: string) =>
	document.head
		.querySelector(`meta[${attribute}="${value}"]`)
		?.getAttribute('content');

describe('UseSocialMediaMetadataComposable', () => {
	it('emits the og tags a link preview needs', async () => {
		await renderHead();

		expect(metaContent('property', 'og:title')).toBe('Civics Quiz | The Flip Effect');
		expect(metaContent('property', 'og:url')).toBe('https://example.test/civics-quiz');
		expect(metaContent('property', 'og:image')).toBe(
			'https://example.test/og-civics-quiz.jpg',
		);
		expect(metaContent('property', 'og:type')).toBe('website');
	});

	it('emits the search-engine half too', async () => {
		await renderHead();

		const canonical = document.head.querySelector('link[rel="canonical"]');

		expect(metaContent('name', 'description')).toBe('Limits of power.');
		expect(canonical?.getAttribute('href')).toBe('https://example.test/civics-quiz');
		expect(document.title).toBe('Civics Quiz | The Flip Effect');
	});
});
