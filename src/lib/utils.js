import { desktopDir, join } from "@tauri-apps/api/path";

export const blobToBinary = async (blob) => {
	const buffer = await blob.arrayBuffer();

	return new Uint8Array(buffer);
};

export const getDesktopPath = async () => {
  const desktopPath = await desktopDir();
  return desktopPath;
}

export const getSoundFile = async (fileName) => {
  const desktopPath = await desktopDir();
  return await join(desktopPath, 'medical-sound-data', 'sounds', fileName)
}
