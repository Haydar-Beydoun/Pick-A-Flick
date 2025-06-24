import React from 'react';
import {useNavigate} from 'react-router-dom';

function MovieCard({movie: {title, vote_average, poster_path, release_date, original_language, id}}) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/movie/${id}`);
    };

    return (
        <div className="movie-card cursor-pointer" onClick={handleClick}>
            <img draggable="false"
                 src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"} alt={title}/>

            <div className="mt-4">
                <h3>{title}</h3>

                <div className="content">
                    <div className="rating">
                        <img draggable="false" src="star.svg" alt="Star Icon"/>
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className="lang">{original_language}</p>
                    <span>•</span>
                    <p className="year">{release_date ? release_date.split('-')[0] : "N/A"}</p>

                </div>
            </div>
        </div>
    );
}

export default MovieCard;