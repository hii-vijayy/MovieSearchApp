import { useEffect, useState } from 'react';

function HollywoodSection({ searchQuery, page, setPage }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchHollywoodMovies = async () => {
            const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}&with_original_language=en`;

            if (searchQuery) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}&with_original_language=en`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMovies(data.results || []); // Use data.results for TMDB API
            } catch (error) {
                console.error('Error fetching movies:', error);
                setMovies([]); // Clear movies on error
            }
        };

        fetchHollywoodMovies();
    }, [searchQuery, page]); // Reload on searchQuery or page change

    return (
        <div>
            <h2 className='section-heading'>Hollywood Movies</h2>
            <div className="content">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div className="movie-card" key={movie.id}>
                            <img
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'}
                                alt={movie.title}
                                className="movie-image"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent looping
                                    e.target.src = '/default-image.png'; // Fallback image
                                }}
                            />
                            <h3 className="movie-name">{movie.title}</h3>
                        </div>
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>
        </div>
    );
}

export default HollywoodSection;