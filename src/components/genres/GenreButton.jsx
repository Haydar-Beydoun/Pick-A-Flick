import React from 'react';

function GenreButton({genre, toggleGenreSelection, isSelected, isDisabled}) {
    return (
        <button
            onClick={() => !isDisabled && toggleGenreSelection(genre.id)}
            className={isSelected ? 'bg-blue-400' : ''}
            disabled={isDisabled}
        >{genre.name}</button>
    );
}

export default GenreButton;