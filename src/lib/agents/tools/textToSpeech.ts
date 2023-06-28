import { getInference } from "$lib/agents/getInference";
import type {
  TextToSpeechArgs,
  TextToSpeechOutput,
} from "@huggingface/inference";

import type { Tool } from "./tool";

export const textToSpeechTool: Tool<
  TextToSpeechArgs["inputs"],
  TextToSpeechOutput
> = {
  name: "textToSpeech",
  description: "This tool takes a text input and turns it into an audio file.",
  examples: [
    {
      prompt: 'Say the following out loud:"Hello world!"',
      command: "textToSpeech('Hello world!')",
    },
    {
      prompt: "Say the content of the string txt out loud",
      command: "textToSpeech(txt)",
    },
  ],
  call: async (input) => {
    return await getInference().textToSpeech(
      {
        inputs: await input,
        model: "espnet/kan-bayashi_ljspeech_vits",
      },
      { wait_for_model: true }
    );
  },
};
