import type { LLM } from "@huggingface/agents/src/types";

export function LLMFromServer(): LLM {
  return async (prompt: string): Promise<string> => {
    const answer = fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
      }),
    });

    const text =
      (await (await answer).json().then((json) => json["text"])) ?? "";

    return text ?? "";
  };
}
