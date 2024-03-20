//  http://www.omdbapi.com/?i=tt3896198&apikey={key}
import { useEffect, useState } from "react";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const key = "fd9ff071";
export default function App() {
  const [query, setQuery] = useState("");
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isfetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function movieData() {
      async function fetchMovie() {
        try {
          setIsFetching(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Something Went Wrong Try Agin.");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found!");
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsFetching(false);
        }
      }

      if (!query || query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovie();
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
      <MainContainer>
        <Box>
          {isfetching && <Loader />}
          {!isfetching && !error && <MovieLists movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <Moviesummary />
          <WatchedMovies watchedMovies={watchedMovies} />
        </Box>
      </MainContainer>
    </>
  );
}

function Loader() {
  return (
    <div className="loader_container">
      <div className="loader"></div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="errorContainer">
      <h3 style={{ color: "red" }}>{message}</h3>
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

function MovieLists({ movies }) {
  return (
    <>
      {movies.map((movie, index) => (
        <div className="movieList" key={index}>
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
function WatchedMovies({ watchedMovies }) {
  return (
    <>
      {watchedMovies.map((movie, index) => (
        <div className="movieList" key={index}>
          <div>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
          </div>
          <div className="movie">
            <p>{movie.Title}</p>
            <div>
              <span>⭐{movie.imdbRating}</span>
              <span>🌟{movie.userRating}</span>
              <span>⏳{movie.runtime}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function Moviesummary() {
  return (
    <div className="watched_summary">
      <h3>MOVIES YOU WATCHED</h3>
      <div>
        <span>#️⃣ 2 Movies</span>
        <span>⭐8.5</span>
        <span>🌟 9.9</span>
        <span>⏳ 120 min</span>
      </div>
    </div>
  );
}
