function TopMovies({movies}) {
    if (!movies || movies.length === 0) {
        return <p className="text-red-400 mt-20">Couldn't load top movies</p>;
    }

    return (
        <section className="top-movies">
            <h2>Top Movies</h2>
            <ul>
                {movies.map((movie, index) => (
                    <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img draggable='false'
                             src={movie.poster_url || '/no-movie.png'}
                             alt="movie poster"/>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TopMovies;