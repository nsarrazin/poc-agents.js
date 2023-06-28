<script lang="ts">
  export let files: FileList | null = null;
</script>

<div class="grid grid-cols-2 gap-5">
  <div class="form-control">
    <label class="label">
      <span class="label-text">
        {#if files && files.length > 0}
          {files[0].type.split("/")[0]} detected
          <button class="btn-sm btn btn-ghost" on:click={() => (files = null)}
            >clear
          </button>
        {:else}
          Upload a file (image or audio)
        {/if}
      </span>
    </label>
    <input
      type="file"
      bind:files
      accept="audio/*, image/*"
      class="mt-auto file-input file-input-bordered max-w-xs"
      class:file-input-primary={files && files.length > 0}
    />
  </div>
</div>
