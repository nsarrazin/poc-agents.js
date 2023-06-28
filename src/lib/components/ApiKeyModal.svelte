<script lang="ts">
  import { onMount } from "svelte";
  import { HF_ACCESS_TOKEN, OPENAI_API_KEY } from "$lib/store";
  import { goto } from "$app/navigation";

  let dialogElement: HTMLDialogElement;

  onMount(() => {
    if ($HF_ACCESS_TOKEN === "") {
      dialogElement.showModal();
    }
  });
</script>

<dialog
  id="api_modal"
  class="modal"
  bind:this={dialogElement}
  on:close={() => {
    if ($HF_ACCESS_TOKEN === "") {
      dialogElement.showModal();
    } else {
      localStorage.setItem("HF_ACCESS_TOKEN", $HF_ACCESS_TOKEN);
      localStorage.setItem("OPENAI_API_KEY", $OPENAI_API_KEY);
      goto("/");
    }
  }}
>
  <form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">API keys needed</h3>
    <div class="w-full flex flex-col gap-5">
      <form aria-label="HF API" class="form-control">
        <p class="py-4">
          In order for this demo to work you need your API token from HF.
        </p>
        <label for="hf_key" class="label-text pb-2">HF API token</label>
        <input
          class="input input-primary"
          name="hf_key"
          type="text"
          placeholder="hf_***"
          bind:value={$HF_ACCESS_TOKEN}
        />
      </form>
      <form aria-label="OPENAI API" class="form-control">
        <p class="py-4">
          Optionally you can add your OpenAI key to use it as your LLM.
        </p>

        <label for="oai_key" class="label-text pb-2">OpenAI API key</label>
        <input
          class="input input-primary"
          name="oai_key"
          type="text"
          placeholder="sk-***"
          bind:value={$OPENAI_API_KEY}
        />
      </form>
    </div>
    <div class="modal-action">
      <button class="btn">Close</button>
    </div>
  </form>
</dialog>
