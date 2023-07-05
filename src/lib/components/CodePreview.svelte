<script lang="ts">
  export let code: string;
  export let onRun: (code: string) => void;

  let editMode: boolean = false;
  let codeElement: HTMLElement;
</script>

<div class="divider" />
<div>
  <h3 class="text-lg inline-block">Check the code</h3>
  <button
    class="btn btn-ghost inline-block w-min"
    on:click={() => (editMode = !editMode)}
    on:keypress={() => (editMode = !editMode)}
  >
    {editMode ? "done" : "edit"}
  </button>
</div>
<div
  class="mockup-code text-sm focus:outline-none"
  class:bg-base-200={editMode}
  on:dblclick={() => (editMode = true)}
>
  <pre
    class="ml-4"
    on:click={() => codeElement && codeElement.focus()}
    on:keypress={() => codeElement && codeElement.focus()}>
  {#if editMode}
      <code contenteditable bind:textContent={code} bind:this={codeElement} />
    {:else}
      <code>{code}</code>
    {/if}
    </pre>
</div>

<button
  class="btn btn-primary w-fit mx-auto"
  on:click={() => {
    onRun(code);
  }}
>
  run code
</button>
