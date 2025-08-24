const TMDB_API_KEY = "ff0011917d08e659aeaa88ac99a6de94";

//Phần responsive cho header
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

// Hàm để ẩn tất cả các sections chính
const hideAllSections = () => {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
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

// Hàm hiển thị kết quả tìm kiếm
const displaySearchResults = (movies) => {
  searchResultsContainer.innerHTML = "";
  if (movies.length === 0) {
    searchResultsContainer.innerHTML = "<p>Không tìm thấy phim nào.</p>";
    return;
  }
  const htmls = movies.map(movie => {
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
    return `
      <a href="./info.html?id=${movie.id}" class="movie-card">
        <img src="${posterPath}" alt="${movie.title}">
        <p>${movie.title}</p>
      </a>
    `;
  }).join('');
  searchResultsContainer.innerHTML = htmls;
};

// Event listener cho biểu tượng kính lúp
searchIcon.addEventListener('click', (e) => {
  e.preventDefault();
  searchContainer.style.display = 'flex';
  searchInput.focus();
  searchIcon.style.display = 'none';
  hideAllSections();
  searchResultsSection.style.display = 'block';
});

// Event listener cho nút đóng tìm kiếm
closeSearchBtn.addEventListener('click', () => {
  searchContainer.style.display = 'none';
  searchInput.value = '';
  searchIcon.style.display = 'block';
  searchResultsSection.style.display = 'none';
  // Hiển thị lại các sections ban đầu
  document.querySelector('.carousel').style.display = 'block';
  document.querySelector('.trend-movie.container').style.display = 'block';
  document.querySelector('.poluplar-movie.container').style.display = 'block';
});

// Event listener cho input tìm kiếm
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value;
    searchMovies(query).then(displaySearchResults);
  }
});

const fetchTreding = async (time_window)=>{
    let response = await fetch(`https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=${TMDB_API_KEY}`);

    let data = await response.json();

    // console.log(data.results);
    return data.results;
}

const displayTrendingMovie = (movies)=>{
    const movieTrend = document.getElementById("trend-movie");
    movieTrend.innerHTML = "";

    htmls = movies.map(movie => {
        return `
        <a href="./info.html?id=${movie.id}" class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        </a>
        `
    }).join("");

    movieTrend.innerHTML = htmls;
    // console.log(htmls);
}
const fetchPopular = async ()=>{
  let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`);
  let data = await response.json();
  return data.results;
}

const displayPopularMovie = (movies)=>{
  const popularMovie = document.querySelector("#popular-movie");
  popularMovie.innerHTML = "";

  let htmls = movies.map(movie => {
    return  `
      <a href="./info.html?id=${movie.id}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.title}</p>
      </a>
    `
  }).join('')

  popularMovie.innerHTML = htmls;
}
// main.js

// ... (các hàm fetchTrending, displayTrendingMovie, fetchPopular, v.v.)

// Hàm kiểm tra trạng thái đăng nhập và cập nhật UI
const updateUIBasedOnLogin = () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const usernameDisplay = document.getElementById("username-display");
    const avatarActionContainer = document.getElementById("avatar-action-container");

    if (loggedInUserEmail) {
        // Người dùng đã đăng nhập: hiển thị email và nút Đăng xuất
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

// Thêm sự kiện click cho nút Đăng xuất (ngay cả khi nó được tạo động)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout(e);
    }
});

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();
    // ... (các hàm fetchTrending, fetchPopular, v.v. đã có sẵn)
});

// ... (các hàm và sự kiện khác)

fetchTreding('day').then(displayTrendingMovie)
fetchPopular().then(displayPopularMovie)



const swiper = new Swiper('.swiper', {
    spaceBetween: 30,
    loop: true,
    slidesPerView: "auto",
    slidesPerGroupAuto: true,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });