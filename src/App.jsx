import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Search from './Components/Search';
import Content from './Components/Content';
import Footer from './Components/Footer';
import BollywoodSection from './Components/BollywoodSection';
import HollywoodSection from './Components/HollywoodSection';
import PunjabiSection from './Components/PunjabiSection';
import './App.css';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null); // Modal state
    const [movieCast, setMovieCast] = useState([]); // Cast state
    const [trailerUrl, setTrailerUrl] = useState(''); // Trailer state
    const [darkMode, setDarkMode] = useState(false); // Dark mode state
    const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY; // Your TMDB API key

    const clearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleMovieClick = async (movie) => {
        setSelectedMovie(movie);
        setMovieCast([]);
        setTrailerUrl('');

        // Disable scrolling on the body
        document.body.style.overflow = 'hidden';

        try {
            // Fetch cast
            const castResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`
            );
            const castData = await castResponse.json();
            setMovieCast(castData.cast.slice(0, 10)); // Limit to 10 cast members

            // Fetch trailer
            const trailerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
            );
            const trailerData = await trailerResponse.json();
            const trailer = trailerData.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            if (trailer) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
            }
        } catch (error) {
            console.error('Error fetching additional movie details:', error);
        }
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setMovieCast([]);
        setTrailerUrl('');

        // Re-enable scrolling on the body
        document.body.style.overflow = 'auto';
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`;

            if (searchQuery) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                setMovies(data.results || []);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchMovies();
    }, [searchQuery, page]);

    // Function to fetch trailer for each movie
    const fetchMovieTrailer = async (movieId) => {
        try {
            const trailerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
            );
            const trailerData = await trailerResponse.json();
            const trailer = trailerData.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
        } catch (error) {
            console.error('Error fetching trailer:', error);
            return null;
        }
    };

    return (
        <div>
            <Router>
                <NavBar clearSearch={clearSearch} />
                <Search onSearch={handleSearch} />
                <Routes>
                    <Route
                        path="/"
                        element={<Content movies={movies} onMovieClick={handleMovieClick} />}
                    />
                    <Route
                        path="/bollywood"
                        element={
                            <BollywoodSection
                                searchQuery={searchQuery}
                                page={page}
                                setPage={setPage}
                                onMovieClick={handleMovieClick}
                            />
                        }
                    />
                    <Route
                        path="/hollywood"
                        element={
                            <HollywoodSection
                                searchQuery={searchQuery}
                                page={page}
                                setPage={setPage}
                                onMovieClick={handleMovieClick}
                            />
                        }
                    />
                    <Route
                        path="/punjabi"
                        element={
                            <PunjabiSection
                                searchQuery={searchQuery}
                                page={page}
                                setPage={setPage}
                                onMovieClick={handleMovieClick}
                            />
                        }
                    />
                </Routes>
                <div className="pagination">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="prev-btn"
                    >
                        Previous
                    </button>
                    <button onClick={() => setPage((prev) => prev + 1)} className="next-btn">
                        Next
                    </button>
                </div>

                {/* Render Modal */}
                {selectedMovie && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>
                                &times;
                            </span>
                            <img
                                src={
                                    selectedMovie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                                        : '/default-image.png'
                                }
                                alt={selectedMovie.title}
                                className="modal-movie-image"
                            />
                            <h2>{selectedMovie.title}</h2>
                            <p>
                                <strong>Release Date:</strong> {selectedMovie.release_date || 'N/A'}
                            </p>
                            <p>
                                <strong>Category:</strong>{' '}
                                <button
                                    className={`category-btn ${
                                        selectedMovie.adult ? 'adult' : 'general'
                                    }`}
                                >
                                    {selectedMovie.adult ? 'A (Adult)' : 'U/A (General)'}
                                </button>
                            </p>
                            {selectedMovie.overview && (
                                <p className="short-description">
                                    <strong>Description:</strong>{' '}
                                    {selectedMovie.overview.length > 150
                                        ? selectedMovie.overview.slice(0, 150) + '...'
                                        : selectedMovie.overview}
                                </p>
                            )}
                            {/* Cast Section */}
                            <h3>Cast:</h3>
                            <ul className="cast-list">
                                {movieCast.map((member) => (
                                    <li key={member.cast_id}>{member.name} as {member.character}</li>
                                ))}
                            </ul>

                            {/* Trailer Section */}
                            {trailerUrl && (
                                <div className="trailer">
                                    <h3>Trailer:</h3>
                                    <iframe
                                        src={trailerUrl}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Footer />
            </Router>
        </div>
    );
}

export default App;
