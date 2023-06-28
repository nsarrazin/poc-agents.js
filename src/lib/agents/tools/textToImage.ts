import { getInference } from '$lib/agents/getInference';
import type { TextToImageArgs, TextToImageOutput } from '@huggingface/inference';
import type { Tool } from './tool';

export const textToImageTool: Tool<TextToImageArgs['inputs'], TextToImageOutput> = {
	name: 'textToImage',
	description: 'Generate an image from a text prompt.',
	examples: [
		{
			prompt: 'Generate an image of a cat wearing a top hat',
			command: "textToImage('cat wearing a top hat')"
		},
		{
			prompt: 'Draw a brown dog on a beach',
			command: "textToImage('drawing of a brown dog on a beach')"
		}
	],
	call: async (input) => {
		return await getInference().textToImage(
			{
				inputs: await input,
				model: 'stabilityai/stable-diffusion-2'
			},
			{ wait_for_model: true }
		);
	}
};
