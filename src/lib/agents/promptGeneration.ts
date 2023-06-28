import type { Tool } from "$lib/types";

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

  // describe all the tools
  const fullPrompt = `
Create a javascript function that does the following: "${prompt}" 

If you need to send information use \`message("message", data)\` and NOT \`console.log\`.

In order to help in answering the above prompt, the function has access to the following methods to generate outputs.
${tools.map((tool) => toolDescription(tool)).join("\n-------\n")}

Examples:

For the prompt: "Caption the image and give me the caption read out loud."
\`\`\`js
async function generate(image) {
	const caption = await imageToText(image);
	message("First we caption the image", caption);
	const output = await textToSpeech(caption);
	message("Then we read the caption out loud", output);
	return output;
};
\`\`\`

For the prompt "Display an image of a yellow dog wearing a top hat"
\`\`\`js
async function generate() {
	const output = await textToImage("yellow dog wearing a top hat");
	message("We generate the dog picture", output);
	return output;
}
\`\`\`

For the prompt "transcribe the attached audio"

\`\`\`js
async function generate(audio) {
	const output = await speechToText(audio)
	message("We read the text", output);
	return output;
}
\`\`\`

Use the above methods and only the above methods to answer the prompt: ${prompt}.

It must match the following signature:
\`\`\`js
async function generate(${params}}) {
// your code here
return output;
};
\`\`\``;
  return fullPrompt;
}
