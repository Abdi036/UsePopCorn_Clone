import { useEffect, useState } from "react";
import Moviesummary from "./Moviesummary";
import MovieDetails from "./MovieDetails";
import WatchedMovies from "./WatchedMovies";
import ErrorMessage from "./ErrorMessage";

export const key = "fd9ff071";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [watchedMovie, setWatchedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isfetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  function handleBack() {
    setSelectedId(null);
  }

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleWatchedMovies(movie) {
    setWatchedMovies((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatchedMovies((watchedMovie) =>
      watchedMovie.filter((movie) => movie.imdbID !== id)
    );
  }

  useEffect(
    function movieData() {
      const controller = new AbortController();

      async function fetchMovie() {
        try {
          setIsFetching(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something Went Wrong Try Agin.");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found!");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsFetching(false);
        }
      }

      if (!query || query.length < 2) {
        setMovies([]);
        setError("");
        handleBack();
        return;
      }

      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <MovieQuantity movies={movies} />
      </Navbar>
      <MainContainer OnhandleSelectedID={handleSelectedId}>
        <Box OnhandleSelectedID={handleSelectedId}>
          {isfetching && <Loader />}
          {!isfetching && !error && (
            <MovieLists
              movies={movies}
              setSelectedId={setSelectedId}
              OnhandleSelectedID={handleSelectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onhandleBack={handleBack}
              OnhandleWatchedMovies={handleWatchedMovies}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              watchedMovie={watchedMovie}
            />
          ) : (
            <>
              <Moviesummary watchedMovie={watchedMovie} />
              <WatchedMovies
                watchedMovie={watchedMovie}
                OnhandleWatchedMovies={handleWatchedMovies}
                OnhandleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </MainContainer>
    </>
  );
}

export function Loader() {
  return (
    <div className="loader_container">
      <div className="loader"></div>
    </div>
  );
}

function Navbar({ children }) {
  return <nav className="navbar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span>🎬</span>
      <h1>UsePopCorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search"
        type="text"
        placeholder="Search movies..."
      />
    </div>
  );
}
function MovieQuantity({ movies }) {
  return (
    <div>
      <p className="movieNum">
        Found <strong>{movies.length}</strong> Movies
      </p>
    </div>
  );
}

function MainContainer({ children }) {
  return <main className="main_conatiner">{children}</main>;
}
function Box({ children }) {
  const [isopen, setIsopen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsopen((open) => !open)}>
        {isopen ? "-" : "+"}
      </button>
      {isopen && children}
    </div>
  );
}

function MovieLists({ movies, OnhandleSelectedID }) {
  return (
    <>
      {movies.map((movie, index) => (
        <div
          className="movieList"
          key={index}
          onClick={() => OnhandleSelectedID(movie.imdbID)}
        >
          <div>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
          </div>
          <div className="movie">
            <p>{movie.Title}</p>
            <span>📅 {movie.Year}</span>
          </div>
        </div>
      ))}
    </>
  );
}
