import { writable } from 'svelte/store';
import { getStoredPosts, saveState } from './storage';

export const lists = writable([]);

getStoredPosts().then((res) => {
  console.log('# RES', res["buttons"])
	lists.set(res);
});

lists.subscribe((val) => {
	if (val.length !== 0) {
		saveState(JSON.stringify(val, null, 2));
	}
});
