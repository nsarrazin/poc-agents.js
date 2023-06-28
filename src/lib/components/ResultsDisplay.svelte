<script lang="ts">
    export let messages: Array<{ message: string; data: string | Blob | undefined }>;

	const isBlob = (message: string | Blob): message is Blob => {
		return message instanceof Blob;
	};
    
</script>

<div class="join join-vertical w-full">
    {#each messages as message}
        <div class="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="my-accordion-4" checked={true} />
            <div class="collapse-title text-xl font-medium">
                {message.message}
            </div>
            <div class="collapse-content">
                {#if !!message.data && isBlob(message.data)}
                    {#if message.data.type.startsWith('image')}
                        <img class="mx-auto" alt="generated" src={URL.createObjectURL(message.data)} />
                    {:else if message.data.type.startsWith('audio')}
                        <audio controls src={URL.createObjectURL(message.data)} />
                    {:else}
                        <p class="text-mono text-light w-full">blob type unknown</p>
                    {/if}
                {:else if !!message.data}
                    <p class="text-mono text-light w-full">{message.data}</p>
                {/if}
            </div>
        </div>
    {/each}
</div>
