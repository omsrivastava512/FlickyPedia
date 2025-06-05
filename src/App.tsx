import React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { StarRating } from "./StarRating.tsx";
import TextExpander from "./TextExpander.tsx";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";


import logo from '../public/logo.png'
import w2 from './assets/w2.png'
import w3 from './assets/w3.png'
import { useIsMobileView } from "./Hooks.tsx";



export default App;

// A utility type alias for setting state in React components.
type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Runtime?: string;
  Genre?: string;
  Actors?: string;
  Plot?: string;
  Director?: string;
  imdbRating?: string | number;
  userRating?: number;
  Released?: string | number;
}

interface WatchedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
}


const MYKEY = import.meta.env.VITE_OMDB_API_KEY || "f84fc31d"


const average = (arr: number[]) =>
  parseFloat((arr.reduce((acc, cur) => acc + cur || acc, 0) / arr.length).toFixed(2)) || 0 as Readonly<number>;


const getLocalData = (key: string) => {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) return null;
  try {
    return JSON.parse(storedValue);
  } catch {
    return null;
  }
}



const getWatchedMovies = () => {
  const value = getLocalData("watched");
  return value || []
}

function normalizeSpaces(input: string): string {
  return input.split(/\s+/).join(" ");
}



function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>(getWatchedMovies);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0)
  const isMobileView = useIsMobileView()

  
  


  const handleMovieSelection = (id: string) => {
    setSelectedMovie(s => s === id ? null : id);
  }

  const addToWatched = (movie: WatchedMovie) => {
    setWatched(w => [...w, movie])
  }

  const deleteFromWatched = (id: string) => {
    setWatched(w => w.filter((m: WatchedMovie) => m.imdbID != id))
  }

  const editWatchedRating = (userRating: number) => {
    if (!selectedMovie) return;
    setWatched(w => w.map(m => m.imdbID == selectedMovie ? { ...m, userRating } : m));
  }

  const getWatchedMovieRating = () => {
    return watched.find(w => w.imdbID == selectedMovie)?.userRating
  }

  const handleCloseMovie = () => {
    setSelectedMovie(null)
  }

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  

  return (
    isMobileView? 
    <MobileWarning/>:
    <>
      <NavBar>
        <Search {...{ setMovies, setError, setLoading, setTotalResults }} />
        <NumResults length={totalResults} />
      </NavBar>
      <Main>
        <Box>
          {error ?
            <ErrorMessage message={error} /> :
            loading ?
              <Loader /> :
              <MovieList movies={movies} selectMovie={handleMovieSelection} />}
        </Box>

        <Box>
          {selectedMovie ?
            <MovieDetails{...{
              closeMovie: handleCloseMovie,
              selectedMovie,
              addToWatched,
              watchedMovieRating: getWatchedMovieRating(),
              editWatchedRating,
            }}
            /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} deleteFromWatched={deleteFromWatched} selectMovie={handleMovieSelection} />
            </>
          }
        </Box>
      </Main>
    </>
  );
}


const MobileWarning =()=>{
  return <div className=".overlay">
    <div className="modal">
      <h1 style={{fontSize:'5vw'}}>Destop Mode Required</h1>
      <p style={{fontSize:'3vw'}}>Please open this app on a desktop device or request desktop view through your browser settings.</p>
    </div>
  </div>
}

function NavBar({ children }: { children: React.ReactNode }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo" >
      <span role="img"><img src={logo} width="40vw" alt="" draggable="false" onContextMenu={e=>e.preventDefault()} /></span>
      <h1 >FlickyPedia</h1>
    </div>
  );
}


function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="error">
      {message}
    </p>
  );
}

const BLANKMOVIE = {
  imdbID: "",
  Title: "",
  Year: "",
  Poster: "",
  Runtime: "",
  Genre: "",
  Actors: "",
  Plot: "",
  Director: "",
  imdbRating: "",
  userRating: 0,
  Released: ""
}

function MovieDetails({ selectedMovie, closeMovie, addToWatched, watchedMovieRating, editWatchedRating }:
  { closeMovie: () => void, selectedMovie: string, addToWatched: (m: WatchedMovie) => void, watchedMovieRating: number | undefined, editWatchedRating: (i: number) => void }) {

  const [movie, setMovie] = useState<Movie>(BLANKMOVIE);
  const [loading, setLoading] = useState<boolean>(true)
  const [userRating, setUserRating] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [editOn, setEditOn] = useState<boolean>(Boolean(!watchedMovieRating))


  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
  } = movie;

  const handleSubmit = () => {
    if (watchedMovieRating) {
      editWatchedRating(userRating)
    }
    else if (!watchedMovieRating) {
      const newWatched = {
        imdbID: selectedMovie,
        Title,
        Year,
        Poster,
        runtime: Number(Runtime?.split(" ")[0]) || 0,
        imdbRating: Number(imdbRating) || 0,
        userRating
      }
      addToWatched(newWatched);
    }
    setEditOn(false)

  }

  const editRating = () => {
    setEditOn(true)
  }

  // Effect to alter page title
  useEffect(() => {
    if (!Title) return;
    document.title = `Movie | ${Title}`
    return () => { document.title = 'FlickyPedia' }
  }, [selectedMovie, Title])

  // Effect to fetch details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`https://www.omdbapi.com/?apikey=${MYKEY}&plot=full&i=${selectedMovie}`);
        if (!res.ok) throw new Error(res.status + ": Unable to fetch movie details");
        const data = await res.json();
        if (data.Response == 'False') throw new Error(data.Error)
        setMovie(data)
      } catch (e) {
        const message = e instanceof Error ? e.message : "Connection Error Occurred"
        console.log(message);
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
    return () => setMovie(BLANKMOVIE)
  }, [selectedMovie])

  // Effect for keydown event
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code == "Escape")
        closeMovie()
    }
    document.addEventListener("keydown", keydownHandler)
    return () => document.removeEventListener("keydown", keydownHandler)
  }, [closeMovie])

  return <div className="details">
    {loading ? (
      <Loader />
    ) :
      error ?
        <>
          <button className="btn-back" onClick={closeMovie}>
            &larr;
          </button>

          <ErrorMessage message={error} />

        </>
        : (
          <>
            <header>
              <button className="btn-back" onClick={closeMovie}>
                &larr;
              </button>
              <img src={Poster} alt={`Poster of ${Title} movie`}  draggable="false" onContextMenu={e=>e.preventDefault()} />
              <div className="details-overview">
                <h2>{Title}</h2>
                <p>
                  {movie?.Released} &bull; {Runtime}
                </p>
                <p>{movie?.Genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {watchedMovieRating && !editOn ?
                  <p onDoubleClick={editRating} className="tooltip-container">
                    You rated this movie {watchedMovieRating} <span>⭐️</span>
                    <div className="tooltip">Double-click to edit your rating</div>
                  </p> :
                  <StarRating size={2}
                    submitButtonClass="btn-add"
                    resetButtonClass="btn-reset"
                    setExternalRating={setUserRating}
                    submitButtonContent="Add to list"
                    submitFunction={handleSubmit}
                  />
                }
              </div>
              <p>
                <em><TextExpander visibleWords={20}>
                  {movie?.Plot || ""}
                </TextExpander>
                </em>
              </p>
              <p>Starring {movie?.Actors}</p>
              <p>Directed by {movie?.Director}</p>
            </section>
          </>
        )
    }
  </div>

}

/**
 * Search component for finding movies using the OMDB API.
 * 
 * Provides a search interface with the following features:
 * - Text input with auto-focus on keypress
 * - Year picker for filtering by release year
 * - Toggle between partial and exact word matching
 * - Debounced search with 700ms delay
 * - Input validation and error handling
 * 
 * @param setMovies - State setter for the movies array results
 * @param setError - State setter for error messages
 * @param setLoading - State setter for loading state
 * @param setTotalResults - State setter for total number of search results
 * 
 * @remarks
 * - Automatically focuses search input when user types alphanumeric characters
 * - Requires minimum 3 characters for partial search, no minimum for exact match
 * - Year filter accepts years from 1900 to current year
 * - Uses OMDB API with custom API key for movie data retrieval
 * - Implements Material-UI DatePicker with custom dark theme
 */
function Search({ setMovies, setError, setLoading, setTotalResults }:
  { setMovies: StateSetter<Movie[]>, setError: StateSetter<string>, setLoading: StateSetter<boolean>, setTotalResults: StateSetter<number> }) {

  const [query, setQuery] = useState("");
  const [wordMatch, setWordMatch] = useState(false)
  const [page] = useState(1);
  const [date, setDate] = useState<Dayjs | null>(null)

  const searchBar = useRef<HTMLInputElement>(null)
  const yearTooltip = useRef<HTMLInputElement>(null)




  // effect to capture keydown
  useEffect(() => {
    const focusOnSearch = (e: KeyboardEvent) => {
      const active = document.activeElement;

      if (/^[a-zA-Z0-9 ]$/.test(e.key) && active &&
        active !== searchBar.current &&
        !(((active as HTMLElement).isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName || "")))
      ) searchBar?.current?.focus();

    }
    document.addEventListener("keydown", focusOnSearch)
    return () => document.removeEventListener("keydown", focusOnSearch);
  }, [])

  // effect to fetch results
  useEffect(() => {
    let timeout: number = 0;


    async function fetchMovies() {
      const queryParam = (wordMatch ? 't=' : 's=') + query.trim();
      const yearParam = date instanceof dayjs ? `y=${date.year()}` : "";
      const pageParam = page && `page=${page}`
      const url = `https://www.omdbapi.com/?apikey=${MYKEY}&${queryParam}&${yearParam}&${pageParam}`
     


      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Cound not fetch movies.")
        const data = await res.json();
        if (data.Response == 'False') throw new Error(data.Error);
        setMovies(wordMatch ? [data] : data.Search);
        setTotalResults(Number(data?.totalResults) || 0)
      } catch (e) {
        console.log(e);
        setError(e instanceof Error ? e?.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }
    const EMPTYQUERY = query.trim().length == 0;
    const QUERYTOOSHORT = (query.trim().length < 3 && !wordMatch)
    const INVALIDYEAR = (date instanceof Object && (date.year() < 1900 || date.year() > dayjs().year()))
    if (EMPTYQUERY || QUERYTOOSHORT || INVALIDYEAR) {
      setError("Search a movie.");
      setMovies([]);
      setTotalResults(0)
    }

    else {
      setError("")
      setLoading(true);
      timeout = setTimeout(fetchMovies, 700);
    }
    return () => {
      clearTimeout(timeout)
    };
  }, [query, setMovies, setError, setLoading, setTotalResults, wordMatch, date, page])


  // Memoize the theme to prevent recreation on every render
  const datePickerTheme = useMemo(() => createTheme({
    // ...theme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#fff',   // for the selection outline and picker selector
        contrastText: '#000',  // for the text inside the picker
      },
      text: {
        primary: '#000000',   // for the value
        secondary: "#5a5959",  // for the label
      },
    },
    typography: {
      body1: {
        fontWeight: 400,
        lineHeight: 1.39,
        letterSpacing: '0.03em',
        fontSize: '.9vw',
        justifySelf: 'center'
      },

    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            fontSize: '50px',
            fontWeight: '600',
            borderRadius: '2px',
            padding: '',
            backgroundColor: 'transparent',
          }
        }
      },

      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: '#fff',
            borderRadius: '2px',
            borderColor: 'hsl(215, 15%, 50%)',
            backgroundColor: 'rgb(17, 17, 17)',
          }
        }
      }
    } as never
  }), []);

  return (
    <div className="search">
      <input
        ref={searchBar}
        className="searchInput"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(normalizeSpaces(e.target.value))}
      />


      <div className="yearInput tooltip-container">
        <ThemeProvider theme={datePickerTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="tooltip-sibling"
              yearsOrder="desc"
              value={date}
              onChange={setDate}
              maxDate={dayjs()}
              yearsPerRow={3}
              views={['year']}

              slotProps={{
                textField: {
                  inputProps: {
                    readOnly: true,
                    tabIndex: -1,
                  },
                  onKeyDown: (e: React.KeyboardEvent) => {
                    // Only prevent input characters, allow navigation keys
                    if (e.key.length === 1) {
                      e.preventDefault();
                    }
                  },
                },
                openPickerIcon: {
                  sx: {
                    fill: 'black',
                  },
                },
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
        <div className="tooltip" ref={yearTooltip}>Enter Release Year</div>
      </div>

      <div className="tooltip-container">
        <button className="btn-search tooltip-sibling" onClick={() => setWordMatch(w => !w)}>
          <img className="searchIcon" src={`${wordMatch ? w2 : w3}`} alt="word-match-icon"  draggable="false" onContextMenu={e=>e.preventDefault()} />
        </button>
        <div className="tooltip">Match Whole Word</div>
      </div>
    </div>
  );
}

function NumResults({ length }: { length: number }) {
  return (
    <p className="num-results">
      Found <strong>{length}</strong> results
    </p>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return <main className="main">{children}</main>;
}

function Box({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (

    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}


function MovieList({ movies, selectMovie }: { movies: Movie[], selectMovie: (id: string) => void }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          selectMovie={() => { selectMovie(movie.imdbID) }}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, selectMovie }: { movie: Movie, selectMovie: () => void }) {
  return (
    <li onClick={selectMovie} >
      <img src={movie.Poster} alt={`${movie.Title} poster`}  draggable="false" onContextMenu={e=>e.preventDefault()} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }: { watched: WatchedMovie[] }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>

    </div>
  );
}

function WatchedMoviesList({ watched, deleteFromWatched, selectMovie }:
  { watched: WatchedMovie[], deleteFromWatched: (i: string) => void, selectMovie: (id: string) => void }) {
  return (
    <ul className="list list-watched ">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} deleteFromWatched={deleteFromWatched} selectMovie={selectMovie} />
      ))}

    </ul>

  );
}

function WatchedMovie({ movie, deleteFromWatched, selectMovie }: { movie: WatchedMovie, deleteFromWatched: (id: string) => void, selectMovie: (id: string) => void }) {

  return (
    <li onDoubleClick={() => selectMovie(movie.imdbID)} className="tooltip-container">
      <img src={movie.Poster} alt={`${movie.Title} poster`} className="tooltip-sibling"  draggable="false" onContextMenu={e=>e.preventDefault()} />
      <div className="tooltip">Double-click To Open</div>
      <h3>{movie.Title}</h3>

      <div >
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteFromWatched(movie.imdbID)
          }}
        >
          X
        </button>

      </div>

    </li>
  );
}
