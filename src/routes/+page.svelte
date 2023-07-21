<script lang="ts">
  import LogoHuggingFaceBorderless from "$lib/components/LogoHuggingFaceBorderless.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import ToolSelector from "$lib/components/ToolSelector.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";
  import ResultsDisplay from "$lib/components/ResultsDisplay.svelte";
  import LlmSelector from "$lib/components/LLMSelector.svelte";
  import { HF_ACCESS_TOKEN, HF_ENDPOINT, OPENAI_API_KEY } from "$lib/store";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";
  import { HfAgent, LLMFromEndpoint, defaultTools } from "@huggingface/agents";
  import { LLMFromHub } from "@huggingface/agents";
  import { LLMFromOpenAI } from "$lib/LLMFromOpenAI";

  let prompt =
    "Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud.";
  let selectedTools: Array<string> = [];

  let llm: "hf" | "openai" = "hf";

  let codePromise: Promise<string> | null = null;
  let code: string = "";
  let messages: Array<{ message: string; data: string | Blob | undefined }> =
    [];

  let files: FileList | undefined;

  let isLoading = false;

  const getLLM = () => {
    if (llm === "hf") {
      return $HF_ENDPOINT
        ? LLMFromEndpoint($HF_ACCESS_TOKEN, $HF_ENDPOINT)
        : LLMFromHub($HF_ACCESS_TOKEN);
    } else if (llm === "openai") {
      return LLMFromOpenAI($OPENAI_API_KEY);
    }
  };

  const onGenerate = async () => {
    const agent = new HfAgent(
      $HF_ACCESS_TOKEN,
      getLLM(),
      defaultTools.filter((el) => selectedTools.includes(el.name))
    );

    messages = [];

    codePromise = agent.generateCode(prompt, files);
    code = await codePromise;
  };

  const onRun = async (code: string) => {
    isLoading = true;
    messages = [];

    const agent = new HfAgent(
      $HF_ACCESS_TOKEN,
      getLLM(),
      defaultTools.filter((el) => selectedTools.includes(el.name))
    );

    messages = await agent.evaluateCode(code, files);
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
