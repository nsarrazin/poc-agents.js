<script lang="ts">
  import { defaultTools } from "@huggingface/agents";
  export let selectedTools: Array<string> = [];
</script>

<div class="w-fit mx-auto">
  <h3 class="text-lg pb-3">Select your tools</h3>

  <div class="join mx-auto grid grid-cols-4 gap-3">
    {#each defaultTools as tool}
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
    {#if selectedTools.length === defaultTools.length}
      <button
        class="btn btn-ghost inline-block w-fit btn-sm"
        on:click={() => (selectedTools = [])}>clear</button
      >
    {:else}
      <button
        class="btn btn-ghost inline-block w-fit btn-sm"
        on:click={() => (selectedTools = defaultTools.map((el) => el.name))}
        >select all</button
      >
    {/if}
  </div>
</div>
