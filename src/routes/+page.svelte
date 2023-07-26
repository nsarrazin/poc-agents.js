<script lang="ts">
  import LogoHuggingFaceBorderless from "$lib/components/LogoHuggingFaceBorderless.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import ToolSelector from "$lib/components/ToolSelector.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";
  import ResultsDisplay from "$lib/components/ResultsDisplay.svelte";
  import { HfAgent, LLMFromHub, defaultTools } from "@huggingface/agents";
  import { PUBLIC_MODEL_NAME, PUBLIC_MODEL_URL } from "$env/static/public";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";
  import { HF_ACCESS_TOKEN } from "$lib/store";

  let prompt =
    "Draw a picture of a cat wearing a top hat and display it. Then caption the picture and read it out loud.";
  let selectedTools: Array<string> = defaultTools.map((el) => el.name);

  let llm: "hf" | "openai" = "hf";

  let codePromise: Promise<string> | null = null;
  let code: string = "";
  let messages: Array<{ message: string; data: string | Blob | undefined }> =
    [];

  let files: FileList | undefined;

  let isLoading = false;

  const onGenerate = async () => {
    messages = [];

    const filetypes = files
      ? Array.from(files).map((el) => el?.type)
      : undefined;

    codePromise = fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        tools: selectedTools,
        filetypes,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong with the code generation.");
        }
        return res.json();
      })
      .then((res) => {
        code = res;
        return res;
      });

    code = await codePromise;
  };

  const onRun = async (code: string) => {
    isLoading = true;
    messages = [];

    const agent = new HfAgent(
      $HF_ACCESS_TOKEN ?? "",
      undefined,
      defaultTools.filter((el) => selectedTools.includes(el.name))
    );

    messages = await agent.evaluateCode(code, files);
    window.scrollTo(0, document.body.scrollHeight);
    isLoading = false;
  };

  let dialogElement: HTMLDialogElement;
</script>

<ApiKeyModal bind:dialogElement />

<div class="flex flex-col space-y-4 max-w-2xl">
  <div class="flex flex-row">
    <LogoHuggingFaceBorderless classNames="text-4xl" />
    <h1 class="text-3xl font-semibold mx-auto">Agents.js</h1>
    <button
      class="btn btn-ghost"
      on:click={() => dialogElement.showModal()}
      on:keydown={() => dialogElement.showModal()}>API keys</button
    >
    <div />
  </div>
  <p class="text-justify">
    This demo is meant to showcase some of the features that we released with <a
      class="link"
      href="https://huggingface.co/blog/agents-js">agents.js</a
    >. This demo is using
    <a class="font-bold link-hover" href={PUBLIC_MODEL_URL}
      >{PUBLIC_MODEL_NAME}</a
    >.
  </p>

  <div class="divider" />

  <ToolSelector bind:selectedTools />

  <div class="divider" />

  <span class="label-text text-lg pb-3"> Input your request </span>

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

  {#if messages.length !== 0}
    <div class="divider" />
    <ResultsDisplay bind:messages />
  {/if}
  {#if isLoading}
    <div class="divider" />

    <div class="loading loading-lg mx-auto" />
  {/if}
</div>
