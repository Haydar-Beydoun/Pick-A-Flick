import React, {useEffect, useRef} from 'react';
import Search from "./Search.jsx";
import Accordion from "../ui/Accordion.jsx";
import GenreList from "../genres/GenreList.jsx";
import MovieList from "../movies/MovieList.jsx";

function AllMovies({
                       allMoviesRef,
                       searchTerm,
                       setSearchTerm,
                       availableGenres,
                       genresFiltered,
                       movieList,
                       isLoading,
                       errorMessage,
                       toggleGenreSelection
                   }) {

    return (
        <section className="all-movies" ref={allMoviesRef}>
            <h2>All Movies</h2>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

            <Accordion title="Genre Filters">
                <GenreList availableGenres={availableGenres} toggleGenreSelection={toggleGenreSelection}
                           genresFiltered={genresFiltered} searchTerm={searchTerm}/>
            </Accordion>

            <MovieList
                movies={movieList}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </section>
    );
}

export default AllMovies;