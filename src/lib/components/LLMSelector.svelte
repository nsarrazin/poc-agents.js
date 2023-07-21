<script lang="ts">
  export let llm: "openai" | "hf";
</script>

<h3 class="text-lg">Select your LLM</h3>

<div class="join mx-auto gap-5">
  <label
    class="label cursor-pointer"
    on:click={() => (llm = "openai")}
    on:keypress={() => (llm = "openai")}
  >
    <span class="label-text pr-2">OpenAI</span>
    <input
      type="radio"
      name="radio-10"
      class="radio checked:bg-primary-500"
      checked
    />
  </label>
  <label
    class="label cursor-pointer"
    on:click={() => (llm = "hf")}
    on:keypress={() => (llm = "hf")}
  >
    <span class="label-text pr-2">Hugging Face</span>
    <input
      type="radio"
      name="radio-10"
      class="radio checked:bg-primary-500"
      checked
    />
  </label>
</div>
