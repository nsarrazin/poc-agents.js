<script lang="ts">
  import type { Data } from "../../app";

  export let data: Data | Array<Data>;

  const isBlob = (message: string | Blob): message is Blob => {
    return message instanceof Blob;
  };
</script>

<!-- if its an array recursively render for each children of the array -->
<div class="w-full">
  {#if Array.isArray(data)}
    {#each data as el}
      <svelte:self data={el} />
      <div class="divider" />
    {/each}
  {:else if !!data && isBlob(data)}
    {#if data.type.startsWith("image")}
      <div class="mx-auto border-2 border-neutral-focus w-full">
        <img
          class="p-1 w-fit"
          alt="generated"
          src={URL.createObjectURL(data)}
        />
      </div>
    {:else if data.type.startsWith("audio")}
      <audio controls src={URL.createObjectURL(data)} />
    {:else}
      <p class="text-mono text-light w-full">blob type unknown</p>
    {/if}
  {:else if !!data}
    <p class="text-mono mx-auto text-light w-full">{data}</p>
  {/if}
</div>
