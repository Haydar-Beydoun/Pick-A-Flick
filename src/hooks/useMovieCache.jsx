import {useCallback, useState} from 'react';

function useMovieCache() {
    const [cache, setCache] = useState({});

    const getCachedMovies = useCallback((key) => cache[key], [cache]);

    const setCachedMovies = useCallback((key, value) => {
        setCache((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearCache = useCallback(() => {
        setCache({});
    }, []);

    return {
        cache,
        getCachedMovies,
        setCachedMovies,
        clearCache,
    };
}

export default useMovieCache;