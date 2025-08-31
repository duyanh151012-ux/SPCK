const TMDB_API_KEY = "ff0011917d08e659aeaa88ac99a6de94";

// Phần responsive cho header
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('active');
})
const searchIcon = document.getElementById("search-icon");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search-input");
const closeSearchBtn = document.getElementById("close-search");
const searchResultsSection = document.getElementById("search-results-section");
const searchResultsContainer = document.getElementById("search-results-container");

// Mapping categories to TMDB API endpoints and genres
const categoryMapping = {
    'home': { title: 'Trang chủ' },
    'tv': { title: 'Truyền hình', type: 'tv' },
    'tv-series': { title: 'Phim bộ', type: 'tv' },
    'anime': { title: 'Anime', type: 'tv', id: 16 }, // 16 is Animation genre
    'now-playing': { title: 'Chiếu rạp', type: 'movie', endpoint: 'movie/now_playing' },
    'movie': { type: 'movie' },
    'tv-shows': { title: 'TV Shows', type: 'tv' },
    '35': { title: 'Phim Hài', type: 'movie', id: 35 },
    '28': { title: 'Phim Hành động', type: 'movie', id: 28 },
    '27': { title: 'Phim Kinh dị', type: 'movie', id: 27 },
};

// Hàm để ẩn tất cả các sections chính
const hideAllSections = () => {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
};

// Hàm hiển thị kết quả tìm kiếm
const displaySearchResults = (movies) => {
    searchResultsContainer.innerHTML = "";

    if (movies.length === 0) {
        searchResultsContainer.innerHTML = "<p>Không tìm thấy phim.</p>";
        return;
    }

    const htmls = movies.map(movie => {
        const title = movie.title || movie.name;
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
        return `
            <a href="./info.html?id=${movie.id}" class="movie-card">
              <img src="${posterPath}" alt="${title}">
              <p>${title}</p>
            </a>
        `;
    }).join('');

    searchResultsContainer.innerHTML = htmls;
};

// Hàm tìm kiếm phim
const searchMovies = async (query) => {
    if (query.trim() === "") {
        searchResultsContainer.innerHTML = "<p>Vui lòng nhập tên phim.</p>";
        return;
    }
    // Thêm tham số ngôn ngữ 'language=vi-VN' vào URL
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=vi-VN`);
    const data = await response.json();
    return data.results;
};

// Thêm sự kiện cho nút tìm kiếm
searchIcon.addEventListener('click', () => {
    searchContainer.style.display = 'flex';
    searchIcon.style.display = 'none';
    closeSearchBtn.style.display = 'block';
    searchInput.focus();
    renderHomePage(); // Hiển thị lại trang chủ khi mở thanh tìm kiếm
});

closeSearchBtn.addEventListener('click', () => {
    searchContainer.style.display = 'none';
    searchIcon.style.display = 'block';
    searchInput.value = '';
    renderHomePage();
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        hideAllSections();
        searchResultsSection.style.display = 'block';
        searchMovies(query).then(displaySearchResults);
    }
});

// Hàm lấy dữ liệu trending
const fetchTrending = async (time_window) => {
    let response = await fetch(`https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=${TMDB_API_KEY}`);
    let data = await response.json();
    return data.results;
}

// Hàm hiển thị trending movie
const displayTrendingMovie = (movies) => {
    const movieTrend = document.getElementById("trend-movie");
    movieTrend.innerHTML = "";

    const htmls = movies.map(movie => {
        return `
        <a href="./info.html?id=${movie.id}" class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        </a>
        `
    }).join("");

    movieTrend.innerHTML = htmls;

    // Khởi tạo Swiper sau khi dữ liệu đã được thêm vào
    const swiper = new Swiper('.swiper', {
        spaceBetween: 30,
        loop: true,
        slidesPerView: "auto",
        slidesPerGroupAuto: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// Hàm lấy dữ liệu popular
const fetchPopular = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`);
    let data = await response.json();
    return data.results;
}

// Hàm hiển thị popular movie
const displayPopularMovie = (movies) => {
    const popularMovie = document.getElementById("popular-movie");
    popularMovie.innerHTML = "";

    let htmls = movies.map(movie => {
        return `
      <a href="./info.html?id=${movie.id}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.title}</p>
      </a>
    `
    }).join('')

    popularMovie.innerHTML = htmls
}

// Hàm lấy danh sách phim yêu thích từ localStorage
const fetchFavoriteMovies = () => {
    let favoriteMovies = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("movie-")) {
            try {
                favoriteMovies.push(JSON.parse(localStorage.getItem(key)));
            } catch (e) {
                console.error("Failed to parse movie data from localStorage", e);
            }
        }
    }
    return favoriteMovies;
};

// Hàm hiển thị phim yêu thích
const displayFavoriteMovies = (movies) => {
    const favoriteMoviesContainer = document.getElementById("favorite-movies-container");
    const favoriteMoviesSection = document.getElementById("favorite-movies-section");
    if (!favoriteMoviesContainer || !favoriteMoviesSection) return;

    if (movies && movies.length > 0) {
        let htmls = movies.map(movie => {
            return `
              <a href="./info.html?id=${movie.id}" class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
              </a>
            `;
        }).join('');
        favoriteMoviesContainer.innerHTML = htmls;
        favoriteMoviesSection.style.display = 'block';
    } else {
        favoriteMoviesSection.style.display = 'none';
    }
};

const renderHomePage = () => {
    const searchSection = document.getElementById("search-results-section");
    const trendingSection = document.querySelector(".trending-movie");
    const popularSection = document.querySelector(".poluplar-movie");
    const favoriteSection = document.getElementById("favorite-movies-section");
    const genreSection = document.querySelector(".genre-movie");

    hideAllSections();

    if (trendingSection) trendingSection.style.display = 'block';
    if (popularSection) popularSection.style.display = 'block';
    if (genreSection) genreSection.style.display = 'none';

    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    if (loggedInUserEmail) {
        const favoriteMovies = fetchFavoriteMovies();
        if (favoriteMovies.length > 0) {
            displayFavoriteMovies(favoriteMovies);
        } else {
            if (favoriteSection) favoriteSection.style.display = 'none';
        }
    } else {
        if (favoriteSection) favoriteSection.style.display = 'none';
    }

    if (window.location.pathname.endsWith('home.html')) {
        // Code specific to home.html if needed
    } else {
        // Code specific to index.html if needed
    }
};

// Hàm cập nhật UI dựa trên trạng thái đăng nhập
const updateUIBasedOnLogin = () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const usernameDisplay = document.getElementById("username-display");
    const avatarActionContainer = document.querySelector(".avatar-action-container");

    if (loggedInUserEmail) {
        // Người dùng đã đăng nhập: hiển thị email và nút "Đăng xuất"
        if (usernameDisplay) {
            usernameDisplay.innerText = loggedInUserEmail;
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="#" id="logout-button">Đăng xuất</a>';
        }
    } else {
        // Người dùng chưa đăng nhập: hiển thị "Guest" và nút "Đăng nhập"
        if (usernameDisplay) {
            usernameDisplay.innerText = 'Guest';
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="loginRegister.html">Đăng nhập</a>';
        }
    }
};

// Hàm xử lý đăng xuất
const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "loginRegister.html";
};

// Hàm hiển thị phim theo thể loại
const displayCategoryContent = (movies, title) => {
    const genreMovieSection = document.querySelector(".genre-movie");
    const genreMovieTitle = document.getElementById("genre-movie-title");
    const genreMovieContainer = document.getElementById("genre-movie-container");

    hideAllSections();
    genreMovieSection.style.display = 'block';
    genreMovieTitle.style.display = 'block';
    genreMovieTitle.textContent = title;
    genreMovieContainer.innerHTML = "";

    const htmls = movies.map(movie => {
        const movieTitle = movie.title || movie.name;
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
        return `
            <a href="./info.html?id=${movie.id}" class="movie-card">
              <img src="${posterPath}" alt="${movieTitle}">
              <p>${movieTitle}</p>
            </a>
        `;
    }).join('');

    genreMovieContainer.innerHTML = htmls;
};

// Hàm tìm kiếm và hiển thị phim theo thể loại
const fetchAndDisplayCategory = async (type, id, title, endpoint) => {
    try {
        let url;
        if (endpoint) {
            url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=vi-VN`;
        } else {
            url = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&language=vi-VN&sort_by=popularity.desc`;
            if (id) {
                url += `&with_genres=${id}`;
            }
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        displayCategoryContent(data.results, title);

    } catch (error) {
        console.error("Error fetching category content:", error);
    }
};

// Thêm sự kiện click cho các liên kết danh mục
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-category]');
    if (link) {
        e.preventDefault();
        const category = link.dataset.category;
        const type = categoryMapping[category]?.type || link.dataset.type;
        const id = categoryMapping[category]?.id || link.dataset.id;
        const endpoint = categoryMapping[category]?.endpoint;
        const title = link.textContent;

        if (category === 'home') {
            renderHomePage();
        } else {
            fetchAndDisplayCategory(type, id, title, endpoint);
        }
    }
    
    // Thêm sự kiện click cho nút Đăng xuất (ngay cả khi nó được tạo động)
    if (e.target && e.target.id === 'logout-button') {
        handleLogout(e);
    }
});


// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();
    fetchTrending('day').then(displayTrendingMovie);
    fetchPopular().then(displayPopularMovie);
    renderHomePage(); // Gọi hàm này để hiển thị các section đúng cách
});