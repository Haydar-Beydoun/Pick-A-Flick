import React from 'react';

function TopMovies({movies}) {
    return (
        <section className="topMovies">
            <h2>Top Movies</h2>
            <ul>
                {movies.map((movie, index) => (
                    <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img draggable='false'
                             src={!movie.poster_url.endsWith('null') ? movie.poster_url : '/no-movie.png'}
                             alt="movie poster"/>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TopMovies;