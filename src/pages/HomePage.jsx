import React, {useEffect, useRef, useState} from 'react';
import Hero from "../components/layout/Hero.jsx";
import TopMovies from "../components/movies/TopMovies.jsx";
import AllMovies from "../components/layout/AllMovies.jsx";
import Pagination from "../components/layout/Pagination.jsx";
import useMovieCache from "../hooks/useMovieCache.jsx";
import {useDebounce} from "react-use";
import {getTopMovies, updateSearchCount} from "../utils/appwrite.js";
import {fetchGenres, fetchMovies} from "../api/tmdb.js";
import {useSearchParams} from "react-router-dom";
import {MAX_TOTAL_PAGES} from "../utils/config.js";

function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get("search") || '';
    const initialGenres = searchParams.get("genres")
        ? searchParams.get("genres").split(',').map(Number).filter(n => !isNaN(n))
        : [];
    const page = parseInt(searchParams.get("page"));
    const initialPage = (page >= 1 && page <= MAX_TOTAL_PAGES) ? page : 1;

    const [filters, setFilters] = useState({search: initialSearch, genres: initialGenres});
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    useDebounce(() => {
        setDebouncedFilters(filters);
    }, 500, [filters]);

    const [topMovies, setTopMovies] = useState([]);
    const [movieList, setMovieList] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [availableGenres, setAvailableGenres] = useState([])

    const [currentMoviePageNumber, setCurrentMoviePageNumber] = useState(initialPage);
    const [totalMoviePages, setTotalMoviePages] = useState(1);

    const {
        getCachedMovies,
        setCachedMovies,
        clearCache
    } = useMovieCache();

    const allMoviesRef = useRef(null);
    const firstMount = useRef(true);

    useEffect(() => {
        loadTopMovies();
        loadGenres();
    }, []);
    useEffect(() => {
        const params = {};
        if (debouncedFilters.search.trim()) params.search = debouncedFilters.search;
        if (debouncedFilters.genres.length > 0) params.genres = debouncedFilters.genres.join(',');
        if (currentMoviePageNumber !== 1) params.page = currentMoviePageNumber.toString();

        setSearchParams(params);
        loadMovies(debouncedFilters.search, debouncedFilters.genres, currentMoviePageNumber);
    }, [debouncedFilters, currentMoviePageNumber]);
    useEffect(() => {
        if (firstMount.current) {
            firstMount.current = false;
            return;
        }
        if (!isLoading)
            allMoviesRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [currentMoviePageNumber]);


    const loadMovies = async (search, genres, page) => {
        const cacheKey = `${search}_${genres.join(',')}_${page}`;
        const cached = getCachedMovies(cacheKey);

        if (cached) {
            setMovieList(cached);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const {movies, totalPages} = await fetchMovies(search, genres, page);

            setMovieList(movies);
            setTotalMoviePages(totalPages);
            setCachedMovies(cacheKey, movies);

            if (search && movies.length > 0 && page === 1) {
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
        setFilters(prev => {
            const genres = prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre];

            return {...prev, genres};
        });
        setCurrentMoviePageNumber(1);
        clearCache();
    };
    const setSearchTerm = (search) => {
        setFilters((prev) => ({...prev, search}));
        setCurrentMoviePageNumber(1);
        clearCache();
    };

    return (
        <>
            <Hero/>

            {topMovies?.length > 0 && <TopMovies movies={topMovies}/>}

            <AllMovies
                searchTerm={filters.search}
                setSearchTerm={setSearchTerm}
                availableGenres={availableGenres}
                genresFiltered={filters.genres}
                toggleGenreSelection={toggleGenreSelection}
                movieList={movieList}
                isLoading={isLoading}
                errorMessage={errorMessage}
                allMoviesRef={allMoviesRef}
            />

            <Pagination totalMoviePages={totalMoviePages} currentMoviePageNumber={currentMoviePageNumber}
                        setCurrentMoviePageNumber={setCurrentMoviePageNumber}/>
        </>
    );
}

export default HomePage;