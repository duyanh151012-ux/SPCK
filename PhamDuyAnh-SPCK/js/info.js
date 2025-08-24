// info.js

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const favBtn = document.querySelector(".fa-heart");

if (!movieId) {
    window.location.href = "index.html";
}

const fetchMovieDetail = async () => {
    // Thử lấy thông tin bằng tiếng Việt
    const resVi = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${"ff0011917d08e659aeaa88ac99a6de94"}&language=vi-VN`);
    let dataVi = await resVi.json();

    // Nếu không có mô tả tiếng Việt, thử lấy bằng tiếng Anh
    if (!dataVi.overview) {
        const resEn = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${"ff0011917d08e659aeaa88ac99a6de94"}&language=en-US`);
        let dataEn = await resEn.json();
        // Gán mô tả tiếng Anh nếu có
        dataVi.overview = dataEn.overview;
    }
    return dataVi;
};

const favoriteMovie = (movie) => {
    window.localStorage.setItem(`movie-${movie.id}`, JSON.stringify(movie));
    alert(`${movie.title} đã được thêm vào mục yêu thích!`);
};

const displayMovieDetail = (movie) => {
    document.getElementById("movie-title").innerText = movie.title;

    // Kiểm tra và hiển thị mô tả
    const movieDescriptionElement = document.getElementById("movie-description");
    if (movie.overview) {
        movieDescriptionElement.innerText = movie.overview;
    } else {
        movieDescriptionElement.innerText = "Thông tin mô tả đang được cập nhật.";
    }

    document.getElementById("preview-img").src = `https://image.tmdb.org/t/p/w300/${movie.poster_path}`;
    document.getElementById("watch-now-btn").href = `https://www.youtube.com/results?sp=mAEB&search_query=${movie.title}+trailer`;
};

// Hàm mới để lấy phim tương tự
const fetchSimilarMovies = async () => {
    // Thêm tham số ngôn ngữ
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${"ff0011917d08e659aeaa88ac99a6de94"}&language=vi-VN`);
    let data = await res.json();
    return data.results;
};

const displaySimilarMovies = (movies) => {
    const similarMovieContainer = document.getElementById("similar-movie");
    similarMovieContainer.innerHTML = "";

    const htmls = movies.map(movie => {
        if (movie.poster_path) {
            return `
            <a href="./info.html?id=${movie.id}" class="swiper-slide">
              <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
              <p>${movie.title}</p>
            </a>
            `;
        }
        return '';
    }).join('');

    similarMovieContainer.innerHTML = htmls;

    // Khởi tạo Swiper sau khi dữ liệu đã được hiển thị
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
};

favBtn.addEventListener('click', () => {
    fetchMovieDetail().then(favoriteMovie);
});

fetchMovieDetail().then(displayMovieDetail);
fetchSimilarMovies().then(displaySimilarMovies);