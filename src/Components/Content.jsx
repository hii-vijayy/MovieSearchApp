import { useEffect, useState } from 'react';
import '../App.css';

function Content({ movies }) {
    const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie
    const [movieCast, setMovieCast] = useState([]); // State for movie cast
    const [trailerUrl, setTrailerUrl] = useState(''); // State for trailer URL
    const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY; // API key for TMDB

    // Function to fetch cast and trailer data when a movie is clicked
    const fetchMovieDetails = async (movieId) => {
        try {
            // Fetch cast
            const castResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`
            );
            const castData = await castResponse.json();
            setMovieCast(castData.cast.slice(0, 10)); // Limit to 10 cast members

            // Fetch trailer
            const trailerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
            );
            const trailerData = await trailerResponse.json();
            const trailer = trailerData.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            if (trailer) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie); // Set the selected movie when a card is clicked
        setMovieCast([]); // Reset the cast data
        setTrailerUrl(''); // Reset the trailer URL
        fetchMovieDetails(movie.id); // Fetch details for the selected movie
    };

    const closeModal = () => {
        setSelectedMovie(null); // Close the modal
        setMovieCast([]); // Reset the cast data
        setTrailerUrl(''); // Reset the trailer URL
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
                            <div className='description'>Description:
                                <div className="short-description">
                                {selectedMovie.overview.length > 150
                                    ? selectedMovie.overview.slice(0, 150) + '...'
                                    : selectedMovie.overview}
                                </div>
                            </div> 
                        )}

                        {/* Cast Section */}
                        <h3 className='cast'>Cast:</h3>
                        <ul className="cast-list">
                            {movieCast.length > 0 ? (
                                movieCast.map((member) => (
                                    <li key={member.cast_id}>
                                        {member.name} as {member.character}
                                    </li>
                                ))
                            ) : (
                                <li>No cast information available.</li>
                            )}
                        </ul>

                        {/* Trailer Section */}
                        {trailerUrl && (
                            <div className="trailer">
                                <h3>Trailer:</h3>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={trailerUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Content;
