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
    const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY; // Your TMDB API key

    const clearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const closeModal = () => {
        setSelectedMovie(null);
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

    return (
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
                    </div>
                </div>
            )}

            <Footer />
        </Router>
    );
}

export default App;
