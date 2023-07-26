import { error, json } from "@sveltejs/kit";
import {
  defaultTools,
  HfAgent,
  LLMFromEndpoint,
  LLMFromHub,
} from "@huggingface/agents";
import { HF_ACCESS_TOKEN, HF_ENDPOINT } from "$env/static/private";

export async function POST({ request }) {
  const r = await request.json();
  const { prompt, tools: selectedTools, filetypes } = r;
  const tools = defaultTools.filter((el) => selectedTools.includes(el.name));

  let agent;
  if (HF_ENDPOINT !== "") {
    agent = new HfAgent(
      HF_ACCESS_TOKEN,
      LLMFromEndpoint(HF_ACCESS_TOKEN, HF_ENDPOINT),
      tools
    );
  } else {
    agent = new HfAgent(HF_ACCESS_TOKEN, LLMFromHub(HF_ACCESS_TOKEN), tools);
  }

  const files = filetypes
    ? filetypes.map((el: string) => ({
        type: el,
      }))
    : undefined;

  let code = "";
  try {
    code = await agent.generateCode(prompt, files);
  } catch (e) {
    throw error(500, e as Error);
  }

  return json(code);
}
