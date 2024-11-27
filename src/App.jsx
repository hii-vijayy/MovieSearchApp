import { useState, useEffect } from 'react';
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
  const [selectedMovie, setSelectedMovie] = useState(null); // Modal movie state
  const [page, setPage] = useState(1);
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // Set movie data when clicked
  };

  const handleCloseModal = () => {
    setSelectedMovie(null); // Close modal when set to null
  };

  const handlePagination = (direction) => {
    setPage((prev) => Math.max(1, prev + direction)); // Update page based on direction
  };

  useEffect(() => {
    const fetchMovies = async (genre) => {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`;

      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else if (genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&page=${page}`;
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
            element={<BollywoodSection searchQuery={searchQuery} page={page} setPage={setPage} onMovieClick={handleMovieClick} />}
          />
          <Route
            path="/hollywood"
            element={<HollywoodSection searchQuery={searchQuery} page={page} setPage={setPage} onMovieClick={handleMovieClick} />}
          />
          <Route
            path="/punjabi"
            element={<PunjabiSection searchQuery={searchQuery} page={page} setPage={setPage} onMovieClick={handleMovieClick} />}
          />
        </Routes>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => handlePagination(-1)}
            disabled={page === 1}
            className="prev-btn"
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination(1)}
            className="next-btn"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {selectedMovie && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedMovie.title}</h2>
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
              />
              <p>{selectedMovie.overview}</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}

        <Footer />
      </Router>
    </div>
  );
}

export default App;
