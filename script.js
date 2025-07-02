// --- NEW: Load featured videos on startup ---
window.addEventListener('DOMContentLoaded', () => {
  searchYouTube('latest music videos');
});

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

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// --- FUNCTIONS ---
async function searchYouTube(query) {
    resultsContainer.innerHTML = '<p class="loading-text">Loading...</p>';

    const url = `/.netlify/functions/search?q=${query}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Function Error: ${response.statusText}`);
        }
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        console.error('Failed to fetch from function:', error);
        resultsContainer.innerHTML = `<p class="error-text">Error fetching videos. Please check the console for details.</p>`;
    }
}

function displayResults(videos) {
    resultsContainer.innerHTML = '';
    if (!videos || videos.length === 0) {
        resultsContainer.innerHTML = '<p class="error-text">No videos found.</p>';
        return;
    }
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.high.url;
        const channel = video.snippet.channelTitle;
        const videoId = video.id.videoId; // We will use this later

        videoCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}" class="video-thumbnail">
            <div class="video-details">
                <div class="channel-avatar"></div>
                <div class="video-text">
                    <h3 class="video-title">${title}</h3>
                    <p class="video-channel">${channel}</p>
                </div>
            </div>
        `;
        resultsContainer.appendChild(videoCard);
    });
}

