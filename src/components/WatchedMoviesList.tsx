import type { WatchedMovie } from "../types";

import logo from '../../public/logo.png'

interface WatchedMovieProps {
  watched: WatchedMovie[],
  deleteFromWatched: (i: string) => void,
  selectMovie: (id: string) => void
}


export function WatchedMoviesList({ watched, deleteFromWatched, selectMovie }
  : WatchedMovieProps) {
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
    <li className="tooltip-container">
      <img src={movie.Poster}
        alt={`${movie.Title} poster`}
        className="tooltip-sibling"
        draggable="false"
        onContextMenu={e => e.preventDefault()}
        onError={e => {
          (e.currentTarget as HTMLImageElement).src = logo;
        }}
      />
      <h3 className="tooltip-sibling" onDoubleClick={() => selectMovie(movie.imdbID)}>
        {movie.Title}
      </h3>
      <div className="tooltip">Double-click To Open</div>


      <div >
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p  >
          <span >🌟</span>
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
