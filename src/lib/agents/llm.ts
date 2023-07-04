import { get } from "svelte/store";
import { OPENAI_API_KEY, HF_ENDPOINT } from "$lib/store";
import { Configuration, OpenAIApi } from "openai";
import { getInference } from "./getInference";
import type { LLM } from "$lib/types";
import type { TextGenerationOutput } from "@huggingface/inference";

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
  const formattedPrompt = "<|user|>" + prompt + "<|end|><|assistant|>";

  let output: TextGenerationOutput;

  if (!!get(HF_ENDPOINT)) {
    output = await getInference()
      .endpoint(get(HF_ENDPOINT))
      .textGeneration({
        inputs: formattedPrompt,
        parameters: {
          max_new_tokens: 1400,
        },
      });
  } else {
    output = await getInference().textGeneration({
      inputs: formattedPrompt,
      model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      parameters: {
        max_new_tokens: 900,
      },
    });
  }

  const text = output.generated_text.slice(formattedPrompt.length);

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
