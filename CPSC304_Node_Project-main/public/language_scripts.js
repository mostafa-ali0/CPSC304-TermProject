/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

async function displayLanguage() {
    const title = document.getElementById('title')
    const pathSegments = window.location.pathname.split("/");
    const languageName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
    if (languageName) {
        title.innerHTML = languageName;
    } else {
        title.innerHTML = "No language found";
    }
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplaySpeakers() {
    const tableElement = document.getElementById('speakertable');
    const tableBody = tableElement.querySelector('tbody');
    const pathSegments = window.location.pathname.split("/");
    const languageName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
    const response = await fetch(`/languagespeakers?name=${encodeURIComponent(languageName)}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchMaxSpeakers() {
    const tableElement = document.getElementById('maxspeakertable');
    const tableBody = tableElement.querySelector('tbody');
    const pathSegments = window.location.pathname.split("/");
    const languageName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
    const response = await fetch(`/max-lang-speakers?name=${encodeURIComponent(languageName)}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchDefinedWords() {
    const tableElement = document.getElementById('definedWordTable');
    const tableBody = tableElement.querySelector('tbody');
    const pathSegments = window.location.pathname.split("/");
    const languageName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
    const response = await fetch(`/words-all-dialects?name=${encodeURIComponent(languageName)}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    displayLanguage();
    checkDbConnection();
    fetchTableData();
    document.getElementById("maxSpeakerShow").addEventListener("click", fetchMaxSpeakers);
    document.getElementById("definedWordShow").addEventListener("click", fetchDefinedWords);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplaySpeakers();
}