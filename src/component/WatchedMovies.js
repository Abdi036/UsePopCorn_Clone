export default function WatchedMovies({
  watchedMovie,
  OnhandleDeleteWatchedMovie,
}) {
  return (
    <>
      {watchedMovie.map((movie, index) => (
        <div className="movieList wathedMovieList" key={index}>
          <div>
            <img src={movie.poster} alt={`${movie.Title} poster`} />
          </div>
          <div className="movie">
            <p>{movie.title}</p>
            <div>
              <span>⭐{movie.imdbRating}</span>
              <span>🌟{movie.userRating}</span>
              <span>⏳{movie.runtime}</span>
            </div>
          </div>
          <div>
            <button
              className="deleteBtn"
              onClick={() => OnhandleDeleteWatchedMovie(movie.imdbID)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
