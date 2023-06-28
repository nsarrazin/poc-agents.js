<script lang="ts">
    import { tools } from '$lib/agents/tools';
    export let selectedTools: Array<string> = [];
</script>

    <h3 class="text-lg w-fit mx-auto">Select your tools</h3>

<div class="w-fit mx-auto">

<div class="join mx-auto inline-block">
    {#each tools as tool}
        <label
            class="form-switch join-item btn normal-case btn-sm"
            class:btn-info={selectedTools.includes(tool.name)}
        >
            <input
                class="hidden"
                type="checkbox"
                bind:group={selectedTools}
                name="tools"
                value={tool.name}
            />
            {tool.name}
        </label>
    {/each}
</div>
{#if selectedTools.length === tools.length}
<button class='btn btn-ghost inline-block w-fit btn-sm' on:click={() => (selectedTools = [])}>clear</button>
{:else}
<button class='btn btn-ghost inline-block w-fit btn-sm' on:click={() => (selectedTools = tools.map((el) => el.name))}>select all</button>
{/if}
</div>
