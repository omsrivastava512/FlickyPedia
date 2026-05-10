import logo from '/logo.png?url'
import type { Movie } from "../types";


export function MovieList({ movies, selectMovie, totalResults }: { movies: Movie[], selectMovie: (id: string) => void; totalResults:number}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          selectMovie={() => { selectMovie(movie.imdbID) }}
        />
      ))}
      <div className="navigation-hint">
        {totalResults > 10 ? <p>💡 Use Shift +  → to navigate between pages</p> : <p>End of List</p>}
      </div>

    </ul>

  );
}

function Movie({ movie, selectMovie }: { movie: Movie, selectMovie: () => void }) {
  return (
    <li onClick={selectMovie} >
      <img src={movie.Poster}
        alt={`${movie.Title} poster`}
        draggable="false"
        onContextMenu={e => e.preventDefault()}
        onError={e => {
          (e.currentTarget as HTMLImageElement).src = logo;
        }}
      />
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
