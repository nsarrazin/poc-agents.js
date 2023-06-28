import type { Tool } from "./tool";

export const messageTool: Tool<Promise<Blob | string> | string, void> = {
  name: "message",
  description: "Send data back to the user.",
  examples: [
    {
      prompt: "Display the created image",
      command: 'message("we display the image", image)',
    },
    {
      prompt: "Display the generated text",
      command: 'message("we render the text", text)',
    },
    {
      prompt: 'Display the text "hello world"',
      command: 'message("hello world")',
    },
  ],
  call: async () => {
    return;
  },
};
