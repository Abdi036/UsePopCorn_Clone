//  http://www.omdbapi.com/?i=tt3896198&apikey={key}
import { useEffect, useState } from "react";
import RatingStar from "./RatingStar";

const key = "fd9ff071";
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
            />
          ) : (
            <>
              <Moviesummary />
              <WatchedMovies
                watchedMovie={watchedMovie}
                OnhandleWatchedMovies={handleWatchedMovies}
              />
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
function WatchedMovies({ watchedMovie }) {
  return (
    <>
      {watchedMovie.map((movie, index) => (
        <div className="movieList" key={index}>
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

function MovieDetails({ selectedId, onhandleBack, OnhandleWatchedMovies }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      runtime: Number(runtime.split(" ")[0]),
    };
    OnhandleWatchedMovies(newWatchedMovie);
    onhandleBack(null);
  }

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
            <RatingStar size={24} maxRating={10} />
            <button onClick={handleAddMovie}>+ Add Movie</button>
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
