import {API_BASE_URL, API_OPTIONS, MAX_TOTAL_PAGES} from "../utils/config.js";

export const fetchMovies = async (query = '', genreIDs = [], page = 1) => {
    const baseParams = [
        'include_adult=false',
        `page=${page}`
    ];

    const genreParams = genreIDs.length > 0 ? `&with_genres=${genreIDs.join(',')}` : '';
    if (genreParams) baseParams.push(genreParams);

    let endpoint;

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
    if (data.Response === 'False') throw new Error(data.error || 'Failed to fetch movies');


    return {
        movies: data.results || [],
        totalPages: Math.min(data.total_pages || 1, MAX_TOTAL_PAGES),
    };
}

export const fetchMovieDetails = async (id) => {
    const res = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return await res.json();
}

export const fetchGenres = async () => {
    const endpoint = `${API_BASE_URL}/genre/movie/list`;
    const response = await fetch(endpoint, API_OPTIONS);

    if (!response.ok) {
        throw new Error('Could not fetch genres');
    }

    const data = await response.json();
    return data.genres || [];
};

export const fetchTrailerURL = async (id) => {
    const res = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
    if (!res.ok) throw new Error('Failed to fetch trailers');
    const data = await res.json();
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};

export const fetchCredits = async (id) => {
    const res = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
    if (!res.ok) throw new Error('Failed to fetch crew');
    const data = await res.json();

    const directors = data.crew
        .filter(person => person.job === 'Director')
        .map(d => d.name);

    const writers = data.crew
        .filter(person => person.job === 'Writer')
        .map(w => w.name);

    // Remove duplicates
    return {
        directors: [...new Set(directors)],
        writers: [...new Set(writers)],
    };
};