import { json } from "@sveltejs/kit";
import { HF_ACCESS_TOKEN, HF_ENDPOINT } from "$env/static/private";
import { HfInference } from "@huggingface/inference";

export async function POST({ request }) {
  const r = await request.json();
  const { text } = r;

  const inference = new HfInference(HF_ACCESS_TOKEN).endpoint(HF_ENDPOINT);

  const output = await inference.textGeneration({
    inputs: text,
    parameters: {
      max_new_tokens: 900,
    },
  });

  return json({ text: output.generated_text.slice(text.length) });
}
