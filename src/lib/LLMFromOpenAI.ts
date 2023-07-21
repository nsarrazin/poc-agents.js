import type { LLM } from "@huggingface/agents/src/types";
import { Configuration, OpenAIApi } from "openai";
export function LLMFromOpenAI(openAIKey: string): LLM {
  const api = new OpenAIApi(new Configuration({ apiKey: openAIKey }));

  return async (prompt: string): Promise<string> => {
    const textAnswer =
      (
        await api.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1000,
        })
      ).data.choices[0].text ?? "";

    return textAnswer;
  };
}
