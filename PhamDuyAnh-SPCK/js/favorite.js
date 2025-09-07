// favorite.js

// Lấy danh sách phim yêu thích từ localStorage
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

// Hiển thị phim yêu thích lên trang
const displayFavoriteMovies = (movies) => {
    const favoriteMoviesContainer = document.getElementById("favorite-movies-container");
    const favoriteMoviesSection = document.getElementById("favorite-movies-section");

    if (!favoriteMoviesContainer || !favoriteMoviesSection) {
        return;
    }

    if (movies && movies.length > 0) {
        let htmls = movies.map(movie => {
            const title = movie.title || movie.name;
            const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
            return `
              <div class="movie-card" data-id="${movie.id}">
                <a href="./info.html?id=${movie.id}">
                  <img src="${posterPath}" alt="${title}">
                  <p>${title}</p>
                </a>
                <i class="fa-solid fa-trash-can delete-btn" data-id="${movie.id}"></i>
              </div>
            `;
        }).join('');
        favoriteMoviesContainer.innerHTML = htmls;
    } else {
        favoriteMoviesContainer.innerHTML = "<p>Bạn chưa thêm phim nào vào danh sách yêu thích.</p>";
    }
};

// Hàm mới để xóa phim khỏi localStorage
const deleteFavoriteMovie = (movieId) => {
    localStorage.removeItem(`movie-${movieId}`);
    alert("Phim đã được xóa khỏi danh sách yêu thích.");
    // Tải lại danh sách phim sau khi xóa
    const updatedMovies = fetchFavoriteMovies();
    displayFavoriteMovies(updatedMovies);
};

// Cập nhật UI dựa trên trạng thái đăng nhập
const updateUIBasedOnLogin = () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const usernameDisplay = document.getElementById("username-display");
    const avatarActionContainer = document.querySelector(".avatar-action-container");

    if (loggedInUserEmail) {
        if (usernameDisplay) {
            usernameDisplay.innerText = loggedInUserEmail;
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="#" id="logout-button">Đăng xuất</a>';
        }
    } else {
        if (usernameDisplay) {
            usernameDisplay.innerText = 'Guest';
        }
        if (avatarActionContainer) {
            avatarActionContainer.innerHTML = '<a href="loginRegister.html">Đăng nhập</a>';
        }
    }
};

// Xử lý đăng xuất
const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "loginRegister.html";
};

// Gắn sự kiện click cho nút Đăng xuất (ngay cả khi nó được tạo động)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout(e);
    }
    // Lắng nghe sự kiện click trên nút xóa phim
    if (e.target && e.target.classList.contains('delete-btn')) {
        const movieId = e.target.dataset.id;
        if (movieId) {
            deleteFavoriteMovie(movieId);
        }
    }
});

// Khi trang được tải, gọi các hàm để hiển thị phim và cập nhật UI
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();
    const favoriteMovies = fetchFavoriteMovies();
    displayFavoriteMovies(favoriteMovies);
});