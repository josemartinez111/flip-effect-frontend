// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB: UTILS
// > IMAGE_PROCESSING.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const loadImageToCanvas = async (
	file: File,
	maxDimension: number,
	quality: number = 0.85,
): Promise<string> => {
	const blobUrl = URL.createObjectURL(file);
	const img = new Image();

	return new Promise<string>((resolve, reject) => {
		img.onload = () => {
			const { width, height } = img;
			const scale = Math.min(1, maxDimension / Math.max(width, height));
			const w = Math.max(1, Math.round(width * scale));
			const h = Math.max(1, Math.round(height * scale));

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				URL.revokeObjectURL(blobUrl);
				reject(new Error('Canvas 2D context not available'));
				return;
			}

			ctx.drawImage(img, 0, 0, w, h);
			const dataUrl = canvas.toDataURL('image/jpeg', quality);
			URL.revokeObjectURL(blobUrl);
			resolve(dataUrl);
		};

		img.onerror = () => {
			URL.revokeObjectURL(blobUrl);
			reject(new Error('Failed to load image'));
		};

		img.src = blobUrl;
	});
};

export const loadBlogImagesToCanvas = async (
	files: Array<File>,
	maxPayloadBytes: number = 2_000_000,
): Promise<Array<string> | null> => {
	const compressed = await Promise.all(
		files.map((file) => loadImageToCanvas(file, 600, 0.7)),
	);

	const totalBytes = compressed.reduce((sum, b64) => sum + b64.length, 0);
	if (totalBytes > maxPayloadBytes) {
		return null;
	}

	return compressed;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
