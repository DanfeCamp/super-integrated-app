/**
 * External dependencies.
 */
import fetch from "node-fetch";

export const POST = async (req, res) => {
  const { tag } = await req.json();
  const _tag = tag.trim().toLowerCase();

  const url = `https://official-joke-api.appspot.com/jokes/${
    _tag === "any" ? "" : `${_tag}/`
  }random`;

  try {
    // Fetch the JSON file from the provided URL
    const response = await fetch(url);

    // Parse the JSON data
    const joke = await response.json();

    if (Array.isArray(joke)) {
      return new Response(JSON.stringify({ joke: joke[0] }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ joke }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
