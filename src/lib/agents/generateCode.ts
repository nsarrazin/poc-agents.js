import type { Tool } from "./tools/tool";

import { get } from "svelte/store";
import { OPENAI_API_KEY } from "../store";
import { Configuration, OpenAIApi } from "openai";
import { generatePrompt } from "./promptGeneration";
import { messageTool } from "./tools/message";

export async function generateCode(
  prompt: string,
  tools: Tool<any, any>[],
  files: FileList | null
) {
  const fullprompt = generatePrompt(
    prompt,
    [...tools, messageTool],
    !!files && files[0].type.startsWith("image"),
    !!files && files[0].type.startsWith("audio")
  );

  const openai = new OpenAIApi(
    new Configuration({ apiKey: get(OPENAI_API_KEY) })
  );
  const textAnswer =
    (
      await openai.createCompletion({
        model: "text-davinci-003",
        prompt: fullprompt,
        max_tokens: 1000,
      })
    ).data.choices[0].text ?? "";

  const regex = /```(.*?)```/gs;
  const matches = [...textAnswer.matchAll(regex)];

  const codeBlocks = matches.map((match) => match[1]);
  return codeBlocks[0].replace("js\n", "") ?? "nothing";
}
