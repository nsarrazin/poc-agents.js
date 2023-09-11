import { HF_ACCESS_TOKEN } from "$env/static/private";
import { HfInference } from "@huggingface/inference";

export async function summarizeWeb(content: string) {
  // if HF_ACCESS_TOKEN is set, we use a HF dedicated endpoint for summarization
  try {
    if (HF_ACCESS_TOKEN) {
      const summary = (
        await new HfInference(HF_ACCESS_TOKEN).summarization({
          model: "facebook/bart-large-cnn",
          inputs: content,
          parameters: {
            max_length: 512,
          },
        })
      ).summary_text;
      return summary;
    }
  } catch (e) {
    console.error(e);
  }

  return "No summary";
}
