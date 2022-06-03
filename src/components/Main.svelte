<script>
  import { dataDir, join } from '@tauri-apps/api/path';
  import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
  import { appWindow } from '@tauri-apps/api/window';

  import hotkeys from "hotkeys-js";
  import { onMount, onDestroy } from "svelte";

  import { langCode, volumeEnable, audio } from '../lib/store';
  import { lists } from '../lib/Lists';

  import {
    register as registerShortcut,
    unregisterAll as unregisterAllShortcuts,
  } from "@tauri-apps/api/globalShortcut";

  let shortcut = $lists["invoke_key"];

  let obj;

  let possible = false;

  let _lists;
  let _images = [];

  let langValue;
  let volumeValue;

  let TOGGLE_HOTKEY_1;
  let TOGGLE_HOTKEY_2;
  let TOGGLE_HOTKEY_3;
  let TOGGLE_HOTKEY_4;
  let TOGGLE_HOTKEY_5;
  let TOGGLE_HOTKEY_6;
  let TOGGLE_HOTKEY_7;
  let TOGGLE_HOTKEY_8;
  let TOGGLE_HOTKEY_9;

  langCode.subscribe(value => {
    langValue = value;
  });

  volumeEnable.subscribe(value => {
    volumeValue = value;
  });

  function register() {
    const shortcut_ = shortcut;
    registerShortcut(shortcut_, () => {
      console.log(`Shortcut ${shortcut_} triggered`);
      invoke("handle_short_key");
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
    obj = $lists["buttons"];

    setTimeout(() => {
      if(obj != undefined) {
        console.log("## MAIN INIT ##");
        _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);
      }
    }, 1);

    setTimeout(() => {
      TOGGLE_HOTKEY_1 = String($lists["buttons"][0].key);
      TOGGLE_HOTKEY_2 = String($lists["buttons"][1].key);
      TOGGLE_HOTKEY_3 = String($lists["buttons"][2].key);
      TOGGLE_HOTKEY_4 = String($lists["buttons"][3].key);
      TOGGLE_HOTKEY_5 = String($lists["buttons"][4].key);
      TOGGLE_HOTKEY_6 = String($lists["buttons"][5].key);
      TOGGLE_HOTKEY_7 = String($lists["buttons"][6].key);
      TOGGLE_HOTKEY_8 = String($lists["buttons"][7].key);
      TOGGLE_HOTKEY_9 = String($lists["buttons"][8].key);

      unregisterAll();
      register();

      hotkeys(TOGGLE_HOTKEY_1, () => { handleClick(1) });
      hotkeys(TOGGLE_HOTKEY_2, () => { handleClick(2) });
      hotkeys(TOGGLE_HOTKEY_3, () => { handleClick(3) });
      hotkeys(TOGGLE_HOTKEY_4, () => { handleClick(4) });
      hotkeys(TOGGLE_HOTKEY_5, () => { handleClick(5) });
      hotkeys(TOGGLE_HOTKEY_6, () => { handleClick(6) });
      hotkeys(TOGGLE_HOTKEY_7, () => { handleClick(7) });
      hotkeys(TOGGLE_HOTKEY_8, () => { handleClick(8) });
      hotkeys(TOGGLE_HOTKEY_9, () => { handleClick(9) });

      console.log("mount");
      possible = true;
    }, 10);

    setTimeout(() => {
      for(let i = 1; i <= 9; i++) {
        let ext = $lists["buttons"][i - 1]["image"].split('.')[1];
        setImageFile("img_" + i + "." + ext).then(res => {
          let _src = convertFileSrc(res.toString());
          _images.push(_src);
          document.getElementById('img_' + i).setAttribute('src', _src);
        });
      }
    }, 20);
  });

  onDestroy(() => {
    setTimeout(() => {
      unregisterAll();
    }, 200);
  })

  const getSoundFile = async (fileName) => {
    try {
      const dataPath = await dataDir();
      let res = join(dataPath, 'medical-sound-data', 'sounds', fileName);
      return res;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  const setImageFile = async (fileName) => {
    try {
      const dataPath = await dataDir();
      let res = join(dataPath, 'medical-sound-data', 'images', fileName);
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

    if(document.getElementById("btn-reset").classList.contains("hidden")) {
      document.getElementById("btn-reset").classList.remove("hidden");
    }
  }
</script>

<div id="main-contents" class="flex px-8 py-8 bg-sky-100">
{#if possible == true }
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
{/if}

</div>

<style lang="postcss">
  .main_btn {
    @apply btn btn-outline w-32 h-32 mx-1 p-1 rounded-2xl bg-white;
  }
</style>
