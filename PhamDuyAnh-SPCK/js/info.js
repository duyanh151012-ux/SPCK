const TMDB_API_KEY = "c5ae30f3f204b92b4125111cca5e7e32"
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get("id")
if(movieId){
    window.location.href = "index.html";
}
const fetchMovieDatail = async()=>{
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
    let data = await res.join();
    return data
}
const displayMovieDetail = () =>{
    document.getElementById("movie-title")
}