<script lang="ts">
  import { onMount } from "svelte";
  import { HF_ACCESS_TOKEN, OPENAI_API_KEY, HF_ENDPOINT } from "$lib/store";
  import { goto } from "$app/navigation";

  export let dialogElement: HTMLDialogElement;

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
      localStorage.setItem("HF_ENDPOINT", $HF_ENDPOINT);
      goto("/");
    }
  }}
>
  <form
    method="dialog"
    class="modal-box bg-base-300 shadow-xl border-base-content border-2"
  >
    <h3 class="font-bold text-xl pb-5">API keys needed</h3>
    <div class="w-full flex flex-col">
      <form aria-label="HF API" class="form-control">
        <div>
          <h3 class="font-bold inline">HF API Token</h3>
          <span class="inline text-base-content">*</span>
        </div>

        <label for="hf_key" class="label-text pb-2">
          In order for this demo to work you need your HF API token.
        </label>
        <input
          class="input input-primary"
          name="hf_key"
          type="text"
          placeholder="hf_***"
          bind:value={$HF_ACCESS_TOKEN}
        />
      </form>
      <div class="divider" />
      <form aria-label="HF ENDPOINT" class="form-control">
        <h3 class="font-bold">HF Inference endpoint</h3>
        <label for="hf_endpoint" class="label-text pb-2">
          Optionally you can specify a HF inference endpoint. If you leave this
          empty the default endpoint will be used.
        </label>
        <input
          class="input"
          name="hf_endpoint"
          type="text"
          placeholder="http://***"
          bind:value={$HF_ENDPOINT}
        />
      </form>
      <div class="divider" />
      <form aria-label="OPENAI API" class="form-control">
        <h3 class="font-bold">OpenAI key</h3>
        <label for="oai_key" class="label-text pb-2">
          Optionally you can add your OpenAI key to use it as your LLM.
        </label>
        <input
          class="input"
          name="oai_key"
          type="text"
          placeholder="sk-***"
          bind:value={$OPENAI_API_KEY}
        />
      </form>
    </div>
    <div class="modal-action">
      <button class="btn btn-neutral w-fit mx-auto">Close</button>
    </div>
  </form>
</dialog>
