<script>
  import { desktopDir, join } from '@tauri-apps/api/path';
  import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
  import { appWindow } from '@tauri-apps/api/window';

  import hotkeys from "hotkeys-js";
  import { onMount, onDestroy } from "svelte";

  import { langCode, volumeEnable, lists, audio } from '../lib/store';

  import {
    register as registerShortcut,
    unregisterAll as unregisterAllShortcuts,
  } from "@tauri-apps/api/globalShortcut";

  let shortcut = $lists["invoke_key"];

  // let obj = $lists["buttons"];
  // let _lists;

  let obj = $lists["buttons"];

  let _lists;
  let _images = [];

  let langValue;
  let volumeValue;

  let TOGGLE_HOTKEY_1 = String($lists["buttons"][0].key);
  let TOGGLE_HOTKEY_2 = String($lists["buttons"][1].key);
  let TOGGLE_HOTKEY_3 = String($lists["buttons"][2].key);
  let TOGGLE_HOTKEY_4 = String($lists["buttons"][3].key);
  let TOGGLE_HOTKEY_5 = String($lists["buttons"][4].key);
  let TOGGLE_HOTKEY_6 = String($lists["buttons"][5].key);
  let TOGGLE_HOTKEY_7 = String($lists["buttons"][6].key);
  let TOGGLE_HOTKEY_8 = String($lists["buttons"][7].key);
  let TOGGLE_HOTKEY_9 = String($lists["buttons"][8].key);

  langCode.subscribe(value => {
    langValue = value;
  });

  volumeEnable.subscribe(value => {
    volumeValue = value;
  });

  if(obj == undefined) {
    console.log('default');
    _lists = [
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
    ];
  } else {
    console.log("@#@#");
    _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);
  }

  function register() {
    const shortcut_ = shortcut;
    registerShortcut(shortcut_, () => {
      console.log(`Shortcut ${shortcut_} triggered`);
      invoke("handle_short_key");

      hotkeys(TOGGLE_HOTKEY_1, () => { handleClick(1) });
      hotkeys(TOGGLE_HOTKEY_2, () => { handleClick(2) });
      hotkeys(TOGGLE_HOTKEY_3, () => { handleClick(3) });
      hotkeys(TOGGLE_HOTKEY_4, () => { handleClick(4) });
      hotkeys(TOGGLE_HOTKEY_5, () => { handleClick(5) });
      hotkeys(TOGGLE_HOTKEY_6, () => { handleClick(6) });
      hotkeys(TOGGLE_HOTKEY_7, () => { handleClick(7) });
      hotkeys(TOGGLE_HOTKEY_8, () => { handleClick(8) });
      hotkeys(TOGGLE_HOTKEY_9, () => { handleClick(9) });
    })
      .then(() => {

        console.log(`Shortcut ${shortcut_} registered successfully`);
      })
      .catch();
  }

  function unregisterAll() {
    unregisterAllShortcuts();
    hotkeys.unbind(TOGGLE_HOTKEY_1);
    hotkeys.unbind(TOGGLE_HOTKEY_2);
    hotkeys.unbind(TOGGLE_HOTKEY_3);
    hotkeys.unbind(TOGGLE_HOTKEY_4);
    hotkeys.unbind(TOGGLE_HOTKEY_5);
    hotkeys.unbind(TOGGLE_HOTKEY_6);
    hotkeys.unbind(TOGGLE_HOTKEY_7);
    hotkeys.unbind(TOGGLE_HOTKEY_8);
    hotkeys.unbind(TOGGLE_HOTKEY_9);
  }

  onMount(() => {
    unregisterAll();
    register();
    console.log("mount")

  });

  onDestroy(() => {
    unregisterAll();
  })

  const getSoundFile = async (fileName) => {
    try {
      const desktopPath = await desktopDir();
      let res = join(desktopPath, 'medical-sound-data', 'sounds', fileName);
      return res;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  const setImageFile = async (fileName) => {
    try {
      const desktopPath = await desktopDir();
      let res = join(desktopPath, 'medical-sound-data', 'images', fileName);
      return res;
    } catch(e) {
      return false;
    }
  }

  function handleClick(id) {
    let _id = document.getElementById("btn_" + id);

    if(!volumeValue) {
      audio.volume = 0;
    } else {
      audio.volume = 1;
    }

    if(!_id.classList.contains("grayscale")) {
      _id.classList.add("grayscale");

      let file = langValue + "_" + id + ".mp3";

      getSoundFile(file).then(res => {
        let _src = convertFileSrc(res.toString());

        if(audio.canPlayType('audio/mpeg')) {
          audio.getElementsByTagName("source")[0].src = _src;
          audio.load();
          audio.pause();
          audio.currentTime = 0;
          audio.play();
        }
      });
    }
  }

  for(let i = 1; i <= 9; i++) {
    let ext = $lists["buttons"][i - 1]["image"].split('.')[1];
    setImageFile("img_" + i + "." + ext).then(res => {
      let _src = convertFileSrc(res.toString());
      _images.push(_src);
      document.getElementById('img_' + i).setAttribute('src', _src);
    });
  }
</script>

<div id="main-contents" class="flex px-8 py-8 bg-sky-100">

  {#each {length: 9} as _, index}
    {#if _lists[index].published}
      <div class="relative">
        <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[index].key}</span>
        <div class="tooltip tooltip-bottom" data-tip="{_lists[index]["message_" + langValue]}">
          <div id="btn_{_lists[index].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[index].id)}>
            <img id="img_{_lists[index].id}" class="object-cover shadow-xl rounded-2xl" src="" alt="{_lists[index].id}" />
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .main_btn {
    @apply btn btn-outline w-32 h-32 mx-1 p-1 rounded-2xl bg-white;
  }
</style>
