import { writable } from 'svelte/store';
import { getStoredPosts, saveState } from './storage';

export const lists = writable([]);
export let langCode = writable('ko');

getStoredPosts().then((res) => {
  console.log('# RES', res["buttons"])
	lists.set(res);
});

lists.subscribe((val) => {
	if (val.length !== 0) {
		saveState(JSON.stringify(val, null, 2));
	}
});
