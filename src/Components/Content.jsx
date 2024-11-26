import { useState } from 'react';
import '../App.css';

function Content({ movies }) {
    const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie); // Set the selected movie when a card is clicked
    };

    const closeModal = () => {
        setSelectedMovie(null); // Close the modal
    };

    return (
        <>
            <h2 className="section-heading">--Movies--</h2>
            <div className="content">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div
                            className="movie-card"
                            key={movie.id}
                            onClick={() => handleMovieClick(movie)} // Open modal on card click
                        >
                            {/* Movie Poster */}
                            <img
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'}
                                alt={movie.title}
                                className="movie-image"
                            />

                            {/* Movie Title */}
                            <h3 className="movie-name">{movie.title}</h3>
                        </div>
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>

            {/* Modal for Detailed View */}
            {selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        {/* Close Button */}
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        {/* Movie Poster */}
                        <img
                            src={
                                selectedMovie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                                    : '/default-image.png'
                            }
                            alt={selectedMovie.title}
                            className="modal-movie-image"
                        />

                        {/* Movie Title */}
                        <h2>{selectedMovie.title}</h2>

                        {/* Release Date */}
                        <p>
                            <strong>Release Date:</strong> {selectedMovie.release_date || 'N/A'}
                        </p>

                        {/* Movie Category */}
                        <p>
                            <strong>Category:</strong>
                            <button className={`category-btn ${selectedMovie.adult ? 'adult' : 'general'}`}>
                                {selectedMovie.adult ? 'A (Adult)' : 'U/A (General)'}
                            </button>
                        </p>

                        {/* Short Description */}
                        {selectedMovie.overview && (
                            <p className="short-description">
                                <strong>Description:</strong> 
                                {selectedMovie.overview.length > 150
                                    ? selectedMovie.overview.slice(0, 150) + '...'
                                    : selectedMovie.overview}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Content;
