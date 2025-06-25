import React from 'react';
import GenreButton from "./GenreButton.jsx";

function GenreList({availableGenres, toggleGenreSelection, genresFiltered, searchTerm}) {
    return (
        <>
            {searchTerm && <p className="p-3 text-red-200">Cannot filter genres while searching</p>}

            <div className="flex flex-wrap">
                {availableGenres && availableGenres.map((genre) => (
                    <GenreButton
                        toggleGenreSelection={toggleGenreSelection}
                        isSelected={genresFiltered.includes(genre.id)}
                        genre={genre}
                        isDisabled={!!searchTerm}
                        key={genre.id}
                    />
                ))}
            </div>
        </>
    );
}

export default GenreList;