let movies = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let currentPage = 1;

let activeTab = true;

// Function to fetch movies from api
function fetchMovies(currentPage) {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            movies = data.results;
            updateFavoriteInMovies(movies);
        }).catch((error) => {
            console.error('Unable to fetch the movie API:', error);
        });
}
fetchMovies(currentPage);

// Function to render movies into move-list
function renderMovies(movies) {
    const movieList = document.querySelector('.movie-list');
    movieList.innerHTML = '';
    movieList.style.height = "auto";
    movies.map(movie => {
        const listItem=document.createElement("li");
        listItem.className="movie-card";

        listItem.innerHTML +=
        `<img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="Movie Poster">
        <h3>${movie.title}</h3>
        <div class="movie-text">
        <p class="vote-count">Vote: ${movie.vote_count}</p>
        <p class="vote-average">Average: ${movie.vote_average}</p>
        <button class="favorite-icon" ><i class="${movie.isfavorite} fa-heart"  data-movie-title="${movie.title}" ></i></button>
        </div>`

        movieList.appendChild(listItem);
    });
    addFavoritesMovies();
};

// Function to sort movies according to date 
function sortMoviesByDate (){
    let isSortedByDate = true;
    const sortByDateButton = document.getElementById('sort-by-date');
    function sortByDate(movies) {
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

sortByDateButton.addEventListener('click', () => {
    if(activeTab){
        sortByDate(movies);
    }else{
        sortByDate(favorites);
    }
});
}
sortMoviesByDate();

// Function to sort movies according to rating
function sortMoviesByRating () {
    let isSortedByRating = true;
    const sortByRatingButton = document.getElementById('sort-by-rating');
    function sortByRating(movies) {
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

sortByRatingButton.addEventListener('click', () => {
    if(activeTab){
        sortByRating(movies);
    }else{
        sortByRating(favorites);
    }
});
}
sortMoviesByRating();

// Function to search movies by title name
function searchMoviesByName () {
    // function searchMovies(title) {
    //     title = title.toLowerCase();
    //     const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(title));
    //     renderMovies(filteredMovies);
    // }
    const searchMovies = async (searchMovie)=>{
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`); 
           const result = await response.json();
            searchedMovies=result.results;
            renderMovies(searchedMovies);
    
         } catch (error) {
             console.log(error);
         }
    }
    
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener("click", () => {
        const searchText = searchInput.value;
        searchMovies(searchText);
        activeTab = true;
        switchTabStyle(activeTab);
    });
}
searchMoviesByName();

// Function to add and remove favorite movies 
function addFavoritesMovies () {
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', addToFavorites);
    });

    function addToFavorites(event) {
        const movieTitle = event.target.getAttribute('data-movie-title');
        const movie = findMovieByTitle(movieTitle);
        console.log(event.target)
        if (movie) {
            const id = movie.id;
            const favoriteIndex = favorites.findIndex((product) => product.id === id);
    
            if (favoriteIndex !== -1) {
                movie.isfavorite = "fa-regular";
                favorites.splice(favoriteIndex, 1);
            } else {
                movie.isfavorite = "fa-solid";
                favorites.push(movie);
            }
    
            localStorage.setItem('favorites', JSON.stringify(favorites));
    
            if (activeTab === true) {
                renderMovies(movies);
            } else {
                if(favorites.length === 0){
                    const movieListT = document.querySelector('.movie-list');
                    movieListT.innerHTML ="<h2>You removed all favorite movie !</h2>";
                    movieListT.style.height = "51vh";
                }else{
                    renderMovies(favorites);
                }
            }
        }
    }
    
    function findMovieByTitle(title) {
        if(activeTab === true){
            for (const movie of movies) {
                if (movie.title === title) {
                    return movie;
                }
            }
        }else{
            for (const movie of favorites) {
                if (movie.title === title) {
                    return movie;
                }
            }
        }
        return null;
    }
}

// Function to update favorite movies in movies List
function updateFavoriteInMovies() {
    movies.map((movie) => {
        const favoriteMovie = favorites.find((favMovie) => favMovie.id === movie.id);
        if (favoriteMovie) {
            movie.isfavorite = "fa-solid";
        }else{
            movie.isfavorite = "fa-regular";
        }
    });
    renderMovies(movies);
}

// Function for Tab functionality
function renderTabs (){
    const allTab = document.querySelector('.all-tab');
    const favoriteTab = document.querySelector('.favorite-tab');

    allTab.addEventListener('click', function(){
        activeTab = true;
        switchTabStyle(activeTab);
        renderMovies(movies);
    });

    favoriteTab.addEventListener('click', function (){
        activeTab = false;
        switchTabStyle(activeTab);
        if(favorites.length === 0){
            const movieListT = document.querySelector('.movie-list');
            movieListT.innerHTML ="<h2>No Favorite movie added.</h2>";
            movieListT.style.height = "51vh";
        }else{
            renderMovies(favorites);
        }
    });
}
renderTabs();

// Function to switch Tab Style
function switchTabStyle (activeTab) {
    const allTab = document.querySelector('.all-tab');
    const favoriteTab = document.querySelector('.favorite-tab');
    if(activeTab){
        document.querySelector('.pagination').style.display = "flex";
        allTab.style.backgroundColor = "#333";
        allTab.style.color = "#fff";
        favoriteTab.style.backgroundColor = "#ddd";
        favoriteTab.style.color = "#333";
    }else{
        document.querySelector('.pagination').style.display = "none";
        allTab.style.backgroundColor = "#ddd";
        allTab.style.color = "#333";
        favoriteTab.style.backgroundColor = "#333";
        favoriteTab.style.color = "#fff";
    }
}

// Function to update currentPage 
function pagination () {
    const previousButton = document.querySelector('.previous-page');
    const currentPageDisplay = document.querySelector('.current-page');
    const nextButton = document.querySelector('.next-page');
    const pageLimit = document.getElementById('page-limit');
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
            pageLimit.textContent = "";
        }else if(currentPage === 3){
            nextButton.disabled = true;
            pageLimit.textContent = "You reached maximum page limit !";
        }else{
            previousButton.disabled = false;
            nextButton.disabled = false;
            pageLimit.textContent = "";
        }
        fetchMovies(currentPage);
        document.documentElement.scrollTop = 0;
    }

};
pagination();
