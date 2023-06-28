<script lang="ts">
	export let data: Promise<Blob>;
</script>

{#await data}
	<p>... loading audio ...</p>
{:then audio}
	<audio controls>
		<source src={URL.createObjectURL(audio)} type="audio/mpeg" />
	</audio>
{/await}
