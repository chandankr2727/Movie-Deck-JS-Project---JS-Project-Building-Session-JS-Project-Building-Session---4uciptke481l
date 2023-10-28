let movies = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function fetchMovies() {
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1')
        .then(response => response.json())
        .then(data => {
            movies = data.results;
            movies.map(movie => {
                movie.isfavorite = false;
            })
            renderMovies(movies);
        });
}
fetchMovies();

function renderMovies(movies) {
    const movieList = document.querySelector('.movie-list');
    movieList.innerHTML = '';
    movies.map(movie => {
        const listItem=document.createElement("li");
        listItem.className="movie-card";

        listItem.innerHTML +=
        `<img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="Movie Poster">
        <h3>${movie.title}</h3>
        <p class="vote-count">${movie.vote_count}</p>
        <p class="vote-average">${movie.vote_average}</p>
        <p>${movie.release_date}</p>
        <p>${movie.popularity}</p>
        <button class="favorite-icon" ><i class="fa-regular fa-heart" data-movie-title="${movie.title}" ></i></button>`

        movieList.appendChild(listItem);
    });
    
    addFavoritesMovies();
};

function sortMoviesByDate (){
    let isSortedByDate = true;
    const sortByDateButton = document.getElementById('sort-by-date');
    function sortByDate() {
        let sortByDateMovies;
        if(isSortedByDate){
            sortByDateMovies = movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            sortByDateButton.textContent = "Sort by date (latest to oldest)";
            isSortedByDate = false;
        }else{
            sortByDateMovies = movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            sortByDateButton.textContent = "Sort by date (oldest to latest)";
            isSortedByDate = true;
        }

    renderMovies(sortByDateMovies);
}

sortByDateButton.addEventListener('click', sortByDate);
}
sortMoviesByDate();

function sortMoviesByRating () {
    let isSortedByRating = true;
    const sortByRatingButton = document.getElementById('sort-by-rating');
    function sortByRating() {
        let sortByRatingMovies;
        if(isSortedByRating){
            sortByRatingMovies = movies.sort((a, b) => new Date(a.popularity) - new Date(b.popularity));
            sortByRatingButton.textContent = "Sort by rating (most to least)";
            isSortedByRating = false;
        }else{
            sortByRatingMovies = movies.sort((a, b) => new Date(b.popularity) - new Date(a.popularity));
            sortByRatingButton.textContent = "Sort by rating (least to most)";
            isSortedByRating = true;
        }

    renderMovies(sortByRatingMovies);
}

sortByRatingButton.addEventListener('click', sortByRating);
}
sortMoviesByRating();

function searchMoviesByName () {
    function searchMovies(title) {
        title = title.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(title));
        renderMovies(filteredMovies);
    }
    
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener("click", () => {
        const searchText = searchInput.value;
        searchMovies(searchText);
    });
}
searchMoviesByName();

function addFavoritesMovies () {
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', addToFavorites);
    });

    function addToFavorites(event) {
        event.target.style.color = "red";
        const movieTitle = event.target.getAttribute('data-movie-title');
        console.log(movieTitle);
        const movie = findMovieByTitle(movieTitle);
        const index = favorites.indexOf(movie);
        if(movie){
            if (index === -1) {
                favorites.push(movie);
            } else {
                favorites.splice(index, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }

    function findMovieByTitle(title) {
        for (const movie of movies) {
            if (movie.title === title) {
                return movie;
            }
        }
        return null;
    }
}

 function renderFavorites (){
    const activeTab = document.querySelector('.active-tab');
    const favoriteTab = document.querySelector('.favorite-tab');

    activeTab.addEventListener('click', function(){
        activeTab.style.backgroundColor = "#333";
        activeTab.style.color = "#fff";
        favoriteTab.style.backgroundColor = "#ddd";
        favoriteTab.style.color = "#333";
        renderMovies(movies)
    });

    favoriteTab.addEventListener('click', function (){
        activeTab.style.backgroundColor = "#ddd";
        activeTab.style.color = "#333";
        favoriteTab.style.backgroundColor = "#333";
        favoriteTab.style.color = "#fff";
        renderMovies(favorites)
    });
}
renderFavorites();


