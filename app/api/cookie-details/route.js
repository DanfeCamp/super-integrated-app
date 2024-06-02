/**
 * External dependencies.
 */
import fetch from "node-fetch";
import Papa from "papaparse";

export const POST = async (req, res) => {
  const { cookieName, cookieDomain } = await req.json();
  const cookie = {
    name: cookieName.trim().toLowerCase(),
    domain: cookieDomain.trim().toLowerCase(),
  };

  try {
    // Fetch the CSV file from the provided URL
    const response = await fetch(
      "https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv"
    );

    // Parse the CSV data using PapaParse
    const csv = await response.text();
    const csvData = Papa.parse(csv, { header: true }).data;

    // Filter CSV
    let result = [];

    if (cookie.name && cookie.domain) {
      result = csvData.filter(
        (data) =>
          data["Cookie / Data Key name"]?.toLowerCase() === cookie.name &&
          data["Domain"]?.toLowerCase() === cookie.domain
      );
    } else if (cookie.name) {
      result = csvData.filter(
        (data) => data["Cookie / Data Key name"]?.toLowerCase() === cookie.name
      );
    } else if (cookie.domain) {
      result = csvData.filter(
        (data) => data["Domain"]?.toLowerCase() === cookie.domain
      );
    }

    return new Response(JSON.stringify({ cookieDetails: result }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
