<script lang="ts">
  import { onMount } from "svelte";
  import { HF_ACCESS_TOKEN } from "$lib/store";
  import { goto } from "$app/navigation";

  export let dialogElement: HTMLDialogElement;
</script>

<dialog
  id="api_modal"
  class="modal"
  bind:this={dialogElement}
  on:close={() => {
    localStorage.setItem("HF_ACCESS_TOKEN", $HF_ACCESS_TOKEN);
    goto("/");
  }}
>
  <form
    method="dialog"
    class="modal-box bg-base-300 shadow-xl border-base-content border-2"
  >
    <div class="w-full flex flex-col">
      <form aria-label="HF API" class="form-control">
        <div>
          <h3 class="font-bold text-xl inline">HuggingFace API Token</h3>
        </div>

        <label for="hf_key" class="label-text pb-4 pt-4">
          You can optionally input your HF API token here. This will improve
          rate limits in the demo. Get your token <a
            href="https://huggingface.co/settings/tokens"
            class="link">here</a
          >.
        </label>
        <input
          class="input input-primary"
          name="hf_key"
          type="text"
          placeholder="hf_***"
          bind:value={$HF_ACCESS_TOKEN}
        />
      </form>
    </div>
    <div class="modal-action">
      <button class="btn btn-neutral w-fit mx-auto">Close</button>
    </div>
  </form>
</dialog>
