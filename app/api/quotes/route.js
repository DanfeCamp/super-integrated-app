/**
 * External dependencies.
 */
import fetch from "node-fetch";

export const POST = async (req, res) => {
  const { tag } = await req.json();
  const _tag = tag.trim().toLowerCase();

  try {
    // Fetch the JSON file from the provided URL
    const response = await fetch(
      "https://raw.githubusercontent.com/nirajgiriXD/garden-of-quotes/main/public/quotes.json"
    );

    // Parse the JSON data
    const json = await response.json();
    const quotes = json.data;

    // Filter Quotes
    const filteredQuotes =
      _tag === "any"
        ? quotes
        : quotes.filter((data) => data.tags.includes(_tag));
    const rani = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[rani];

    return new Response(JSON.stringify({ quote }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
