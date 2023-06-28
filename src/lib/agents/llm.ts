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

  const formattedPrompt = "<|user|>" + prompt + "<end|><|assistant|>";

  const textAnswer = await hf.textGeneration({
    inputs: formattedPrompt,
    model: "HuggingFaceH4/starchat-beta",
    parameters: {
      max_new_tokens: 1024,
    },
  });

  console.log(textAnswer.generated_text);

  return textAnswer.generated_text;
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
