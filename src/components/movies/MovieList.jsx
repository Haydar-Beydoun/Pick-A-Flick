import React from 'react';
import MovieCard from './MovieCard.jsx';
import Spinner from '../ui/Spinner.jsx';

function MovieList({movies, isLoading, errorMessage}) {
    return (
        <div className="movie-list-container">
            {isLoading ? (
                <Spinner/>
            ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : movies.length === 0 ? (
                <p className="text-gray-400">No movies found.</p>
            ) : (
                <ul className="fade-in">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie}/>
                    ))}
                </ul>
            )}
        </div>
    );
}


export default MovieList;
