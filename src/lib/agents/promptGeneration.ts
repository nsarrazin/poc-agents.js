import type { Tool } from "$lib/types";
import examples from "./examples";

function toolDescription(tool: Tool<any, any>) {
  let prompt = `name: ${tool.name} \ndescription: ${tool.description}`;

  const examples = tool.examples.slice(0, 1).map((example) => {
    return `prompt: ${example.prompt} \ncommand generated: \`${example.command}\``;
  });

  prompt += `\n` + examples.join("\n");

  return prompt;
}

export function generatePrompt(
  prompt: string,
  tools: Tool<any, any>[],
  image?: boolean,
  audio?: boolean
) {
  if (tools.length === 0) {
    throw new Error("no tools selected");
  }

  let params = "";

  if (image) {
    params += `image`;
  }
  if (audio) {
    params += params ? "," : "";
    params += `audio`;
  }

  const toolNames = tools.map((tool) => tool.name);

  const exampleSnippet = examples
    .map(
      (example) => `
user: ${example.prompt}
function: 
\`\`\`js
${example.code}
\`\`\``
    )
    .join("\n-------\n");

  const toolSnippet = tools
    .map((tool) => toolDescription(tool))
    .join("\n-------\n");

  // describe all the tools
  const fullPrompt = `
Create a javascript function that does the following: "${prompt}" 

In order to help in answering the above prompt, the function has access to the following methods to generate outputs.

${toolSnippet}

Examples:
${exampleSnippet}

If you need to send information to the user use \`message("message", data)\` and NOT \`console.log\`.

Use the above methods and only the above methods to answer the prompt: ${prompt}.

The generated function must match the following signature:
\`\`\`js
async function generate(${params}) {
// your code here
return output;
};
\`\`\``;

  console.log(fullPrompt);
  return fullPrompt;
}
