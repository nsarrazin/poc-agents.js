<script lang="ts">
    export let codePromise: Promise<string>
    export let onRun: (code: string) => void;
</script>

{#await codePromise}
    <div class="loading loading-lg mx-auto" />
{:then code}
    <div class="mockup-code text-sm">
        <pre class="ml-4"><code>{code}</code></pre>
    </div>

    <button
        class="btn btn-primary w-fit mx-auto"
        on:click={() => {
            onRun(code);
        }}
    >
        run code
    </button>
{/await}
