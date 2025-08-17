const TMDB_API_KEY = "ff0011917d08e659aeaa88ac99a6de94";

//Phần responsive cho header
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('active');
})


const fetchTreding = async (time_window)=>{
    let response = await fetch(`https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=${TMDB_API_KEY}`);

    let data = await response.json();

    // console.log(data.results);
    return data.results;
}

const displayTrendingMovie = (movies)=>{
    const movieTrend = document.querySelector("#trend-movie");
    movieTrend.innerHTML = "";

    htmls = movies.map(movie => {
        return `
        <a href="./info.html?id=${movie.id}" class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
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
let ii= document.getElementById("heart")
ii.addEventListener('click',alert("Đăng nhập để sử dụng tính năng phim yêu thích"))