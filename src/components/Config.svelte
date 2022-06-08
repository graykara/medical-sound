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

  let _lists;
  _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);

  let oldValue;

  let key_of_invoke;
  let key_of_lang;

  let shortcut = $lists["invoke_key"];

  // 언어설정
  let _language = "한국어";
  let _langCode = "ko";
  let _show = false;

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
      // unregister(key_of_lang);
      // registerShortcut(key_of_lang, () => {
      //   let _target;
      //   if(_langCode == "ko") {
      //     _target = "th";
      //   } else {
      //     _target = "ko";
      //   }
      //   console.log("TARGET", _target);
      //   changeLanguage(_target);
      // });
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

          {#if langValue == "ko"}
            <td class="text-center text-white">
              {list.sound_ko}
              <button
              class="h-4 text-white btn btn-xs btn-outline"
              id="sound_list_{list.id}"
              on:click={(e) => openDialog('sound', e)}>변경</button>
            </td>
          {/if}

          {#if langValue == "th"}
            <td class="text-center text-white">
              {list.sound_th}
              <button
              class="h-4 text-white btn btn-xs btn-outline"
              id="sound_list_{list.id}"
              on:click={(e) => openDialog('sound', e)}>변경</button>
            </td>
          {/if}

          <td class="text-center">
            <input
              type="text" name="message_ko" id="message_{index + 1}"
              class="flex items-center w-full h-8 px-2 text-left text-gray-700 bg-white outline-none fon2-semibold focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
              value={list.message_ko}
              on:blur={onChangeMessage}
              placeholder={list.message_ko}>
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
