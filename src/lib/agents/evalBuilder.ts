import type { Tool } from "$lib/types";

// this function passes the tools & files to the context before calling eval
export async function evalBuilder(
  code: string,
  tools: Tool<any, any>[],
  files: FileList | null,
  updateCallback: (message: string, data: undefined | string | Blob) => void
) {
  async function wrapperEval() {
    if (files && files.length > 0) {
      // @ts-ignore
      globalThis["file"] = await files[0];
    }

    // add tools to context
    for (const tool of tools) {
      // @ts-ignore
      globalThis[tool.name] = tool.call;
    }

    // @ts-ignore
    globalThis["message"] = updateCallback;

    let returnString = "";
    if (files && files.length > 0) {
      returnString = "\nreturn await generate(file);";
    } else {
      returnString = "\n return await generate();";
    }

    await Object.getPrototypeOf(async function () {}).constructor(
      code + returnString
    )();

    // clean up tools
    for (const tool of tools) {
      // @ts-ignore
      delete globalThis[tool.name];
      // @ts-ignore
      delete globalThis["file"];
    }
  }
  return wrapperEval;
}
