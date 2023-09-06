<script lang="ts">
  import { webSearch } from "$lib/WebSearchTool";
  import { defaultTools } from "@huggingface/agents";
  export let selectedTools: Array<string> = [];

  const tools = [...defaultTools, webSearch];
</script>

<div class="w-fit mx-auto">
  <h3 class="text-lg pb-3">Select your tools</h3>

  <div class="join mx-auto grid grid-cols-5 gap-3">
    {#each tools as tool}
      <label class="label cursor-pointer gap-2">
        <span class="label-text">
          {tool.name}
        </span>
        <input
          class="checkbox"
          type="checkbox"
          bind:group={selectedTools}
          name="tools"
          value={tool.name}
        />
      </label>
    {/each}
  </div>

  <div class="mx-auto w-fit mt-2">
    {#if selectedTools.length === tools.length}
      <button
        class="btn btn-ghost inline-block w-fit btn-sm"
        on:click={() => (selectedTools = [])}>clear</button
      >
    {:else}
      <button
        class="btn btn-ghost inline-block w-fit btn-sm"
        on:click={() => (selectedTools = tools.map((el) => el.name))}
        >select all</button
      >
    {/if}
  </div>
</div>
