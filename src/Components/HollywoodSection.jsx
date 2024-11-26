import { useEffect, useState } from 'react';

function HollywoodSection({ searchQuery, page, setPage, onMovieClick }) {
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
                setMovies(data.results || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setMovies([]);
            }
        };

        fetchHollywoodMovies();
    }, [searchQuery, page]);

    return (
        <div>
            <h2 className="section-heading">Hollywood Movies</h2>
            <div className="content">
                {movies.map((movie) => (
                    <div
                        className="movie-card"
                        key={movie.id}
                        onClick={() => onMovieClick(movie)} // Call onMovieClick here
                    >
                        <img
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'}
                            alt={movie.title}
                            className="movie-image"
                        />
                        <h3 className="movie-name">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HollywoodSection;
