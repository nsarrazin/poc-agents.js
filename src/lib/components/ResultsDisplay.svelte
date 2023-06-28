<script lang="ts">
  export let messages: Array<{
    message: string;
    data: string | Blob | undefined;
  }>;

  const isBlob = (message: string | Blob): message is Blob => {
    return message instanceof Blob;
  };
</script>

<div class="w-fit mx-auto">
  <h3 class="text-lg pb-5">Results</h3>
  <div class="space-y-5">
    {#each messages as message}
      <div class="collapse bg-base-200 collapse-plus">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          {message.message}
        </div>
        <div class="collapse-content">
          {#if !!message.data && isBlob(message.data)}
            {#if message.data.type.startsWith("image")}
              <div class="mx-auto border-2 border-neutral-focus w-full">
                <img
                  class="p-1 w-fit"
                  alt="generated"
                  src={URL.createObjectURL(message.data)}
                />
              </div>
            {:else if message.data.type.startsWith("audio")}
              <audio controls src={URL.createObjectURL(message.data)} />
            {:else}
              <p class="text-mono text-light w-full">blob type unknown</p>
            {/if}
          {:else if !!message.data}
            <p class="text-mono mx-auto text-light w-full">{message.data}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
