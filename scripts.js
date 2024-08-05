const apiKey = 'z10rwYRnb5v4pCxyOF4jhF2RJfrzAhpKTeDm2c2S';

document.addEventListener('DOMContentLoaded', () => {
    getCurrentImageOfTheDay();
    loadSearchHistory();

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const date = document.getElementById('search-input').value;
        if (date) {
            getImageOfTheDay(date);
        }
    });

    document.getElementById('search-history').addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const date = event.target.textContent;
            getImageOfTheDay(date);
        }
    });
});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split('T')[0];
    fetch(`https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
        })
        .catch(error => {
            console.error('Error fetching current image:', error);
        });
}

function getImageOfTheDay(date) {
    fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
            saveSearch(date);
            addSearchToHistory(date);
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
}

function displayImage(data) {
    const container = document.getElementById('current-image-container');
    container.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.date}</p>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function addSearchToHistory(date) {
    const searchHistory = document.getElementById('search-history');
    const li = document.createElement('li');
    li.textContent = date;
    searchHistory.appendChild(li);
}

function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => addSearchToHistory(date));
}
