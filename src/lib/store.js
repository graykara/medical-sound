import { writable } from 'svelte/store';

export let langCode = writable('ko');
export let volumeEnable = writable(true);
export let audio = new Audio();

let source = document.createElement('source');
source.type = "audio/mpeg";
audio.appendChild(source);
