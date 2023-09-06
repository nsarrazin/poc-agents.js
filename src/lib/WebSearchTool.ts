import type { Tool } from "@huggingface/agents/src/types";

export const webSearch: Tool = {
  name: "webSearch",
  description:
    "Search the query on google, summarize the top results. Useful when you need up-to-date current information. For example current world leaders, or ongoing events. If the user asks you for information about someone on a first name basis, you probably want to use this tool.",
  examples: [
    {
      prompt: "Who is the president of the United States?",
      code: '{"tool" : "webSearch", "input" : "Current president of the united states"}',
      tools: ["webSearch"],
    },
    {
      prompt: "Who is Leonardo DiCaprio's current girlfriend?",
      code: '{"tool" : "webSearch", "input" : "Leonardo DiCaprio\'s current girlfriend"}',
      tools: ["webSearch"],
    },
  ],
  call: async (input, inference) => {
    const data = await input;
    if (typeof data !== "string") throw "Input must be a string.";

    const answer = await fetch("/websearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
      }),
    });

    return answer.json().then((data) => data.summary);
  },
};
