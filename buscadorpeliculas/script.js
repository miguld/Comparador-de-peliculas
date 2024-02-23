document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "14b5366a2c78d02ef27b5efc74e15ed7";
    const apiUrl = 'https://api.themoviedb.org/3/search/movie';

    async function getMovies(query) {
        try {
            const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error al obtener las películas:', error);
            return [];
        }
    }

    async function getMovieDetails(movieId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener los detalles de la película:', error);
            return {};
        }
    }

    function displayMovies(movies) {
        const moviesContainer = document.getElementById('movies-container');
        moviesContainer.innerHTML = '';

        movies.forEach(async (movie) => {
            const details = await getMovieDetails(movie.id);

            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <p>Año: ${movie.release_date ? movie.release_date.substring(0, 4) : 'Desconocido'}</p>
                <p>Puntuación: ${movie.vote_average}</p>
                <p>Sinopsis: ${details.overview || 'Sin información'}</p>
            `;

            moviesContainer.appendChild(movieCard);
        });
    }

    document.getElementById('search-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search-input').value;
        const movies = await getMovies(searchTerm);
        displayMovies(movies);
    });
});
