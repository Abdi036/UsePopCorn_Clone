//  http://www.omdbapi.com/?i=tt3896198&apikey={key}
import { useEffect, useState } from "react";

const key = "fd9ff071";
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isfetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

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
          console.log(data.Search);
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
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <>
              <Moviesummary />
              <WatchedMovies watchedMovies={watchedMovies} />
            </>
          )}
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

function MovieDetails({ selectedId, setSelectedId }) {
  return (
    <div className="btn_container">
      {selectedId}
      <button className="close_btn" onClick={() => setSelectedId(null)}>
        &larr;
      </button>
    </div>
  );
}
