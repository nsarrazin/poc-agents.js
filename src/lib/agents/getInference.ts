import { HfInference } from '@huggingface/inference';
import { get } from 'svelte/store';
import { HF_ACCESS_TOKEN } from '../store';

export function getInference() {
	return new HfInference(get(HF_ACCESS_TOKEN));
}
