import Jimp from 'jimp';

const getMainColor = async (img: string) => {
	let image = await Jimp.read(img);
	image.resize(16, 16);

	const pixels: any = [];
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
		// idx is the position start position of this rgba tuple in the bitmap Buffer

		let r = image.bitmap.data[idx + 0];
		let g = image.bitmap.data[idx + 1];
		let b = image.bitmap.data[idx + 2];
		let a = image.bitmap.data[idx + 3];
		pixels.push({ r, g, b, a });
	});

	const result = [
		...pixels
			.reduce((acc: any, pixel: any) => {
				const k = `${pixel.r}|${pixel.g}|${pixel.b}`;
				if (!acc.has(k)) acc.set(k, { ...pixel, count: 1 });
				else acc.get(k).count++;
				return acc;
			}, new Map())
			.values(),
	];
	const max = result.reduce((a, b) => (a.count > b.count ? a : b));

	const hexValue = ((1 << 24) + (max.r << 16) + (max.g << 8) + max.b)
		.toString(16)
		.slice(1);

	return hexValue;
};

export { getMainColor };
