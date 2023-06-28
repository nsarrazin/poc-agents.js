export interface Tool<Input, Output> {
  name: string;
  description: string;
  examples: Array<{
    prompt: string;
    command: string;
  }>;
  call: (input: Promise<Input> | Input) => Promise<Output>;
}
