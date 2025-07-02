// This code runs on Netlify's servers, not in the browser.

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // Get the search query from the URL (e.g., /.netlify/functions/search?q=cats)
  const query = event.queryStringParameters.q || 'featured';
  const apiKey = process.env.YOUTUBE_API_KEY; // Access the secret key
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&maxResults=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Send the data back to the frontend
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
