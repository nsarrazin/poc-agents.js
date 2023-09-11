import { json } from "@sveltejs/kit";
import { SERPAPI_KEY } from "$env/static/private";
import { searchWebSerpApi } from "../../server/websearch/searchWeb.js";
import { parseWeb } from "../../server/websearch/parseWeb.js";
import { summarizeWeb } from "../../server/websearch/summarizeWeb.js";

interface GenericObject {
  [key: string]: GenericObject | unknown;
}

function removeLinks(obj: GenericObject) {
  for (const prop in obj) {
    if (prop.endsWith("link")) delete obj[prop];
    else if (typeof obj[prop] === "object")
      removeLinks(obj[prop] as GenericObject);
  }
  return obj;
}

export async function POST({ request }) {
  const r = await request.json();
  const { query } = r;

  const search = await searchWebSerpApi(query);

  let searchResults =
    (search.organic_results &&
      search.organic_results.map((el: { link: string }) => el.link)) ??
    [];

  let text = "";

  if (search.answer_box) {
    // if google returns an answer box, we use it
    text = JSON.stringify(removeLinks(search.answer_box));
  } else if (search.knowledge_graph) {
    // if google returns a knowledge graph, we use it
    text = JSON.stringify(removeLinks(search.knowledge_graph));
  } else if (searchResults.length > 0) {
    let tries = 0;

    while (!text && tries < 3) {
      const searchUrl = searchResults[tries];
      try {
        text = await parseWeb(searchUrl);
        if (!text) throw new Error("text of the webpage is null");
      } catch (e) {
        tries++;
      }
    }
    if (!text) throw new Error("No text found on the first 3 results");
  } else {
    throw new Error("No results found for this search query");
  }

  const summary = await summarizeWeb(`${text}`);

  return json({ summary });
}
