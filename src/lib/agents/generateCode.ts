import type { LLM, Tool } from "$lib/types";

import { generatePrompt } from "./promptGeneration";
import { messageTool } from "./tools/message";

export async function generateCode(
  prompt: string,
  tools: Tool<any, any>[],
  files: FileList | null,
  llm: LLM
) {
  const fullprompt = generatePrompt(
    prompt,
    [...tools, messageTool],
    !!files && files[0].type.startsWith("image"),
    !!files && files[0].type.startsWith("audio")
  );

  const textAnswer = await llm.call(fullprompt);

  const regex = /```(.*?)```/gs;
  const matches = [...textAnswer.matchAll(regex)];

  const codeBlocks = matches.map((match) => match[1]);
  return codeBlocks[0].replace("js\n", "") ?? "nothing";
}
