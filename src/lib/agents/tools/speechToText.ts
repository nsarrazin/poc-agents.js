import { getInference } from '$lib/agents/getInference';
import type {
	AutomaticSpeechRecognitionArgs,
	AutomaticSpeechRecognitionOutput
} from '@huggingface/inference';
import type { Tool } from './tool';

export const speechToTextTool: Tool<
	AutomaticSpeechRecognitionArgs['data'],
	AutomaticSpeechRecognitionOutput['text']
> = {
	name: 'speechToText',
	description: 'Caption an audio file and returns its text content.',
	examples: [
		{
			prompt: 'Transcribe the sound file',
			command: 'speechToText(audio)'
		}
	],
	call: async (data) => {
		return (
			await getInference().automaticSpeechRecognition(
				{
					data: await data,
					model: 'facebook/wav2vec2-large-960h-lv60-self'
				},
				{ wait_for_model: true }
			)
		).text;
	}
};
