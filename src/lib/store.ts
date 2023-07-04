import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Set the stored value or a sane default.
export const HF_ACCESS_TOKEN = writable(
  (browser && localStorage.HF_ACCESS_TOKEN) || ""
);

export const OPENAI_API_KEY = writable(
  (browser && localStorage.OPENAI_API_KEY) || ""
);

export const HF_ENDPOINT = writable(
  (browser && localStorage.HF_ENDPOINT) || ""
);

if (browser) {
  HF_ACCESS_TOKEN.subscribe((value) => (localStorage.content = value));
  OPENAI_API_KEY.subscribe((value) => (localStorage.content = value));
  HF_ENDPOINT.subscribe((value) => (localStorage.content = value));
}
