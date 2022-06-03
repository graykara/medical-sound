import {
	readDir,
	BaseDirectory,
	createDir,
	writeFile,
	readTextFile,
  copyFile,
} from '@tauri-apps/api/fs';
import { dataDir, join, resolve } from '@tauri-apps/api/path';

const dataFileName = 'data.json';
const dir = BaseDirectory.Data;

console.log("## STORAGE ##");

let srcPath;

resolve().then(res => {
  join(res, "..", "src").then(realRes => {
    srcPath = realRes;
  });
});

const initData = {
  buttons: [
    {
      id: "1",
      published: true,
      key: "1",
      image: "1.png",
      sound_ko: "ko_1.mp4",
      sound_th: "th_1.mp4",
      message_ko: "메시지를 읽으세요 - 1",
      message_th: "메시지를 읽으세요 - 1"
    },
    {
      id: "2",
      published: true,
      key: "2",
      image: "2.png",
      sound_ko: "ko_2.mp4",
      sound_th: "th_2.mp4",
      message_ko: "메시지를 읽으세요 - 2",
      message_th: "메시지를 읽으세요 - 2"
    },
    {
      id: "3",
      published: true,
      key: "3",
      image: "3.png",
      sound_ko: "ko_3.mp4",
      sound_th: "th_3.mp4",
      message_ko: "메시지를 읽으세요 - 3",
      message_th: "메시지를 읽으세요 - 3"
    },
    {
      id: "4",
      published: true,
      key: "4",
      image: "4.png",
      sound_ko: "ko_4.mp4",
      sound_th: "th_4.mp4",
      message_ko: "메시지를 읽으세요 - 4",
      message_th: "메시지를 읽으세요 - 4"
    },
    {
      id: "5",
      published: true,
      key: "5",
      image: "5.png",
      sound_ko: "ko_5.mp4",
      sound_th: "th_5.mp4",
      message_ko: "메시지를 읽으세요 - 5",
      message_th: "메시지를 읽으세요 - 5"
    },
    {
      id: "6",
      published: true,
      key: "6",
      image: "6.png",
      sound_ko: "ko_6.mp4",
      sound_th: "th_6.mp4",
      message_ko: "메시지를 읽으세요 - 6",
      message_th: "메시지를 읽으세요 - 6"
    },
    {
      id: "7",
      published: true,
      key: "7",
      image: "7.png",
      sound_ko: "ko_7.mp4",
      sound_th: "th_7.mp4",
      message_ko: "메시지를 읽으세요 - 7",
      message_th: "메시지를 읽으세요 - 7"
    },
    {
      id: "8",
      published: true,
      key: "8",
      image: "8.png",
      sound_ko: "ko_8.mp4",
      sound_th: "th_8.mp4",
      message_ko: "메시지를 읽으세요 - 8",
      message_th: "메시지를 읽으세요 - 8"
    },
    {
      id: "9",
      published: true,
      key: "9",
      image: "9.png",
      sound_ko: "ko_9.mp4",
      sound_th: "th_9.mp4",
      message_ko: "메시지를 읽으세요 - 9",
      message_th: "메시지를 읽으세요 - 9"
    }
  ],
  invoke_key: "Shift+1",
  lang_change_key: "Shift+L"
};

const _checkDataFolder = async () => {
	try {
		const files = await readDir('medical-sound-data', {
			dir: dir
		});

		const fileNames = files.map(({ name }) => name);

		return fileNames.includes(dataFileName);
	} catch (e) {
		return false;
	}
};

const _writePath = async () => {
  const dataPath = await dataDir();
  join(dataPath, 'medical-sound-data', 'sounds').then(res => {
    console.log("WRITE = ", res)
  });

  join(dataPath, 'medical-sound-data', 'images').then(res => {
    console.log("WRITE = ", res)
  });

}

const _createDatabase = async () => {
	try {
		await createDir('medical-sound-data', {
			dir: dir,
			recursive: true
		});

    await createDir('medical-sound-data/images', {
			dir: dir,
			recursive: true
		});

    await createDir('medical-sound-data/sounds', {
			dir: dir,
			recursive: true
		});

		await writeFile(
			{
				contents: JSON.stringify(initData, null, 2),
				path: `./medical-sound-data/${dataFileName}`
			},
			{
				dir: dir
			}
		);

    for(var i = 1; i <= 9; i++) {
      await copyFile(
        srcPath + "/assets/sounds/ko_"+i+".mp3",
        "medical-sound-data/sounds/ko_"+i+".mp3",
        {
          dir: dir
        }
      );
      await copyFile(
        srcPath + "/assets/sounds/th_"+i+".mp3",
        "medical-sound-data/sounds/th_"+i+".mp3",
        {
          dir: dir
        }
      );
      await copyFile(
        srcPath + "/assets/images/img_"+i+".png",
        "medical-sound-data/images/img_"+i+".png",
        {
          dir: dir
        }
      );
    }
	} catch (e) {
		console.log(e);
	}
};

export const initStorage = async () => {
	const hasDataFolder = await _checkDataFolder();

	if (!hasDataFolder) {
		await _createDatabase();
	}
};

export const getStoredPosts = async () => {
	try {
		const res = await readTextFile(`medical-sound-data/${dataFileName}`, {
			dir: dir
		});
		return JSON.parse(res);
	} catch (e) {
		return [];
	}
};

export const saveState = async (data) => {
	await writeFile(
		{
			contents: data,
			path: `./medical-sound-data/${dataFileName}`
		},
		{
			dir: dir
		}
	);
};
