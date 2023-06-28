import type { Tool } from "$lib/types";

// this function passes the tools & files to the context before calling eval
export async function evalBuilder(
  code: string,
  tools: Tool<any, any>[],
  files: FileList | null,
  updateCallback: (message: string, data: undefined | string | Blob) => void
) {
  let filetype = "";

  if (files && files[0].type.startsWith("image")) {
    filetype = "image";
  } else if (files && files[0].type.startsWith("audio")) {
    filetype = "audio";
  }

  console.log(filetype);
  async function wrapperEval() {
    if (filetype !== "") {
      // @ts-ignore
      globalThis[filetype] = await files[0];
    }
  }

  // add tools to context
  for (const tool of tools) {
    // @ts-ignore
    globalThis[tool.name] = tool.call;
  }

  // @ts-ignore
  globalThis["message"] = updateCallback;

  const returnString = "\nreturn await generate(" + filetype + ");";

  await Object.getPrototypeOf(async function () {}).constructor(
    code + returnString
  )();

  // clean up tools
  for (const tool of tools) {
    // @ts-ignore
    delete globalThis[tool.name];
    // @ts-ignore
    delete globalThis[filetype];
  }

  return wrapperEval;
}
