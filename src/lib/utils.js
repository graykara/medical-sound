export const blobToBinary = async (blob) => {
	const buffer = await blob.arrayBuffer();

	return new Uint8Array(buffer);
};
