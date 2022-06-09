<script>
  import { langCode } from '../lib/store';
  import { lists } from '../lib/Lists';

  import { open } from "@tauri-apps/api/dialog";

  import { BaseDirectory, copyFile, readBinaryFile } from "@tauri-apps/api/fs";
  import { sep } from '@tauri-apps/api/path';

  import { invoke } from '@tauri-apps/api/tauri';

  import {
    register as registerShortcut,
    unregister,
    unregisterAll as unregisterAllShortcuts,
  } from "@tauri-apps/api/globalShortcut";

  let langValue;

  // console.log("## HEADER");

  langCode.subscribe(value => {
    langValue = value;
  });

  const dir = BaseDirectory.Data;

  let defaultPath = null;
  let filter = null;
  let multiple = false;
  let directory = false;

  let invokeKey = $lists["invoke_key"];
  let langKey = $lists["lang_change_key"];

  const unsubscribe = langCode.subscribe(value => {
    langValue = value;
  });

  let obj = $lists["buttons"];
  let langObj = $lists["languages"];

  let _lists;
  _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);

  let _langLists;
  _langLists = Object.keys(langObj).map((key) => [Number(key), langObj[key]][1]);

  console.log("##LANG##", _langLists);

  let oldValue;

  let key_of_invoke;
  let key_of_lang;

  let shortcut = $lists["invoke_key"];

  // 언어설정
  let _language = "한국어";
  let _langCode = "1";
  let _show = false;

  function changeLanguage(lang) {
    let humanLanguage;
    _langCode = lang;

    langCode.set(lang);

    if (_langCode == "1") {
      humanLanguage = "한국어";
    } else if (_langCode == "2") {
      humanLanguage = "태국어";
    }
    _language = humanLanguage;
    _show = !_show;
    console.log(_show);
  }

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

  const onChangePublished = e => {
    let val = e.target.checked;
    let idx = Number(e.target.id.split("_")[1]);
    $lists["buttons"][idx - 1].published = val;
  }

  const onChangeLangPublished = e => {
    let val = e.target.checked;
    let idx = Number(e.target.id.split("_")[1]);
    console.log(idx);
    $lists["languages"][idx - 1].published = val;
  }

  const onChangeLangName = e => {
    let val = e.target.value;
    let idx = Number(e.target.id.split("_")[1]);
    $lists["languages"][idx - 1].name = val;
  }

  let invokeUp = false;
  let oldInvokeVal = $lists["invoke_key"];

  const onInvokeKeyUp = event => {
    unregister(shortcut);
    if((key_of_invoke == undefined || key_of_invoke == langKey) && invokeUp == false) {
      document.getElementById("modal-open-btn").click();
      invokeUp = true;
      setTimeout(function() {
        langUp = false;
        event.target.value = oldInvokeVal;
        key_of_invoke = oldInvokeVal;
        $lists["invoke_key"] = key_of_invoke;
      }, 1000);
    } else {
      // unregisterAllShortcuts();
      console.log("#####", shortcut);
      shortcut = key_of_invoke;
      console.log("#####", shortcut);

      event.target.value = shortcut;
      $lists["invoke_key"] = shortcut;
      register();
    }
  }

  const onIKnvokeKey = event => {
    let metaKey;
    let codeKey;

    if(event.alt) metaKey = "Alt";
    if(event.shiftKey) metaKey = "Shift";
    if(event.ctrlKey) metaKey = "Ctrl";
    if(event.altKey) metaKey = "Alt";
    if(event.metaKey) metaKey = "Meta";
    if(event.tabKeu) metaKey = "Tab";

    // console.log(event.code);

    if(event.code.length > 0) {
      if(event.code.split('Digit')[1] != undefined) {
        codeKey = event.code.split('Digit')[1];
      } else if(event.code.split('Key')[1] != undefined) {
        codeKey = event.code.split('Key')[1];
      } else {
        codeKey = event.code;
      }
    }
    key_of_invoke = metaKey + "+"+String(codeKey);
    event.target.value = "";
  }

  let langUp = false;
  let oldLangVal = $lists["lang_change_key"];

  const onLangKeyUp = event => {
    console.log(key_of_lang);
    if((key_of_lang == undefined || key_of_lang == invokeKey) && langUp == false) {
      document.getElementById("modal-open-btn").click();
      langUp = true;
      setTimeout(function() {
        langUp = false;
        event.target.value = oldLangVal;
        key_of_lang = oldLangVal;
        $lists["lang_change_key"] = key_of_lang;
      }, 1000);
    } else {
      console.log("CHANGE", key_of_lang);
      event.target.value = key_of_lang;
      $lists["lang_change_key"] = key_of_lang;
    }
  }

  const onLangKey = event => {
    let metaKey;
    let codeKey;

    if(event.alt) metaKey = "Alt";
    if(event.shiftKey) metaKey = "Shift";
    if(event.ctrlKey) metaKey = "Ctrl";
    if(event.altKey) metaKey = "Alt";
    if(event.metaKey) metaKey = "Meta";

    // console.log(event.code);

    if(event.code.length > 0) {
      if(event.code.split('Digit')[1] != undefined) {
        codeKey = event.code.split('Digit')[1];
      } else if(event.code.split('Key')[1] != undefined) {
        codeKey = event.code.split('Key')[1];
      } else {
        codeKey = event.code;
      }
    }
    key_of_lang = metaKey + "+" + codeKey;
    event.target.value = "";
  }

  const onHotKeyFocusIn = e => {
    oldValue = e.target.value;
    e.target.value = null;
  }
  const onHotKeyFocusOut = e => {
    e.target.value = oldValue;
  }
  const onHotKey = e => {
    let val = e.target.value;
    if(val.length > 1) {
      val = val.slice(-1, 2);
      e.target.value = val;
    }

    let tmpArr = [];
    $lists["buttons"].forEach(element => {
      tmpArr = [...tmpArr, element.key];
    });

    let possible = false;
    if(tmpArr.indexOf(val) < 0) {
      possible = true;
    } else {
      if(String(tmpArr[tmpArr.indexOf(val)]) == oldValue) {
        possible = true;
      } else {
        possible = false;
      }
    }

    if(possible) {
      let idx = Number(e.target.id.split("_")[1]);
      $lists["buttons"][idx - 1]["key"] = val;
      oldValue = val;
    } else {
      // alert("ERROR");
      document.getElementById("modal-open-btn").click();
      e.target.value = oldValue;
    }
  }

  const onChangeMessage = e => {
    let val = e.target.value;
    let idx = Number(e.target.id.split("_")[1]);
    $lists["buttons"][idx - 1]["message_" + langValue] = val;
  }

  function openDialog(type, e) {
    let seq = e.target.id.split('list_')[1];
    if(type == 'img') {
      filter = 'jpg,jpeg,png';
    } else if(type == 'sound') {
      filter = 'mp3';
    }
    open({
      title: 'My wonderful open dialog',
      defaultPath,
      filters: filter
        ? [
            {
              name: "Tauri Example",
              extensions: filter.split(",").map((f) => f.trim()),
            },
          ]
        : [],
      multiple,
      directory,
    }).then(function (res) {
      if (Array.isArray(res)) {
        console.log(res);
      } else {
        var pathToRead = res;
        var isFile = pathToRead.match(/\S+\.\S+$/g);
        readBinaryFile(pathToRead).then(function (response) {
          if (isFile) {
            if (pathToRead.includes(".png") || pathToRead.includes(".jpg") || pathToRead.includes(".jpeg")) {
              let arrPath = res.split(sep);
              let fileName = arrPath[arrPath.length - 1];
              let ext = fileName.split('.')[1];

              copyFile(
                res,
                "medical-sound-data/images/img_" + seq + "." + ext,
                {
                  dir: dir
                }
              );
              $lists["buttons"][seq - 1]["image"] = seq + "." + ext;
              document.getElementById('imgname_' + (seq)).textContent = seq + "." + ext;
            }
            if (pathToRead.includes(".mp3")) {
              let arrPath = res.split(sep);
              let fileName = arrPath[arrPath.length - 1];
              let ext = fileName.split('.')[1];

              copyFile(
                res,
                "medical-sound-data/sounds/" + langValue + "_" + seq + "." + ext,
                {
                  dir: dir
                }
              );
            }
          }
        });
      }
    });
  }
</script>

<div>
  <div class="px-4 py-4 overflow-x-auto">
    <h3 class="px-2 mb-4 text-lg font-medium leading-6 text-white">설정</h3>

    <table class="table w-full mb-8 table-compact">
      <thead>
        <tr>
          <th class="w-40 text-center text-white">기능</th>
          <th class="text-center text-white">단축키</th>
        </tr>
      </thead>
      <tbody>
        <tr class="h-14">
          <td class="text-center text-white">앱 활성화키</td>
          <td>
            <input class="w-auto text-center text-gray-900 bg-white kbd kbd-md" on:keyup={onInvokeKeyUp} on:keypress={onIKnvokeKey} value={invokeKey} />
            <span class="ml-4 text-white"><kbd class="kbd">Shift</kbd> 또는 <kbd class="kbd">Ctrl</kbd> 키 <kbd class="kbd">+</kbd> 숫자(<kbd class="kbd">0</kbd>~<kbd class="kbd">9</kbd>) 또는 영문(<kbd class="kbd">a</kbd>~<kbd class="kbd">z</kbd>) 조합으로 사용 가능합니다.</span>
          </td>
        </tr>
        <tr class="h-14">
          <td class="text-center text-white">언어 변경키</td>
          <td>
            <input class="w-auto text-center text-gray-900 bg-white kbd kbd-md" on:keyup={onLangKeyUp} on:keypress={onLangKey} value={langKey} />
            <span class="ml-4 text-white"><kbd class="kbd">Shift</kbd> 또는 <kbd class="kbd">Ctrl</kbd> 키 <kbd class="kbd">+</kbd> 숫자(<kbd class="kbd">0</kbd>~<kbd class="kbd">9</kbd>) 또는 영문(<kbd class="kbd">a</kbd>~<kbd class="kbd">z</kbd>) 조합으로 사용 가능합니다.</span>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table w-full table-zebra table-compact mb-8">
      <thead>
        <tr>
          <th colspan="10" class="text-white text-center">언어 설정</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        {#each _langLists as lang }
          <td class="w-3 text-center">
            <input
              type="checkbox"
              checked={lang.published}
              on:click={onChangeLangPublished}
              id="langPublished_{lang.id}"
              class="checkbox" />
          </td>
        {/each}
        </tr>
        <tr>
        {#each _langLists as lang }
          <td class="w-3">
            <input
              type="text" name="number" id="langName_{lang.id}"
              class="flex items-center w-full h-8 font-semibold text-center text-gray-700 bg-white outline-none focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
              maxlength="8"
              value={lang.name}
              on:blur={onChangeLangName}
              placeholder={lang.name}>
          </td>
        {/each}
        </tr>
      </tbody>
    </table>

    <table class="table w-full table-zebra table-compact">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-20 text-center text-white ">순서</th>
          <th class="w-20 text-center text-white ">사용</th>
          <th class="w-20 text-center text-white ">키</th>
          <th class="text-center text-white w-36">이미지</th>
          <th class="text-center text-white w-36">음성</th>
          <th class="text-center text-white ">메시지</th>
        </tr>
      </thead>
      <tbody>
        {#each _lists as list, index }
        <tr class="h-14">
          <td class="text-center text-white">{list.id}</td>
          <td class="text-center">
            <input
              type="checkbox"
              checked={list.published}
              on:click={onChangePublished}
              id="published_{list.id}"
              class="checkbox" />
          </td>
          <td class="text-center">
            <input
              type="text" name="number" id="hotkey_{index+1}"
              class="flex items-center w-full h-8 font-semibold text-center text-gray-700 bg-white outline-none focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
              maxlength="2"
              value={list.key}
              on:focus={onHotKeyFocusIn}
              on:blur={onHotKeyFocusOut}
              on:input={onHotKey}
              placeholder={list.key}>
          </td>
          <td class="text-center">
            <span id="imgname_{index + 1}" class="text-white ">{list.image}</span>
            <button
              class="h-4 text-white btn btn-xs btn-outline"
              id="img_list_{list.id}"
              on:click={(e) => openDialog('img', e)}>변경</button>
          </td>

          <td class="text-center text-white">
            <span class="inline-flex align-middle">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </span>
            <span class="inline-flex">
              {langValue}_{list["sound"]}
            </span>
            <span class="inline-flex">
              <button
              class="h-4 text-white btn btn-xs btn-outline"
              id="sound_list_{list.id}"
              on:click={(e) => openDialog('sound', e)}>변경</button>
            </span>
          </td>

          <td class="text-center">
            <input
              type="text" name="message" id="message_{index + 1}"
              class="flex items-center w-full h-8 px-2 text-left text-gray-700 bg-white outline-none fon2-semibold focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
              value={list.message}
              on:blur={onChangeMessage}
              placeholder={list.message}>
          </td>

        </tr>
        {/each}
      </tbody>
    </table>
  </div>


  <!-- The button to open modal -->
  <label id="modal-open-btn" for="my-modal" class="hidden btn modal-button">open modal</label>

  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">단축키 충돌</h3>
      <p id="modal-message" class="py-4">이미 존재하는 단축키를 제외하고 설정해주시기 바랍니다.</p>
      <div class="modal-action">
        <label for="my-modal" class="btn">닫기</label>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">

</style>
