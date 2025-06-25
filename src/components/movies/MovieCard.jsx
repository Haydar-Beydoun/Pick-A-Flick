import {useNavigate} from 'react-router-dom';
import MovieRating from "./MovieRating.jsx";
import {updateSearchCount} from "../../utils/appwrite.js";

function MovieCard({movie}) {
    const {title, vote_average, poster_path, release_date, original_language, id} = movie;
    const navigate = useNavigate();

    const handleClick = async () => {
        updateSearchCount(movie).catch(err => console.error("Log failed", err));
        navigate(`/movie/${id}`);
    };

    const posterUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
        : '/no-movie.png';

    return (
        <div className="movie-card cursor-pointer" onClick={handleClick}>
            <img draggable="false" src={posterUrl} alt={title}/>

            <div className="mt-4">
                <h3>{title}</h3>

                <MovieRating
                    vote_average={vote_average}
                    original_language={original_language}
                    release_date={release_date}
                />

            </div>
        </div>
    );
}

export default MovieCard;