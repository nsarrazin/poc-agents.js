import { SERPAPI_KEY } from "$env/static/private";
import { getJson } from "serpapi";

export async function searchWebSerpApi(query: string) {
  const params = {
    q: query,
    hl: "en",
    gl: "us",
    google_domain: "google.com",
    api_key: SERPAPI_KEY,
  };

  // Show result as JSON
  const response = await getJson("google", params);

  return response;
}
