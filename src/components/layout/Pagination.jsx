function Pagination({currentTrendingPage, totalMoviePages, setCurrentMoviePageNumber, allMoviesRef}) {
    const updateMoviePage = (page) => {
        if (page < 1 || page > totalMoviePages) return;

        setCurrentMoviePageNumber(page);
        allMoviesRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <section className="pagination flex justify-center gap-4 mt-6 ">
            <button
                onClick={() => updateMoviePage(currentTrendingPage - 1)}
                disabled={currentTrendingPage === 1}
            >&lt;</button>
            <span>{currentTrendingPage} / {totalMoviePages}</span>
            <button
                onClick={() => updateMoviePage(currentTrendingPage + 1)}
                disabled={currentTrendingPage >= totalMoviePages}
            >&gt;</button>
        </section>
    );
}

export default Pagination;