export type LLM = {
  name: string;
  call: (prompt: string) => Promise<string>;
};

export type Tool<Input, Output> = {
  name: string;
  description: string;
  examples: Array<{
    prompt: string;
    command: string;
  }>;
  call: (input: Promise<Input> | Input) => Promise<Output>;
};

export type Update = {
  message: string;
  data: undefined | string | Blob;
};

export type Example = {
  prompt: string;
  code: string;
  tools: string[];
  input?: "audio" | "image" | "document";
};
