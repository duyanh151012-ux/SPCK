// main.js

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
    '80': { title: 'Phim Hình Sự', type: 'movie', id: 80 },
    '18': { title: 'Phim Chính Kịch', type: 'movie', id: 18 },
    '99': { title: 'Phim Tài Liệu', type: 'movie', id: 99 },
    '28': { title: 'Phim Hành Động', type: 'movie', id: 28 },
    '12': { title: 'Phim Phiêu Lưu', type: 'movie', id: 12 },
    '14': { title: 'Phim Giả Tưởng', type: 'movie', id: 14 },
    '27': { title: 'Phim Kinh Dị', type: 'movie', id: 27 },
    '10749': { title: 'Phim Lãng Mạn', type: 'movie', id: 10749 }
};

// Hiển thị nội dung danh mục
const displayCategoryContent = (movies, title) => {
    const mainSection = document.getElementById("main-section");
    const popularMovieSection = document.getElementById("popular-movie-section");
    const genreMovieSection = document.querySelector(".genre-movie");
    const genreMovieTitle = document.getElementById("genre-movie-title");
    const genreMovieContainer = document.getElementById("genre-movie-container");

    popularMovieSection.style.display = 'none';
    genreMovieSection.style.display = 'block';
    genreMovieTitle.innerText = title;
    genreMovieTitle.style.display = 'block';

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

    genreMovieContainer.innerHTML = htmls;
};

// Hàm mới để hiển thị phim thịnh hành vào Swiper
// main.js

// ... (các mã khác của bạn) ...

// Hàm mới để hiển thị phim thịnh hành vào Swiper
const displayTrendingMovies = (movies) => {
    const trendingMoviesContainer = document.getElementById("trending-movies-container");
    if (!trendingMoviesContainer) return;

    const htmls = movies.map(movie => {
        const title = movie.title || movie.name;
        // Sử dụng ảnh có kích thước nhỏ hơn một chút cho poster trong Swiper để tăng hiệu suất
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
        return `
            <a href="./info.html?id=${movie.id}" class="swiper-slide movie-card">
                <img src="${posterPath}" alt="${title}">
                <p>${title}</p>
            </a>
        `;
    }).join('');

    trendingMoviesContainer.innerHTML = htmls;

    // Khởi tạo Swiper
    new Swiper('.trending-swiper', {
        slidesPerView: "auto", // Quan trọng: Cho phép Swiper tự động tính toán số lượng slide dựa trên width của slide
        spaceBetween: 20,    // Khoảng cách giữa các slide (điều chỉnh theo ý bạn)
        loop: true,
        centeredSlides: false, // Nếu bạn muốn các slide không bị căn giữa khi ít slide
        grabCursor: true, // Thêm hiệu ứng con trỏ tay khi di chuột
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Thêm responsive breakpoints nếu bạn muốn điều chỉnh hiển thị trên các kích thước màn hình khác nhau
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1200: {
                slidesPerView: 5, // Ví dụ: 5 phim trên màn hình lớn
                spaceBetween: 30,
            }
        }
    });
};

// ... (các mã khác của bạn) ...

const fetchAndDisplayTrendingMovies = async () => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=vi-VN`);
        const data = await res.json();
        const trendingMoviesContainer = document.getElementById("trending-movies-container");
        if (!trendingMoviesContainer) return;

        const htmls = data.results.map(movie => {
            const title = movie.title || movie.name;
            const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
            return `
                <a href="./info.html?id=${movie.id}" class="movie-card">
                    <img src="${posterPath}" alt="${title}">
                    <p>${title}</p>
                </a>
            `;
        }).join('');
        trendingMoviesContainer.innerHTML = htmls;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
    }
};


// Giữ nguyên hàm fetchAndDisplayPopularMovies của bạn
const fetchAndDisplayPopularMovies = async () => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN`);
        const data = await res.json();
        const popularMovieContainer = document.getElementById("popular-movie");
        if (!popularMovieContainer) return;

        const htmls = data.results.map(movie => {
            const title = movie.title || movie.name;
            const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
            return `
                <a href="./info.html?id=${movie.id}" class="movie-card">
                    <img src="${posterPath}" alt="${title}">
                    <p>${title}</p>
                </a>
            `;
        }).join('');
        popularMovieContainer.innerHTML = htmls;

    } catch (error) {
        console.error("Error fetching popular movies:", error);
    }
};

const fetchAndDisplayCategory = async (type, id, title, endpoint) => {
    try {
        let url = `https://api.themoviedb.org/3/${endpoint ? endpoint : type + '/popular'}?api_key=${TMDB_API_KEY}&language=vi-VN&sort_by=popularity.desc`;
        if (id) {
            url += `&with_genres=${id}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        displayCategoryContent(data.results, title);

    } catch (error) {
        console.error("Error fetching category content:", error);
    }
};
// main.js

// ... (các mã khác của bạn, giữ nguyên) ...

// Cập nhật UI dựa trên trạng thái đăng nhập
const updateUIBasedOnLogin = () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const isGuestUser = localStorage.getItem("isGuestUser");
    const usernameDisplay = document.getElementById("username-display");
    const avatarActionContainer = document.querySelector(".avatar-action-container");
    const favoriteLink = document.querySelector(".favorite-link");
    const favoriteSection = document.getElementById("favorite-movies-section");

    // Trường hợp đã đăng nhập
    if (loggedInUserEmail) {
        if (usernameDisplay) {
            usernameDisplay.innerText = loggedInUserEmail;
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="#" id="logout-button">Đăng xuất</a>';
        }
        if (favoriteLink) {
            favoriteLink.style.display = 'block'; // Hiển thị nút yêu thích
        }
        if (favoriteSection) {
            favoriteSection.style.display = 'block'; // Hiển thị phần phim yêu thích
        }
    } 
    // Trường hợp tài khoản khách
    else if (isGuestUser) {
        if (usernameDisplay) {
            usernameDisplay.innerText = 'Khách';
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="loginRegister.html">Đăng nhập</a>';
        }
        if (favoriteLink) {
            favoriteLink.style.display = 'none'; // Ẩn nút yêu thích
        }
        if (favoriteSection) {
            favoriteSection.style.display = 'none'; // Ẩn phần phim yêu thích
        }
    } 
    // Trường hợp chưa đăng nhập
    else {
        if (usernameDisplay) {
            usernameDisplay.innerText = 'Guest';
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="loginRegister.html">Đăng nhập</a>';
        }
        if (favoriteLink) {
            favoriteLink.style.display = 'none'; // Ẩn nút yêu thích
        }
        if (favoriteSection) {
            favoriteSection.style.display = 'none'; // Ẩn phần phim yêu thích
        }
    }
};

// Xử lý đăng xuất
const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("isGuestUser");
    window.location.href = "index.html";
};

// Gắn sự kiện click cho nút Đăng xuất (ngay cả khi nó được tạo động)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout(e);
    }
});

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();
    fetchAndDisplayPopularMovies();
    fetchAndDisplayTrendingMovies(); // Gọi hàm mới
});
