import { useState, useEffect } from "react";

import  StarRating  from "./StarRating";
import TextExpander from "./TextExpander";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";

import logo from "../../public/logo.png"

import type { Movie, WatchedMovie } from "../interfaces";

const MYKEY = import.meta.env.VITE_OMDB_API_KEY || "f84fc31d"


export function MovieDetails({ selectedMovie, closeMovie, addToWatched, watchedMovieRating, editWatchedRating }:
    MovieDetailsProps) {

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
                            <img src={Poster}
                                alt={`Poster of ${Title} movie`}
                                draggable="false"
                                onContextMenu={e => e.preventDefault()}
                                onError={e => {
                                    (e.currentTarget as HTMLImageElement).src = logo;
                                }}
                            />
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
                            <div className="rating tooltip-container">
                                {watchedMovieRating && !editOn ?
                                    <>
                                        <p onDoubleClick={editRating} className="tooltip-sibling">
                                            You rated this movie {watchedMovieRating} <span>⭐️</span>
                                        </p>
                                        <div className="tooltip">Double-click to edit your rating</div>
                                    </> :
                                    <StarRating size={2}
                                        submitButtonClass="btn-add"
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

interface MovieDetailsProps {
    closeMovie: () => void,
    selectedMovie: string,
    addToWatched: (m: WatchedMovie) => void,
    watchedMovieRating: number | undefined,
    editWatchedRating: (i: number) => void
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
