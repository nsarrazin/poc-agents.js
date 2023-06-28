<script lang="ts">
  import type { LLM } from "$lib/types";
  import { LLMs } from "$lib/agents/llm";
  export let llm: LLM;
</script>

<h3 class="text-lg">Select your LLM</h3>

<div class="join mx-auto gap-5">
  {#each LLMs as llmOption}
    <label
      class="label cursor-pointer"
      on:click={() => (llm = llmOption)}
      on:keypress={() => (llm = llmOption)}
    >
      <span class="label-text pr-2">{llmOption.name}</span>
      <input
        type="radio"
        name="radio-10"
        class="radio checked:bg-primary-500"
        checked
      />
    </label>
  {/each}
</div>
