<script>

  import hotkeys from "hotkeys-js";
  import { onMount, onDestroy } from "svelte";
  import { push } from 'svelte-spa-router';

  import {
    appWindow,
    LogicalSize,
  } from '@tauri-apps/api/window';

  import { langCode, volumeEnable, lists, audio } from '../lib/store';

  let langValue;
  let volumeValue;

  langCode.subscribe(value => {
    langValue = value;
  });

  volumeEnable.subscribe(value => {
    volumeValue = value;
  });

  let obj = $lists["buttons"];

  // 윈도 설정
  let selectedWindow = appWindow.label

  // 윈도맵 설정
  const windowMap = {
    [selectedWindow]: appWindow
  }

  // 활성화 단축키
  let LANG_TOGGLE_HOTKEY = $lists["lang_change_key"];
  console.log('toggle init', LANG_TOGGLE_HOTKEY);

  // 언어설정
  let _language = "한국어";
  let _langCode = "ko";
  let _init = false;

  // 언어 드랍메뉴 보기
  let _show = false;

  // 볼륨 활성화 여부
  let _isVolume = true;

  // 설정화면 여부
  let _isSetting = false;

  function handleLangHotKey() {
    hotkeys.unbind(LANG_TOGGLE_HOTKEY);
    LANG_TOGGLE_HOTKEY = $lists["lang_change_key"];
    console.log("TOGGLE", LANG_TOGGLE_HOTKEY);
    hotkeys(LANG_TOGGLE_HOTKEY, () => {
      let _target;
      if(_langCode == "ko") {
        _target = "th";
      } else {
        _target = "ko";
      }
      changeLanguage(_target);
    });
  }

  onMount(() => {
    // appWindow.setPosition( new LogicalPosition(0, 0) );
    windowMap[selectedWindow].center();
    windowMap[selectedWindow].setAlwaysOnTop(true);
    // hotkeys(INIT_TOGGLE_HOTKEY, () => {
    //   _init = true;
    //   select(0);
    // });
    // hotkeys(MAIN_TOGGLE_HOTKEY, () => {
    //   _init = false;
    //   select(1);
    // });
    handleLangHotKey();
  });

  onDestroy(() => {
    // hotkeys.unbind(INIT_TOGGLE_HOTKEY);
    // hotkeys.unbind(MAIN_TOGGLE_HOTKEY);
    hotkeys.unbind(LANG_TOGGLE_HOTKEY);
  });

  function select(arg) {

    switch (arg) {
      case 0:
        _isSetting = false;
        windowMap[selectedWindow].setSize(new LogicalSize(1280, 290));
        push("/");
        break;
      case 1:
        _isSetting = false;
        windowMap[selectedWindow].setSize(new LogicalSize(1280, 290));
        push("/main");
        handleLangHotKey();
        break;
      case 2:
        _isSetting = true;
        windowMap[selectedWindow].setSize(new LogicalSize(1280, 720));
        push("/config");
        hotkeys.unbind(LANG_TOGGLE_HOTKEY);
        break;
    }
  }

  // 언어 변경
  function changeLanguage(lang) {
    let humanLanguage;
    _langCode = lang;

    langCode.set(lang);

    if (_langCode == "ko") {
      humanLanguage = "한국어";
    } else if (_langCode == "th") {
      humanLanguage = "태국어";
    }
    _language = humanLanguage;
    _show = !_show;
  }

  // 볼륨 조절
  function handleVolume() {
    _isVolume = !_isVolume;
    volumeEnable.set(_isVolume);
    if(_isVolume) {
      audio.volume = 1;
    } else {
      audio.volume = 0;
    }
  }

  // 설정 진입
  function handleConfig() {
    _isSetting = !_isSetting;
    if(_isSetting) {
      select(2);

    } else {
      select(1);
    }
  }
</script>

<div>
  {#if !_init}
  <div id="nav" class="flex min-h-0 px-10 py-1 m-0 navbar bg-sky-500">
    <div class="flex items-start justify-start flex-none w-40 cursor-default">
      <p class="text-xl font-bold text-white normal-case">Medical Sound</p>
    </div>

    <div class="flex items-center justify-center grow">
      <div class="z-50 dropdown">
        <div>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label
            id="menu-button"
            class="m-0 text-xl font-bold text-white normal-case bg-transparent justify-items-center btn btn-ghost outline-disable "
            tabindex="0"
            on:click={() => (_show = !_show) }
            aria-expanded="false" aria-haspopup="false">{_language}</label>
        </div>

        {#if _show}
          <div class="absolute mt-2 rounded-md shadow-lg" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
              <ul tabindex="0" class="w-32 p-2 bg-white shadow dropdown-content menu rounded-box">
                <li><button id="menu-item-0" role="menuitem" class="justify-center font-bold text-gray-900" on:click={() => changeLanguage("ko") }>한국어</button></li>
                <li><button id="menu-item-1" role="menuitem" class="justify-center font-bold text-gray-900" on:click={() => changeLanguage("th") }>태국어</button></li>
              </ul>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex items-end justify-end flex-none w-40">
      <label class="swap">

        <input type="checkbox" class="outline-disable" on:click={() => handleVolume()} />

        <!-- volume on icon -->
        <svg class="fill-white swap-on" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"/>
        </svg>

        <!-- volume off icon -->
        <svg class="fill-white swap-off" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
        </svg>

      </label>

      <label class="ml-4 swap swap-rotate">

        <input type="checkbox" class="outline-disable" on:click={() => handleConfig()} />

        <!-- setting on icon -->
        <svg class="fill-white swap-on" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21.33 21.33">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>

        <!-- setting off icon -->
        <svg class="fill-white swap-off" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21.33 21.33">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      </label>

    </div>
  </div>
  {/if}
</div>

<style lang="postcss">
  .outline-disable {
    outline: none;
  }

</style>
