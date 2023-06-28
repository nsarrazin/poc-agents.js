<script lang="ts">
	import LogoHuggingFaceBorderless from '$lib/components/LogoHuggingFaceBorderless.svelte';
	import { generateCode } from '$lib/agents/generateCode';
	import { tools } from '$lib/agents/tools';
	import { evalBuilder } from '$lib/agents/evalBuilder';

	let prompt = 'Draw a picture of a brown dog. Then caption the picture and read it out loud.';
	let selectedTools: Array<string> = [];
	let codePromise: Promise<string> | null = null;
	let messages: Array<{ message: string; data: string | Blob | undefined }> = [];

	let files: FileList | null = null;

	let isLoading = false;
	const onGenerate = async () => {
		messages = [];
		codePromise = generateCode(
			prompt,
			tools.filter((el) => el.name === 'message' || selectedTools.includes(el.name)),
			files
		);
	};

	const onRun = async (code: string) => {
		messages = [];

		const wrapperEval = await evalBuilder(
			code,
			tools.filter((el) => el.name === 'message' || selectedTools.includes(el.name)),
			files,
			(message, data) => {
				messages = [...messages, { message, data }];
			}
		);

		isLoading = true;
		await wrapperEval();
		isLoading = false;
	};

	const isBlob = (message: string | Blob): message is Blob => {
		return message instanceof Blob;
	};
</script>

<div class="flex flex-col space-y-4 max-w-xl">
	<div class="flex flex-row justify-around">
		<LogoHuggingFaceBorderless classNames="text-4xl" />
		<h1 class="text-3xl font-semibold w-fit mx-auto">Agents.js</h1>
	</div>
	<div class="divider" />
	<h3 class="text-lg w-fit mx-auto">Select your tools</h3>

	<div class="join mx-auto">
		{#each tools.filter((tool) => tool.name != 'message') as tool}
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
	<div class="divider" />
	<span class="label-text"> Input your request </span>

	<textarea
		class="textarea border-base-300 bg-base-300"
		placeholder="Ask something here"
		bind:value={prompt}
	/>

	<div class="grid grid-cols-2 gap-5">
		<div class="form-control">
			<label class="label">
				<span class="label-text">
					{#if files && files.length > 0}
						{files[0].type.split('/')[0]} detected
						<button class="btn-sm btn btn-ghost" on:click={() => (files = null)}>clear </button>
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

		<button
			class="btn btn-primary mt-auto"
			on:click={onGenerate}
			on:keypress={onGenerate}
			disabled={selectedTools.length === 0}>generate</button
		>
	</div>

	{#if codePromise}
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
	{/if}
	<div class="divider" />
	{#if isLoading}
		<div class="loading loading-lg mx-auto" />
	{:else if messages.length > 0}
		<h3 class="text-lg w-fit mx-auto">Results</h3>
	{/if}
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
</div>
