// --- CONFIGURATION ---
const API_KEY = 'AIzaSyCoVg8Sfckpm7s5WoM1GYAwiTEjSGadqaA'; // <--- PASTE YOUR API KEY HERE

// --- HTML ELEMENTS ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

// --- EVENT LISTENERS ---
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchYouTube(query);
    }
});

// Allow pressing Enter to search
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});


// --- FUNCTIONS ---

/**
 * Searches YouTube for videos based on a query.
 * @param {string} query The search term.
 */
async function searchYouTube(query) {
    // Clear previous results and show a loading message
    resultsContainer.innerHTML = '<p>Loading...</p>';

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video&maxResults=20`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // If response is not OK, throw an error
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error.message}`);
        }
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        console.error('Failed to fetch from YouTube API:', error);
        resultsContainer.innerHTML = `<p>Error fetching videos. Please check the console for details.</p>`;
    }
}

/**
 * Displays the video results on the page.
 * @param {Array} videos Array of video objects from the YouTube API.
 */
function displayResults(videos) {
    // Clear the loading message
    resultsContainer.innerHTML = '';

    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    videos.forEach(video => {
        // Create the main card element
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        // Extract video details from the API response
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.high.url;
        const channel = video.snippet.channelTitle;

        // Set the content of the card
        videoCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <div class="video-card-content">
                <h3>${title}</h3>
                <p>${channel}</p>
            </div>
        `;

        // Add the new card to the results container
        resultsContainer.appendChild(videoCard);
    });
}
