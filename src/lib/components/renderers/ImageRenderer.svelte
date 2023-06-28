<script lang="ts">
	export let data: Promise<Blob>;
</script>

{#await data}
	<p>... loading img ...</p>
{:then img}
	<img src={URL.createObjectURL(img)} alt="generated" class="px-10" />
{/await}
