document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "14b5366a2c78d02ef27b5efc74e15ed7";
    const apiUrl = 'https://api.themoviedb.org/3/search/movie';

    // Primer formulario y elementos relacionados
    const searchInput1 = document.getElementById('search-input-1');
    const moviesList1 = document.getElementById('movies-list-1');
    const searchForm1 = document.getElementById('search-form-1');
    const moviesContainer1 = document.getElementById('movies-container-1');

    // Segundo formulario y elementos relacionados
    const searchInput2 = document.getElementById('search-input-2');
    const moviesList2 = document.getElementById('movies-list-2');
    const searchForm2 = document.getElementById('search-form-2');
    const moviesContainer2 = document.getElementById('movies-container-2');

    // Eventos para el primer formulario
    searchInput1.addEventListener('input', async function () {
        const searchTerm = searchInput1.value;
        if (searchTerm.length > 2) {
            const suggestions = await getMovieSuggestions(searchTerm);
            displayMovieSuggestions(suggestions, moviesList1);
        } else {
            clearMovieSuggestions(moviesList1);
        }
    });

    searchForm1.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita la recarga de la página

        const selectedMovieTitle = searchInput1.value;
        if (selectedMovieTitle) {
            const selectedMovieInfo = await getMovieInfo(selectedMovieTitle);
            displaySelectedMovie(selectedMovieInfo, moviesContainer1);
        }
    });

    // Eventos para el segundo formulario
    searchInput2.addEventListener('input', async function () {
        const searchTerm = searchInput2.value;
        if (searchTerm.length > 2) {
            const suggestions = await getMovieSuggestions(searchTerm);
            displayMovieSuggestions(suggestions, moviesList2);
        } else {
            clearMovieSuggestions(moviesList2);
        }
    });

    searchForm2.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita la recarga de la página

        const selectedMovieTitle = searchInput2.value;
        if (selectedMovieTitle) {
            const selectedMovieInfo = await getMovieInfo(selectedMovieTitle);
            displaySelectedMovie(selectedMovieInfo, moviesContainer2);
        }
    });

    // Funciones auxiliares
    async function getMovieSuggestions(query) {
        try {
            const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error al obtener sugerencias de películas:', error);
            return [];
        }
    }

    function displayMovieSuggestions(suggestions, moviesList) {
        moviesList.innerHTML = '';
        suggestions.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.title;
            moviesList.appendChild(option);
        });

        moviesList.addEventListener('click', function (event) {
            if (event.target.tagName === 'OPTION') {
                searchInput1.value = event.target.value;
                clearMovieSuggestions(moviesList); // Limpiar las sugerencias después de la selección
            }
        });
    }

    function clearMovieSuggestions(moviesList) {
        moviesList.innerHTML = '';
    }

    async function getMovieInfo(movieTitle) {
        try {
            const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${movieTitle}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0];
            } else {
                console.error(`No se encontraron resultados para la película: ${movieTitle}`);
                return null;
            }
        } catch (error) {
            console.error('Error al obtener la información de la película:', error);
            return null;
        }
    }

    function displaySelectedMovie(movieInfo, moviesContainer) {
        if (!moviesContainer) {
            console.error('Elemento moviesContainer no encontrado.');
            return;
        }

        // Convierte la puntuación en estrellas
        const starRating = getStarRating(movieInfo.vote_average);

        // Muestra la información de la película seleccionada
        moviesContainer.innerHTML = `
            <div class="movie-info">
                <h2>${movieInfo.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${movieInfo.poster_path}" alt="${movieInfo.title} Poster">                
                <p>Año: ${movieInfo.release_date ? movieInfo.release_date.substring(0, 4) : 'Desconocido'}</p>
                <p>Puntuación: ${starRating}</p>
            </div>
        `;
    }

    // Función para obtener el nivel de estrellas
    function getStarRating(voteAverage) {
        const maxStars = 5;
        const rating = voteAverage / 2; // Escala la puntuación para ajustarse al rango de 0 a 5
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.25;  // Verifica si hay al menos 1/4 de una estrella


        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '★'; // Estrella completa
        }

        if (halfStar) {
            stars += '☆'; // Media estrella
        }

        const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆'; // Estrella vacía
        }

        return stars;
    }
});
