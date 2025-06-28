function Pagination({currentMoviePageNumber, totalMoviePages, setCurrentMoviePageNumber}) {
    const updateMoviePage = (page) => {
        if (page < 1 || page > totalMoviePages) return;

        setCurrentMoviePageNumber(page);
    }

    return (
        <section className="pagination">
            <button
                onClick={() => updateMoviePage(currentMoviePageNumber - 1)}
                disabled={currentMoviePageNumber === 1}
            >&lt;</button>
            <span>{currentMoviePageNumber} / {totalMoviePages}</span>
            <button
                onClick={() => updateMoviePage(currentMoviePageNumber + 1)}
                disabled={currentMoviePageNumber >= totalMoviePages}
            >&gt;</button>
        </section>
    );
}

export default Pagination;