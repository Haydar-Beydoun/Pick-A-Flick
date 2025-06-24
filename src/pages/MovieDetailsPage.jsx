import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {API_BASE_URL, API_OPTIONS} from "../utils/config.js";
import Spinner from "../components/ui/Spinner.jsx";

function MovieDetailsPage() {
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState()

    useEffect(() => {
        fetchMovieDetails();
    }, []);

    const fetchMovieDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);

            if (!res.ok)
                throw new Error('Failed to fetch movie details');

            const data = await res.json();
            setMovie(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Spinner/>;
    if (error) return <p className="text-red-500">"Error loading movie details"</p>;
    if (!movie) return <h1>Movie not found</h1>;

    return (
        <div className="movie-details">
            <h1>{movie.title}</h1>

            <div className="rating">
                <img draggable="false" src="/star.svg" alt="Star Icon"/>
                <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                <span>•</span>
                <p className="lang">{movie.original_language.toUpperCase()}</p>
                <span>•</span>
                <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : "N/A"}</p>
            </div>

            <div className="genres">
                {movie.genres?.map(genre => (
                    <span key={genre.id}>{genre.name}</span>
                ))}
            </div>

            <div className="information-container">
                <img draggable="false"
                     src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-movie.png"}
                     alt={movie.title}/>
                <div>
                    <h2>Overview</h2>
                    <p className="info">{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieDetailsPage;