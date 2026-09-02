// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//                API:SEND-EMAIL-ACTION.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { Utils } from '../../lib';
import { ST } from '../../lib';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

// TODO: Add file to template!!!
export async function sendEmailJSAction(
	formElement: HTMLFormElement,
): Promise<void> {
	const {
		VITE_EMAILJS_SERVICE_ID: SERVICE_ID,
		VITE_EMAILJS_TEMPLATE_ID: TEMPLATE_ID,
		VITE_EMAILJS_PUBLIC_KEY: PUBLIC_KEY,
	} = import.meta.env;

	if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
		throw new Error(
			'[EMAILJS CONFIG] Missing SERVICE_ID, TEMPLATE_ID, or PUBLIC_KEY',
		);
	}

	const sendEmailJSCallback = async (): Promise<void> => {
		const responseStatus: EmailJSResponseStatus = await emailjs.sendForm(
			SERVICE_ID,
			TEMPLATE_ID,
			formElement,
			PUBLIC_KEY,
		);

		if (responseStatus.status !== ST.OK) {
			const detail = responseStatus.text || 'Unknown error';
			throw new Error(
				`[EMAILJS ERROR] Status ${responseStatus.status} – ${detail}`,
			);
		}

		console.log(
			`[EMAILJS ✅] ${responseStatus.status} – ${responseStatus.text}`,
		);
	};

	const sendEmailResults = await Utils.runTryCatch({
		callback: sendEmailJSCallback,
		errorContext: 'SEND_EMAIL',
	});

	if (sendEmailResults.error !== undefined) {
		throw sendEmailResults.error;
	}
}
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
