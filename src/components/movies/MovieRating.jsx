function MovieRating({vote_average, original_language, release_date}) {
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    const language = original_language?.toUpperCase() || 'N/A';
    const year = release_date?.split('-')[0] || 'N/A';

    return (
        <div className="movie-rating">
            <div className="content">
                <div className="rating">
                    <img draggable="false" src="/star.svg" alt="Star Icon"/>
                    <p>{rating}</p>
                </div>
                <span>•</span>
                <p className="lang">{language}</p>
                <span>•</span>
                <p className="year">{year}</p>
            </div>
        </div>
    );
}

export default MovieRating;