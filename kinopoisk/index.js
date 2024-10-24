
const API_KEY = "c097ca9e";

async function fetchData(title) {
    const spiner = document.querySelector("#spiner");

    if (spiner) {
        spiner.style.display = 'block';
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
        const data = await response.json();

        if (spiner) {
            spiner.style.display = 'none';
        }
        return data;
    } catch (error) {
        if (spiner) {
            spiner.style.display = 'none'; 
        }
        console.error("Ошибка при получении данных: ", error);
        return { Response: "False" }; 
    }
}

const searchInputElement = document.querySelector('#movie-search-input');
const searchButtonElement = document.querySelector('#movie-search-button');
const searchResultsContainer = document.querySelector('.search-results');

let movieTitleValue = '';
let addedMovie = null;

searchButtonElement.addEventListener('click', async () => {
    movieTitleValue = searchInputElement.value.trim();


    if (!movieTitleValue) {
        alertMessage('Введите название фильма', 'error');
        return;
    }

    
    const movie = await fetchData(movieTitleValue);

    if (movie.Response === "False") {
        alertMessage('Фильм не найден', 'error');
        return;
    }

    if (searchResultsContainer.querySelector(`[data-movie-id="${movie.imdbID}"]`)) {
        alertMessage('Этот фильм уже добавлен', 'error');
        return;
    }

    const cardElementTemplate = `
    <div class="card" style="width: 18rem" data-movie-id="${movie.imdbID}">
        <img
        src="${movie.Poster !== 'N/A' ? movie.Poster : 'default-poster.jpg'}"  // Проверка на наличие постера
        class="card-img-top"
        alt="${movie.Title} movie poster"
        />
        <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <p class="card-text">${movie.Plot}</p>
            <a
                href="#"
                class="btn btn-primary movie-details-button"
                data-bs-toggle="modal"
                data-bs-target="#movieDetailsModal"
                data-movie-id="${movie.imdbID}"
            >
                Подробнее
            </a>
        </div>
    </div>`;

    searchResultsContainer.insertAdjacentHTML('beforeend', cardElementTemplate);

    addedMovie = movie;

    alertMessage("Фильм успешно добавлен", 'success');
    searchInputElement.value = ''; 
})

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('movie-details-button')) {
        const movieId = event.target.getAttribute('data-movie-id');

        const movie = addedMovie && addedMovie.imdbID === movieId ? addedMovie : await fetchDataById(movieId);

        const modalTitle = document.getElementById('movieDetailsModalLabel');
        const modalBody = document.getElementById('movieDetailsModalBody');

        modalTitle.textContent = movie.Title;
        modalBody.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'default-poster.jpg'}" alt="${movie.Title}" class="img-fluid mb-3">
            <p><strong>Год:</strong> ${movie.Year}</p>
            <p><strong>Рейтинг:</strong> ${movie.imdbRating}</p>
            <p><strong>Актёры:</strong> ${movie.Actors}</p>
            <p><strong>Сюжет:</strong> ${movie.Plot}</p>
        `;
    }
});

function alertMessage(message, type) {
    const toastBody = document.querySelector("#toast-body");
    let toast = document.getElementById('toast');

    toastBody.textContent = message;

    if (type === "success") {
        toast.style.border = '1px solid green';
        toastBody.style.color = 'green';
    } else if (type === "error") {
        toast.style.border = '1px solid red';
        toastBody.style.color = 'red';
    }

    $('.toast').toast('show');
}

async function fetchDataById(id) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    return await response.json();
}









