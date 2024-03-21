import { useEffect, useState } from "react";
import RatingStar from "./RatingStar";
import { key, Loader } from "./App";

export default function MovieDetails({
  selectedId,
  onhandleBack,
  OnhandleWatchedMovies,
  watchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watchedMovie
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const userRateGiven = watchedMovie.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    Year: year,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    OnhandleWatchedMovies(newWatchedMovie);
    onhandleBack();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopCorn";
      };
    },
    [title]
  );

  useEffect(
    function movieInfoWrap() {
      async function movieInfo() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      movieInfo();
    },
    [selectedId]
  );
  return (
    <div className="Details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="close_btn_container">
            <button className="close_btn" onClick={onhandleBack}>
              &larr;
            </button>
            <div>
              <img src={poster} alt={title} />
            </div>
            <div className="movie_description">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </div>

          <div className="rate_container">
            {!isWatched ? (
              <>
                <RatingStar
                  size={24}
                  maxRating={10}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button onClick={handleAddMovie}>+ Add Movie</button>
                )}
              </>
            ) : (
              <p>you Rated this movie {userRateGiven} ⭐</p>
            )}
          </div>
          <div className="description">
            <p>{plot}</p>
            <h3>{actors}</h3>
            <h3>Directed By:{director}</h3>
          </div>
        </>
      )}
    </div>
  );
}
