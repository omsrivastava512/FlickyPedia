
export interface Movie {
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

export interface WatchedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
}


// A utility type alias for setting state in React components.
export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>