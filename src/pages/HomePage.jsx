import React, {useEffect, useRef, useState} from 'react';
import Hero from "../components/layout/Hero.jsx";
import TopMovies from "../components/movies/TopMovies.jsx";
import AllMovies from "../components/layout/AllMovies.jsx";
import Pagination from "../components/layout/Pagination.jsx";
import useMovieCache from "../hooks/useMovieCache.jsx";
import {useDebounce} from "react-use";
import {getTopMovies, updateSearchCount} from "../utils/appwrite.js";
import {fetchGenres, fetchMovies} from "../api/tmdb.js";

function HomePage() {
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

    const allMoviesRef = useRef(null);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    useDebounce(() => setDebouncedGenresFiltered(genresFiltered), 500, [genresFiltered]);

    useEffect(() => {
        clearCache();
        setCurrentMoviePageNumber(1);
        loadMovies();
    }, [debouncedGenresFiltered, debouncedSearchTerm]);

    useEffect(() => {
        loadMovies();
    }, [currentMoviePageNumber]);

    useEffect(() => {
        loadTopMovies();
        loadGenres();
    }, []);

    const loadMovies = async () => {
        const cacheKey = `${debouncedSearchTerm}_${debouncedGenresFiltered.join(',')}_${currentMoviePageNumber}`;
        const cached = getCachedMovies(cacheKey);

        if (cached) {
            setMovieList(cached);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const {movies, totalPages} = await fetchMovies(
                debouncedSearchTerm,
                debouncedGenresFiltered,
                currentMoviePageNumber
            );

            setMovieList(movies);
            setTotalMoviePages(totalPages);
            setCachedMovies(cacheKey, movies);

            if (debouncedSearchTerm && movies.length > 0) {
                await updateSearchCount(movies[0]);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    const loadGenres = async () => {
        try {
            const genres = await fetchGenres();
            setAvailableGenres(genres);
        } catch (err) {
            console.error(err);
        }
    };
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
        <>
            <Hero/>

            {topMovies?.length > 0 && <TopMovies movies={topMovies}/>}

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
        </>
    );
}

export default HomePage;