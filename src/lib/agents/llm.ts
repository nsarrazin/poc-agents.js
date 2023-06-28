import { get } from "svelte/store";
import { OPENAI_API_KEY } from "$lib/store";
import { Configuration, OpenAIApi } from "openai";
import { getInference } from "./getInference";
import type { LLM } from "$lib/types";

async function OpenAILLMCall(prompt: string) {
  const openai = new OpenAIApi(
    new Configuration({ apiKey: get(OPENAI_API_KEY) })
  );
  const textAnswer =
    (
      await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
      })
    ).data.choices[0].text ?? "";

  return textAnswer;
}

async function HFLLMCall(prompt: string) {
  const hf = getInference();

  const formattedPrompt = "<|user|>" + prompt + "<|end|>";

  const generatedOutput = await hf.textGeneration({
    inputs: formattedPrompt,
    model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    parameters: {
      max_new_tokens: 512,
    },
  });

  const text = generatedOutput.generated_text.slice(formattedPrompt.length);

  return text;
}

export const OpenAILLM: LLM = {
  name: "OpenAI",
  call: OpenAILLMCall,
};

export const HFLLM: LLM = {
  name: "Hugging Face",
  call: HFLLMCall,
};

export const LLMs = [OpenAILLM, HFLLM];
