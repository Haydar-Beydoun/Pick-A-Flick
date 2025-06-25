import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Spinner from "../components/ui/Spinner.jsx";
import {fetchCredits, fetchMovieDetails, fetchTrailerURL} from "../api/tmdb.js";
import MovieRating from "../components/movies/MovieRating.jsx";

function MovieDetailsPage() {
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
    const [trailerURL, setTrailerURL] = useState(null);
    const [crew, setCrew] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const [movieData, trailer, crewData] = await Promise.all([
                    fetchMovieDetails(id),
                    fetchTrailerURL(id),
                    fetchCredits(id),
                ]);

                setMovie(movieData);
                setTrailerURL(trailer);
                setCrew(crewData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [id]);

    if (loading) return <Spinner/>;
    if (error) return <p className="text-red-500">"Error loading movie details"</p>;
    if (!movie) return <h1>Movie not found</h1>;

    return (
        <div className="movie-details">
            <div className="heading-info">
                <h1>{movie.title || "Couldn't Get Title"}</h1>

                <MovieRating
                    vote_average={movie.vote_average}
                    original_language={movie.original_language}
                    release_date={movie.release_date}
                />

                {movie.genres?.length > 0 && (
                    <div className="genres">
                        {movie.genres.map((genre) => (
                            <span key={genre.id}>{genre.name}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="information-container">
                <img draggable="false"
                     src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-movie.png"}
                     alt="movie poster"
                     className="lg:mr-5"/>

                <div>
                    <p className="tagline">{movie?.tagline || ""}</p>

                    <h2 className="info">Overview</h2>
                    <p>{movie.overview || "No overview available"}</p>

                    <h2 className="info">Crew</h2>
                    <div className="crew-container">
                        <div>
                            <p className="crew-job">Director(s):</p>
                            {crew?.directors?.length > 0 ? (
                                <ul>
                                    {crew.directors.map((director, index) => (
                                        <li key={index}>{director}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                        <div>
                            <p className="crew-job">Writer(s):</p>
                            {crew?.writers?.length > 0 ? (
                                <ul>
                                    {crew.writers.map((writer, index) => (
                                        <li key={index}>{writer}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {trailerURL ? (
                <div className="mt-10">
                    <h2>Trailer</h2>
                    <iframe
                        className="mt-5 rounded-xl"
                        src={trailerURL}
                        title="Movie Trailer"
                        allowFullScreen
                    />
                </div>
            ) : (
                <p className="mt-10 italic text-gray-400">No trailer available.</p>
            )}
        </div>
    );
}

export default MovieDetailsPage;