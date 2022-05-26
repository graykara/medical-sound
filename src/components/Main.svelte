<script>
  import { desktopDir, join } from '@tauri-apps/api/path';
  import { convertFileSrc } from '@tauri-apps/api/tauri'
  import {} from '@tauri-apps/api/window'

  import { lists } from '../lib/store';

  // let obj = $lists["buttons"];
  // let _lists;

  let obj = $lists["buttons"];
  let _lists;
  let _images = [];
  let img_1;
  let img_2;
  let img_3;
  let img_4;
  let img_5;
  let img_6;
  let img_7;
  let img_8;
  let img_9;

  if(obj == undefined) {
    console.log('default');
    _lists = [
      {
        id: "1",
        key: "1",
        image: "1.png",
        sound_ko: "ko_1.mp4",
        sound_th: "th_1.mp4",
        message_ko: "메시지를 읽으세요 - 1",
        message_th: "메시지를 읽으세요 - 1"
      },
      {
        id: "2",
        key: "2",
        image: "2.png",
        sound_ko: "ko_2.mp4",
        sound_th: "th_2.mp4",
        message_ko: "메시지를 읽으세요 - 2",
        message_th: "메시지를 읽으세요 - 2"
      },
      {
        id: "3",
        key: "3",
        image: "3.png",
        sound_ko: "ko_3.mp4",
        sound_th: "th_3.mp4",
        message_ko: "메시지를 읽으세요 - 3",
        message_th: "메시지를 읽으세요 - 3"
      },
      {
        id: "4",
        key: "4",
        image: "4.png",
        sound_ko: "ko_4.mp4",
        sound_th: "th_4.mp4",
        message_ko: "메시지를 읽으세요 - 4",
        message_th: "메시지를 읽으세요 - 4"
      },
      {
        id: "5",
        key: "5",
        image: "5.png",
        sound_ko: "ko_5.mp4",
        sound_th: "th_5.mp4",
        message_ko: "메시지를 읽으세요 - 5",
        message_th: "메시지를 읽으세요 - 5"
      },
      {
        id: "6",
        key: "6",
        image: "6.png",
        sound_ko: "ko_6.mp4",
        sound_th: "th_6.mp4",
        message_ko: "메시지를 읽으세요 - 6",
        message_th: "메시지를 읽으세요 - 6"
      },
      {
        id: "7",
        key: "7",
        image: "7.png",
        sound_ko: "ko_7.mp4",
        sound_th: "th_7.mp4",
        message_ko: "메시지를 읽으세요 - 7",
        message_th: "메시지를 읽으세요 - 7"
      },
      {
        id: "8",
        key: "8",
        image: "8.png",
        sound_ko: "ko_8.mp4",
        sound_th: "th_8.mp4",
        message_ko: "메시지를 읽으세요 - 8",
        message_th: "메시지를 읽으세요 - 8"
      },
      {
        id: "9",
        key: "9",
        image: "9.png",
        sound_ko: "ko_9.mp4",
        sound_th: "th_9.mp4",
        message_ko: "메시지를 읽으세요 - 9",
        message_th: "메시지를 읽으세요 - 9"
      }
    ];
  } else {
    _lists = Object.keys(obj).map((key) => [Number(key), obj[key]][1]);
  }

  let audio = new Audio();

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
    if(!_id.classList.contains("grayscale")) {
      _id.classList.add("grayscale");

      let file = "ko_"+id+".mp3";

      getSoundFile(file).then(res => {
        let _src = convertFileSrc(res.toString());

        if(audio.canPlayType('audio/mpeg')) {
          audio.setAttribute("src", _src)
          console.log(_src);
          console.log(img_1);
          // audio.pause();
          // audio.currentTime = 0;
          // audio.play();
        }
      });
    }
  }

  setImageFile("img_1.png").then(res => { let _src = convertFileSrc(res.toString()); img_1 = _src; });
  setImageFile("img_2.png").then(res => { let _src = convertFileSrc(res.toString()); img_2 = _src; });
  setImageFile("img_3.png").then(res => { let _src = convertFileSrc(res.toString()); img_3 = _src; });
  setImageFile("img_4.png").then(res => { let _src = convertFileSrc(res.toString()); img_4 = _src; });
  setImageFile("img_5.png").then(res => { let _src = convertFileSrc(res.toString()); img_5 = _src; });
  setImageFile("img_6.png").then(res => { let _src = convertFileSrc(res.toString()); img_6 = _src; });
  setImageFile("img_7.png").then(res => { let _src = convertFileSrc(res.toString()); img_7 = _src; });
  setImageFile("img_8.png").then(res => { let _src = convertFileSrc(res.toString()); img_8 = _src; });
  setImageFile("img_9.png").then(res => { let _src = convertFileSrc(res.toString()); img_9 = _src; });

  for(let i = 1; i <= 9; i++) {
    setImageFile("img_" + i + ".png").then(res => {
      let _src = convertFileSrc(res.toString());
      _images.push(_src);
      console.log(_images.length)
    });

  }

  // function init() {
  //   console.log('INIT', document.getElementsByTagName("img"));
  //   for(var i = 1; i <= 9; i++) {
  //     setImageFile("img_" + i + ".png").then(res => {
  //       let _src = convertFileSrc(res.toString());
  //       _images.push(_src);
  //       // console.log("SRC", _src);
  //       // sleep(1000);
  //       // console.log('IMG', document.getElementById("img_" + i));
  //       // document.getElementById("img_" + i).setAttribute("src", _src);
  //     });
  //   }



  //   console.log('END', document.getElementsByTagName("img"));
  // }

  // console.log("GG");

  // init();

  // init().then((res) => {
  //   console.log(document.getElementsByName("img"))
  //   console.log(_images);
  // });
</script>

<div id="main-contents" class="flex px-8 py-8 bg-sky-100">

  <!-- {#await init then } -->
    <!-- {#each _lists as list, index}
    <div class="relative">
      <span class="absolute z-20 text-red-900 left-4 top-2">{list.id}</span>
      <div class="tooltip tooltip-bottom" data-tip="{list.message_ko}">
        <div id="btn_{list.id}" class="z-10 btn-info main_btn" on:click={() => handleClick(list.id)}>
          <Image list={list} image={_images[index]}>
          </Image>
        </div>
      </div>
    </div>
    {/each} -->
  <!-- {/await} -->

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[0].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[0].message_ko}">
      <div id="btn_{_lists[0].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[0].id)}>
        <img id="img_{_lists[0].id}" class="object-cover rounded-2xl shadow-xl" src={img_1} alt="{_lists[0].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[1].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[1].message_ko}">
      <div id="btn_{_lists[1].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[1].id)}>
        <img id="img_{_lists[1].id}" class="object-cover rounded-2xl shadow-xl" src={img_2} alt="{_lists[1].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[2].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[2].message_ko}">
      <div id="btn_{_lists[2].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[2].id)}>
        <img id="img_{_lists[2].id}" class="object-cover rounded-2xl shadow-xl" src={img_3} alt="{_lists[2].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[3].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[3].message_ko}">
      <div id="btn_{_lists[3].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[3].id)}>
        <img id="img_{_lists[3].id}" class="object-cover rounded-2xl shadow-xl" src={img_4} alt="{_lists[3].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[4].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[4].message_ko}">
      <div id="btn_{_lists[4].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[4].id)}>
        <img id="img_{_lists[4].id}" class="object-cover rounded-2xl shadow-xl" src={img_5} alt="{_lists[4].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[5].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[5].message_ko}">
      <div id="btn_{_lists[5].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[5].id)}>
        <img id="img_{_lists[5].id}" class="object-cover rounded-2xl shadow-xl" src={img_6} alt="{_lists[5].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[6].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[6].message_ko}">
      <div id="btn_{_lists[6].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[6].id)}>
        <img id="img_{_lists[6].id}" class="object-cover rounded-2xl shadow-xl" src={img_7} alt="{_lists[6].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[7].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[7].message_ko}">
      <div id="btn_{_lists[7].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[7].id)}>
        <img id="img_{_lists[7].id}" class="object-cover rounded-2xl shadow-xl" src={img_8} alt="{_lists[7].id}" />
      </div>
    </div>
  </div>

  <div class="relative">
    <span class="absolute z-20 text-red-900 left-4 top-2">{_lists[8].id}</span>
    <div class="tooltip tooltip-bottom" data-tip="{_lists[8].message_ko}">
      <div id="btn_{_lists[8].id}" class="z-10 btn-info main_btn" on:click={() => handleClick(_lists[8].id)}>
        <img id="img_{_lists[8].id}" class="object-cover rounded-2xl shadow-xl" src={img_9} alt="{_lists[8].id}" />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .main_btn {
		@apply btn btn-outline w-32 h-32 mx-1 p-1 rounded-2xl bg-white;
	}
</style>
