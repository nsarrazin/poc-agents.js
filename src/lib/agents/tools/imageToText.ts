import { getInference } from '$lib/agents/getInference';
import type { ImageToTextArgs, ImageToTextOutput } from '@huggingface/inference';
import type { Tool } from './tool';

export const imageToTextTool: Tool<ImageToTextArgs['data'], ImageToTextOutput['generated_text']> = {
	name: 'imageToText',
	description: 'Caption an image.',
	examples: [
		{
			prompt: 'Describe the image',
			command: 'imageToText(image)'
		}
	],
	call: async (input) => {
		return (
			await getInference().imageToText(
				{
					data: await input,
					model: 'nlpconnect/vit-gpt2-image-captioning'
				},
				{ wait_for_model: true }
			)
		).generated_text;
	}
};
