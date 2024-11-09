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
    const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY // Your TMDB API key

    // Clear search query when navigating to a section
    const clearSearch = () => {
        setSearchQuery(''); // Clear search
        setPage(1);         // Reset page
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPage(1);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`;

            if (searchQuery) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
            }

            console.log('Fetching URL:', url); // Log the URL being fetched

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
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
                <Route path="/" element={<Content movies={movies} />} />
                <Route path="/bollywood" element={<BollywoodSection searchQuery={searchQuery} page={page} setPage={setPage} />} />
                <Route path="/hollywood" element={<HollywoodSection searchQuery={searchQuery} page={page} setPage={setPage} />} />
                <Route path="/punjabi" element={<PunjabiSection searchQuery={searchQuery} page={page} setPage={setPage} />} />
            </Routes>
            <div className="pagination">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className='prev-btn'>Previous</button>
                <button onClick={() => setPage((prev) => prev + 1)} className='next-btn'>Next</button>
            </div>
            <Footer />
        </Router>
    );
}

export default App;