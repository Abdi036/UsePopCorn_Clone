const average = (arr) => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

export default function Moviesummary({ watchedMovie }) {
  const watchedMovieCount = watchedMovie.length;
  const avgImdbRating =
    watchedMovieCount > 0
      ? average(watchedMovie.map((movie) => movie.imdbRating))
      : 0;
  const avgUserRating =
    watchedMovieCount > 0
      ? average(watchedMovie.map((movie) => movie.userRating))
      : 0;
  const avgRuntime =
    watchedMovieCount > 0
      ? average(watchedMovie.map((movie) => movie.runtime))
      : 0;

  return (
    <div className="watched_summary">
      <h3>MOVIES YOU WATCHED</h3>
      <div>
        <span>#️⃣ {watchedMovie.length} Movies</span>
        <span>⭐{avgImdbRating.toFixed(2)}</span>
        <span>🌟 {avgUserRating.toFixed(2)}</span>
        <span>⏳ {avgRuntime} min</span>
      </div>
    </div>
  );
}
