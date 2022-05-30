<script>
  import { lists, langCode } from '../lib/store';

  import { open } from "@tauri-apps/api/dialog";

  import { BaseDirectory, copyFile, readBinaryFile } from "@tauri-apps/api/fs";
  import { sep } from '@tauri-apps/api/path';

  const dir = BaseDirectory.Desktop;

  let defaultPath = null;
  let filter = null;
  let multiple = false;
  let directory = false;

  let langValue;

  const unsubscribe = langCode.subscribe(value => {
    langValue = value;
  });

  let obj = $lists["buttons"];

  let _lists;
  _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);

  let oldValue;

  const onChangePublished = e => {
    let val = e.target.checked;
    let idx = Number(e.target.id.split("_")[1]);
    $lists["buttons"][idx - 1].published = val;
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
    <table class="table w-full table-zebra table-compact">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-20 text-center">순서</th>
          <th class="w-20 text-center">사용</th>
          <th class="w-20 text-center">키</th>
          <th class="text-center w-36">이미지</th>
          <th class="text-center w-36">음성</th>
          <th class="text-center">메시지</th>
        </tr>
      </thead>
      <tbody>
        {#each _lists as list, index }
        <tr class="h-14">
          <td class="text-center">{list.id}</td>
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
          <!-- <td>{list.key}</td> -->
          <td class="text-center">
            <span id="imgname_{index + 1}">{list.image}</span>
            <button
              class="h-4 btn btn-xs btn-outline"
              id="img_list_{list.id}"
              on:click={(e) => openDialog('img', e)}>변경</button>
          </td>

          {#if langValue == "ko"}
            <td class="text-center">
              {list.sound_ko}
              <button
              class="h-4 btn btn-xs btn-outline"
              id="sound_list_{list.id}"
              on:click={(e) => openDialog('sound', e)}>변경</button>
            </td>
            <td class="text-center">
              <input
                type="text" name="message_ko" id="message_{index + 1}"
                class="flex items-center w-full h-8 px-2 text-left text-gray-700 bg-white outline-none fon2-semibold focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
                value={list.message_ko}
                on:blur={onChangeMessage}
                placeholder={list.message_ko}>
            </td>
          {/if}

          {#if langValue == "th"}
            <td class="text-center">
              {list.sound_th}
              <button
              class="h-4 btn btn-xs btn-outline"
              id="sound_list_{list.id}"
              on:click={(e) => openDialog('sound', e)}>변경</button>
            </td>
            <td class="text-center">
              <input
                type="text" name="message_th" id="message_{index + 1}"
                class="flex items-center w-full h-8 px-2 text-left text-gray-700 bg-white outline-none fon2-semibold focus:outline-none text-md hover:text-black focus:text-black md:text-basecursor-default"
                value={list.message_th}
                on:blur={onChangeMessage}
                placeholder={list.message_th}>
            </td>
          {/if}

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
