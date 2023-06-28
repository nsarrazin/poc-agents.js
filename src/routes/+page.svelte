<script lang="ts">
	import LogoHuggingFaceBorderless from '$lib/components/LogoHuggingFaceBorderless.svelte';
	import { generateCode } from '$lib/agents/generateCode';
	import { tools } from '$lib/agents/tools';
	import { evalBuilder } from '$lib/agents/evalBuilder';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ToolSelector from '$lib/components/ToolSelector.svelte';
	import CodePreview from '$lib/components/CodePreview.svelte';
	import ResultsDisplay from '$lib/components/ResultsDisplay.svelte';

	let prompt = 'Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud.';
	let selectedTools: Array<string> = [];
	let codePromise: Promise<string> | null = null;
	let messages: Array<{ message: string; data: string | Blob | undefined }> = [];

	let files: FileList | null = null;

	let isLoading = false;
	const onGenerate = async () => {
		messages = [];
		codePromise = generateCode(
			prompt,
			tools.filter((el) => selectedTools.includes(el.name)),
			files
		);
	};

	const onRun = async (code: string) => {
		messages = [];

		const wrapperEval = await evalBuilder(
			code,
			tools.filter((el) => selectedTools.includes(el.name)),
			files,
			(message, data) => {
				messages = [...messages, { message, data }];
			}
		);

		isLoading = true;
		await wrapperEval();
		isLoading = false;
	};

</script>

<div class="flex flex-col space-y-4 max-w-xl">
	<div class="flex flex-row justify-around">
		<LogoHuggingFaceBorderless classNames="text-4xl" />
		<h1 class="text-3xl font-semibold w-fit mx-auto">Agents.js</h1>
	</div>
	<div class="divider" />
	<ToolSelector bind:selectedTools />
	<div class="divider" />
	<span class="label-text"> Input your request </span>
	<textarea
		class="textarea border-base-300 bg-base-300"
		placeholder="Ask something here"
		bind:value={prompt}
	/>
	<FileUpload bind:files/>
	<button
		class="btn btn-primary mt-auto"
		on:click={onGenerate}
		on:keypress={onGenerate}
		disabled={selectedTools.length === 0}>generate</button
	>

	{#if codePromise}
		<CodePreview bind:codePromise onRun={onRun}/>
	{/if}

	<div class="divider" />
	{#if isLoading}
		<div class="loading loading-lg mx-auto" />
	{:else if messages.length > 0}
		<h3 class="text-lg w-fit mx-auto">Results</h3>
	{/if}

	<ResultsDisplay bind:messages />
</div>
