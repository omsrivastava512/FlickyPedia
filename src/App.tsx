import React, { ReactNode } from "react";
import { useState } from "react";

import type { Movie, WatchedMovie } from "./types.tsx";

import gh from './assets/gh.webp'


import {
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
import useLocalStorage from "./hooks/useLocalStorage.tsx";


export default App;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watched, setWatched] = useLocalStorage<WatchedMovie[]>([], 'watched')
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





  return (

    <NoMobileView>
      <>
        <NavBar>
          <Search {...{ setMovies, setError, setLoading, setTotalResults, totalResults }} />
          <NumResults length={totalResults} />
        </NavBar>
        <FloatingButton>
          <a title="↗Github" target="_blank" rel="noopener" href="https://github.com/omsrivastava512/FlickyPedia">
            <img src={gh} alt="" />
          </a>
        </FloatingButton>
        <Main>
          <Box isList>
            {error ?
              <ErrorMessage message={error} /> :
              loading ?
                <Loader /> :
                <MovieList movies={movies} selectMovie={handleMovieSelection} totalResults={totalResults} />}
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



const FloatingButton = ({ children }: { children: ReactNode }) => (
  <button className="floating-btn" type="button" aria-label="Toggle Theme">
    {children}
  </button>
)
