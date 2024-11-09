import '../App.css';

function Content({ movies }) {
    return (
        <>
            <h2 className="section-heading">--Movies--</h2>
            <div className="content">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div className="movie-card" key={movie.id}>
                            <img 
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'} 
                                alt={movie.title} 
                                className="movie-image" 
                            />
                            <h3 className="movie-name">{movie.title}</h3>
                        </div>
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>
        </>
    );
}

export default Content; // Ensure this line is at the end