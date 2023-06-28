import type { Tool } from './tools/tool';

export type Update = {
	message: string;
	data: undefined | string | Blob;
};

// this function passes the tools & files to the context before calling eval
export async function evalBuilder(
	code: string,
	tools: Tool<any, any>[],
	files: FileList | null,
	updateCallback: (message: string, data: undefined | string | Blob) => void
) {
	async function wrapperEval() {
		if (files) {
			if (files[0].type.startsWith('image')) {
				// @ts-ignore
				globalThis['image'] = await files[0].arrayBuffer();
			} else if (files[0].type.startsWith('audio')) {
				// @ts-ignore
				globalThis['audio'] = await files[0].arrayBuffer();
			}
		}

		// add tools to context
		for (const tool of tools.filter((el) => el.name !== 'message')) {
			// @ts-ignore
			globalThis[tool.name] = tool.call;
		}

		// @ts-ignore
		globalThis['message'] = updateCallback;

		await Object.getPrototypeOf(async function () {}).constructor(`
${code}
return await generate();
`)();

		// clean up tools
		for (const tool of tools) {
			// @ts-ignore
			delete globalThis[tool.name];
		}
	}

	return wrapperEval;
}
