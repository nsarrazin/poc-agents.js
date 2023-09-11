<script lang="ts">
  import LogoHuggingFaceBorderless from "$lib/components/LogoHuggingFaceBorderless.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import ToolSelector from "$lib/components/ToolSelector.svelte";
  import {
    HfChatAgent,
    defaultTools,
    templateLlama2,
  } from "@huggingface/agents";
  import { PUBLIC_MODEL_NAME, PUBLIC_MODEL_URL } from "$env/static/public";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";
  import { LLMFromServer } from "$lib/LLMFromServer";
  import type { Chat, Tool } from "@huggingface/agents/src/types";
  import Markdown from "@magidoc/plugin-svelte-marked";
  import DataDisplay from "$lib/components/DataDisplay.svelte";
  import { webSearch } from "$lib/WebSearchTool";

  const tools = [...defaultTools, webSearch];

  let prompt = "Generate an image of the current Prime Minister of the UK.";
  let selectedTools: Array<string> = tools.map((el) => el.name);

  let files: FileList | undefined;

  let messages: Chat = [];

  let agent = new HfChatAgent({
    llm: LLMFromServer(),
    chatFormat: templateLlama2,
    updateCallback: (newMessages) => {
      messages = [...newMessages];
    },
  });

  const onGenerate = async () => {
    agent.chat(prompt, files);
  };

  let dialogElement: HTMLDialogElement;

  $: selectedTools,
    ((agent = new HfChatAgent({
      llm: LLMFromServer(),
      chatFormat: templateLlama2,
      updateCallback: (newMessages) => {
        messages = [...newMessages];
      },
      tools: selectedTools
        .map((tool) => {
          return tools.find((el) => el.name === tool);
        })
        .filter((el) => el !== undefined) as Array<Tool>,
    })),
    (messages = []));

  const regex = /\[\[.*?\]\]/g;
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

  <div class="divider" />

  <div class="w-full flex-col flex gap-5">
    {#each messages as message}
      <div
        class="chat chat-bubble max-w-xl mx-auto"
        class:chat-start={message.from === "assistant"}
        class:chat-end={message.from === "user"}
        class:chat-bubble-info={message.from === "assistant"}
      >
        {message.content}
      </div>
      {#if message.scratchpad}
        {@const isDone = message.scratchpad.updates.find(
          (el) => typeof el.body === "string" && el.body.startsWith("Final")
        )}

        <div class="collapse bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium">
            Scratchpad
            {#if !isDone}
              <span class="ml-5 loading loading-dots loading-sm" />
            {/if}
          </div>
          <div class="collapse-content">
            <ul>
              {#each message.scratchpad.updates as scratch}
                <li>
                  <span class="font-bold">{scratch.type}</span>
                  {#if typeof scratch.body !== "boolean"}
                    <DataDisplay data={scratch.body} />
                  {/if}
                </li>
                <div class="divider" />
              {/each}
            </ul>
          </div>
        </div>

        {#if isDone}
          <!-- display the images in a grid -->
          <div class="divider" />
          <div class="grid grid-cols-2 gap-4">
            {#each Object.keys(message.scratchpad.files) as name}
              {@const file = message.scratchpad.files[name]}
              {#if name.startsWith("tool")}
                <DataDisplay data={file.file} />
              {/if}
            {/each}
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</div>
