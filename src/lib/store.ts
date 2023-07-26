import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Set the stored value or a sane default.
export const HF_ACCESS_TOKEN = writable(
  (browser && localStorage.HF_ACCESS_TOKEN) || ""
);

if (browser) {
  HF_ACCESS_TOKEN.subscribe((value) => (localStorage.content = value));
}
