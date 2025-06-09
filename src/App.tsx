import React from "react";
import { useEffect, useState } from "react";

import type { Movie, WatchedMovie } from "./interfaces.tsx";


import  {
    NoMobileView,
    NavBar,
    Search,
    ErrorMessage,
    Loader,
    NumResults,
    Box,
    WatchedSummary,
    MovieList,
    MovieDetails,
    WatchedMoviesList
} from "./components"


export default App;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>(getWatchedMovies);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0)




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

    <NoMobileView>
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
                selectedMovie, addToWatched,
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
    </NoMobileView>

  )
}


function Main({ children }: { children: React.ReactNode }) {
  return <main className="main">{children}</main>;
}



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
