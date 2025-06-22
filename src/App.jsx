import React, {useEffect, useRef, useState} from 'react';
import {useDebounce} from "react-use";
import {getTopMovies, updateSearchCount} from "./utils/appwrite.js";
import TopMovies from "./components/movies/TopMovies.jsx";
import Hero from "./components/layout/Hero.jsx";
import AllMovies from "./components/layout/AllMovies.jsx";
import Pagination from "./components/layout/Pagination.jsx";
import useMovieCache from "./hooks/useMovieCache.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [topMovies, setTopMovies] = useState([]);
    const [movieList, setMovieList] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [genresFiltered, setGenresFiltered] = useState([]);
    const [debouncedGenresFiltered, setDebouncedGenresFiltered] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([])

    const [currentMoviePageNumber, setCurrentMoviePageNumber] = useState(1);
    const [totalMoviePages, setTotalMoviePages] = useState(1);
    const {
        getCachedMovies,
        setCachedMovies,
        clearCache
    } = useMovieCache();


    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    useDebounce(() => setDebouncedGenresFiltered(genresFiltered), 500, [genresFiltered]);

    useEffect(() => {
        // Clearing cache when search or filter change to prevent stale data
        clearCache();

        if (currentMoviePageNumber !== 1) {
            setCurrentMoviePageNumber(1);
        } else {
            fetchMovies(debouncedSearchTerm, debouncedGenresFiltered, 1);
        }
    }, [debouncedGenresFiltered, debouncedSearchTerm]);
    useEffect(() => {
        fetchMovies(debouncedSearchTerm, genresFiltered, currentMoviePageNumber);
    }, [currentMoviePageNumber]);
    useEffect(() => {
        loadTopMovies();
        getAvailableGenres();
    }, []);


    const allMoviesRef = useRef(null);

    const fetchMovies = async (query = '', genreIDs = [], page = 1) => {
        const cacheKey = `${query}_${genreIDs.join(',')}_${page}`;

        const cached = getCachedMovies(cacheKey);
        if (cached) {
            console.log("Movie cache found");
            setMovieList(cached);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const baseParams = [
                'include_adult=false',
                `page=${page}`
            ];

            const genreParams = genreIDs.length > 0 ? `&with_genres=${genreIDs.join(',')}` : '';
            if (genreParams) baseParams.push(genreParams);

            let endpoint = '';

            if (query) {
                baseParams.push(`query=${encodeURIComponent(query)}`);
                endpoint = `${API_BASE_URL}/search/movie?${baseParams.join('&')}`;
            } else {
                baseParams.push('sort_by=popularity.desc');
                baseParams.push('certification_country=US');
                baseParams.push('certification.gte=G');
                baseParams.push('certification.lte=R');

                endpoint = `${API_BASE_URL}/discover/movie?${baseParams.join('&')}`;
            }

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) throw new Error('Could not fetch movies');

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            const movies = data.results || [];
            const totalPages = Math.min(data.total_pages, 25);

            setMovieList(movies);
            setTotalMoviePages(totalPages);
            setCachedMovies(cacheKey, movies);

            if (query && movies.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        } catch (err) {
            console.log(err);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }
    const getAvailableGenres = async () => {
        try {
            const endpoint = `${API_BASE_URL}/genre/movie/list`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Could not fetch genres');
            }

            const data = await response.json();

            setAvailableGenres(data.genres || []);

        } catch (err) {
            console.log(err);
        }
    }
    const loadTopMovies = async () => {
        try {
            const movies = await getTopMovies();

            setTopMovies(movies);

        } catch (err) {
            console.log(err);
        }
    }
    const toggleGenreSelection = (genre) => {
        setGenresFiltered(prevGenres =>
            prevGenres.includes(genre)
                ? prevGenres.filter(g => g !== genre)
                : [...prevGenres, genre]
        );
    }

    return (
        <main>
            <div className="pattern "/>
            <div className="wrapper ">
                <Hero/>

                {topMovies.length > 0 && <TopMovies movies={topMovies}/>}

                <AllMovies
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    availableGenres={availableGenres}
                    genresFiltered={genresFiltered}
                    toggleGenreSelection={toggleGenreSelection}
                    movieList={movieList}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    allMoviesRef={allMoviesRef}
                />

                <Pagination totalMoviePages={totalMoviePages} currentTrendingPage={currentMoviePageNumber}
                            setCurrentMoviePageNumber={setCurrentMoviePageNumber} allMoviesRef={allMoviesRef}/>

            </div>
        </main>
    );
}

export default App;