<script lang="ts">
  import LogoHuggingFaceBorderless from "$lib/components/LogoHuggingFaceBorderless.svelte";
  import { generateCode } from "$lib/agents/generateCode";
  import { tools } from "$lib/agents/tools";
  import { evalBuilder } from "$lib/agents/evalBuilder";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import ToolSelector from "$lib/components/ToolSelector.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";
  import ResultsDisplay from "$lib/components/ResultsDisplay.svelte";
  import LlmSelector from "$lib/components/LLMSelector.svelte";
  import type { LLM } from "$lib/types";
  import { HFLLM } from "$lib/agents/llm";
  import { OPENAI_API_KEY } from "$lib/store";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";

  let prompt =
    "Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud.";
  let selectedTools: Array<string> = [];
  let llm: LLM = HFLLM;

  let codePromise: Promise<string> | null = null;
  let code: string = "";
  let messages: Array<{ message: string; data: string | Blob | undefined }> =
    [];

  let files: FileList | null = null;

  let isLoading = false;
  const onGenerate = async () => {
    messages = [];
    codePromise = generateCode(
      prompt,
      tools.filter((el) => selectedTools.includes(el.name)),
      files,
      llm
    );
    code = await codePromise;
  };

  const onRun = async (code: string) => {
    messages = [];
    const callback = (message: string, data: string | Blob | undefined) => {
      messages = [...messages, { message, data }];
    };

    const wrapperEval = await evalBuilder(
      code,
      tools.filter((el) => selectedTools.includes(el.name)),
      files,
      callback
    );

    isLoading = true;
    try {
      await wrapperEval();
    } catch (e) {
      if (e instanceof Error) {
        messages = [
          ...messages,
          { message: "An error occurred", data: e.message },
        ];
      }
    }
    isLoading = false;
  };

  let dialogElement: HTMLDialogElement;
</script>

<ApiKeyModal bind:dialogElement />

<div class="flex flex-col space-y-4 max-w-xl">
  <div class="flex flex-row">
    <LogoHuggingFaceBorderless classNames="text-4xl" />
    <h1 class="text-3xl font-semibold mx-auto">Agents.js</h1>
    <button
      class="btn btn-ghost"
      on:click={() => dialogElement.showModal()}
      on:keydown={() => dialogElement.showModal()}>API keys</button
    >
  </div>

  {#if $OPENAI_API_KEY !== ""}
    <div class="divider" />
    <LlmSelector bind:llm />
  {/if}

  <div class="divider" />

  <ToolSelector bind:selectedTools />

  <div class="divider" />

  <span class="label-text text-lg"> Input your request </span>

  <textarea
    class="textarea border-base-300 bg-base-300"
    placeholder="Ask something here"
    bind:value={prompt}
  />

  <FileUpload bind:files />

  <button
    class="btn btn-primary mt-auto w-fit mx-auto"
    on:click={onGenerate}
    on:keypress={onGenerate}
    disabled={selectedTools.length === 0}>generate</button
  >

  {#await codePromise}
    <div class="loading loading-lg mx-auto" />
  {:then}
    {#if code !== ""}
      <CodePreview bind:code {onRun} />
    {/if}
  {:catch error}
    <div class="alert alert-error mx-auto">
      <p class="font-bold">Error</p>
      <p>{error.message}</p>
    </div>
  {/await}

  <div class="divider" />

  <ResultsDisplay bind:messages />

  {#if isLoading}
    <div class="loading loading-lg mx-auto" />
  {/if}
</div>
