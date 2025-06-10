import { useEffect, useRef, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import type { Movie, StateSetter } from '../types';

import w2 from '../assets/w2.png'
import w3 from '../assets/w3.png'

const MYKEY = import.meta.env.VITE_OMDB_API_KEY || "f84fc31d"


// To be used in Search bar to normalize repeated spaces
function normalizeSpaces(input: string): string {
    return input.split(/\s+/).join(" ");
}

interface YearPickerProps {
    date: Dayjs | null,
    setDate: StateSetter<Dayjs | null>
}

interface SearchProps {
    setMovies: StateSetter<Movie[]>,
    setError: StateSetter<string>,
    setLoading: StateSetter<boolean>,
    setTotalResults: StateSetter<number>
}
interface SearchInputProps {
    query: string,
    setQuery: StateSetter<string>
}
interface WordMatchProps {
    wordMatch: boolean,
    setWordMatch: StateSetter<boolean>
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
export default function Search({ setMovies, setError, setLoading, setTotalResults }:
    SearchProps) {

    const [query, setQuery] = useState("");
    const [wordMatch, setWordMatch] = useState(false)
    const [page] = useState(1);
    const [date, setDate] = useState<Dayjs | null>(null)

    const prevParams = useRef({ query, wordMatch, date, page })

    // effect to fetch results
    useEffect(() => {
        const prev = prevParams.current;
        let timeout: number = 0;
        const trimmedQuery = query.trim()

        async function fetchMovies() {
            const queryParam = (wordMatch ? 't=' : 's=') + trimmedQuery;
            const yearParam = date instanceof dayjs ? `y=${date.year()}` : "";
            const pageParam = page && `page=${page}`
            const url = `https://www.omdbapi.com/?apikey=${MYKEY}&${queryParam}&${yearParam}&${pageParam}`

            try {
                console.log("fe");
                const res = await fetch(url);
                if (!res.ok) throw new Error("Cound not fetch movies.")
                const data = await res.json();
                if (data.Response == 'False') throw new Error(data.Error);
                const searcResult = wordMatch ? [data] : data.Search
                setMovies(searcResult);
                setTotalResults(Number(data?.totalResults) || searcResult.length || 0)
            } catch (e) {
                console.log(e);
                setError(e instanceof Error ? e?.message : "An unknown error occurred.")
            } finally {
                setLoading(false)
            }
        }



        const PARAMS_CHANGED = prev.query != trimmedQuery ||
            prev.date?.year?.() != (date?.year?.() ?? null) ||
            prev.wordMatch != wordMatch || prev.page != page;

        const EMPTY_QUERY = trimmedQuery.length == 0;
        const QUERY_TOO_SHORT = (trimmedQuery.length < 3 && !wordMatch)
        const INVALID_YEAR = (date instanceof Object && (date.year() < 1900 || date.year?.() > dayjs().year()))
       
        if (EMPTY_QUERY || QUERY_TOO_SHORT || INVALID_YEAR) {
            setError("Search a movie.");
            setMovies([]);
            setTotalResults(0)
        }
        else if(PARAMS_CHANGED){  
            setError("")
            setLoading(true);
            timeout = setTimeout(fetchMovies, 700);
        }
        return () => {
            prevParams.current = { query: trimmedQuery, wordMatch, date, page }
            clearTimeout(timeout)
        };
    }, [query, setMovies, setError, setLoading, setTotalResults, wordMatch, date, page])


    return (
        <div className="search">
            <SearchInput {...{ query, setQuery }} />
            <YearPicker {...{ date, setDate }} />
            <WordMatchButton {...{ wordMatch, setWordMatch }} />
        </div>
    );
}

const SearchInput = ({ query, setQuery }: SearchInputProps) => {
    const searchBar = useRef<HTMLInputElement>(null)

    // effect to capture keydown
    useEffect(() => {
        const focusOnSearch = (e: KeyboardEvent) => {
            const active = document.activeElement;

            const IS_EDITABLE =  (
                    ((active as HTMLElement).isContentEditable ||
                    ['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName || ""))
                )
            if (
                active && 
                active !== searchBar.current 
                && !IS_EDITABLE 
                && /^[a-zA-Z0-9 ]$/.test(e.key)
            ) searchBar?.current?.focus();

        }
        document.addEventListener("keydown", focusOnSearch)
        return () => document.removeEventListener("keydown", focusOnSearch);
    }, [])

    return (<input
        ref={searchBar}
        className="searchInput"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(normalizeSpaces(e.target.value))}
    />)
}
const YearPicker = ({ date, setDate }: YearPickerProps) => {

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

    return (<div className="yearInput tooltip-container">
        <button className="btn-clear" onClick={() => setDate(null)}>x</button>
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
        <div className="tooltip" >Enter Release Year</div>
    </div>)
}
const WordMatchButton = ({ wordMatch, setWordMatch }: WordMatchProps) => {
    return (
        <div className="tooltip-container">
            <button className="btn-search tooltip-sibling" onClick={() => setWordMatch(w => !w)}>
                <img className="searchIcon" src={`${wordMatch ? w2 : w3}`} alt="word-match-icon" draggable="false" onContextMenu={e => e.preventDefault()} />
            </button>
            <div className="tooltip">Match Whole Word</div>
        </div>
    )
}