/**
 * External dependencies.
 */
import { translate } from "@vitalets/google-translate-api";

export const POST = async (req, res) => {
  const { text, language } = await req.json();
  try {
    const result = await translate(text, { to: language });
    return new Response(JSON.stringify({ translatedText: result.text }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
