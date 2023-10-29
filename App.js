let movies = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let currentPage = 1;


function fetchMovies(currentPage) {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            movies = data.results;
            movies.map(movie => {
                movie.isfavorite = "fav-notActive";
            })
            renderMovies(movies);
        });
}
fetchMovies(currentPage);

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
        <button class="favorite-icon" ><i class="fa-regular fa-heart ${movie.isfavorite}" data-movie-title="${movie.title}" ></i></button>`

        movieList.appendChild(listItem);
    });
    const icond = document.getElementById('favorite-icon');
    
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
        // event.target.style.color = "red";
        const movieTitle = event.target.getAttribute('data-movie-title');
        console.log(event);
        const movie = findMovieByTitle(movieTitle);
        const index = favorites.indexOf(movie);
        if(movie){
            if (index === -1) {
                movie.isfavorite = "fav-active";
                favorites.push(movie);
            } else {
                movie.isfavorite = "fav-notActive";
                favorites.splice(index, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        renderMovies(movies);
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

 function renderTabs (){
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
renderTabs();

function pagination () {
    const previousButton = document.querySelector('.previous-page');
    const currentPageDisplay = document.querySelector('.current-page');
    const nextButton = document.querySelector('.next-page');

    previousButton.addEventListener('click', () => {
        if(currentPage != 1){
            currentPage--;
        }
        updateCurrentPage(currentPage);
    });
    nextButton.addEventListener('click', () => {
        if(currentPage < 3){
            currentPage++;
        }
        updateCurrentPage(currentPage);
    });
    
    function updateCurrentPage(currentPage){
        currentPageDisplay.textContent = `Current Page: ${currentPage}`;
        if(currentPage === 1){
            previousButton.disabled = true;
        }else if(currentPage === 3){
            nextButton.disabled = true;
        }else{
            previousButton.disabled = false;
            nextButton.disabled = false;
        }
        fetchMovies(currentPage);
        document.documentElement.scrollTop = 0;
    }

};
pagination();



