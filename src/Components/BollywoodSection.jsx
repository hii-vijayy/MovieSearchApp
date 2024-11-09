import { useEffect, useState } from 'react';

function BollywoodSection({ searchQuery, page, setPage }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchBollywoodMovies = async () => {
            // Using TMDb API
            const apiKey=import.meta.env.VITE_IMDB_APP_API_KEY;
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&region=IN&sort_by=popularity.desc&page=${page}&with_original_language=hi`;

            if (searchQuery) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setMovies(data.results || []);
        };

        fetchBollywoodMovies();
    }, [searchQuery, page]); // Reload on searchQuery or page change

    return (
        <div>
            <h2 className='section-heading'>Bollywood Movies</h2>
            <div className="content">
                {movies.map((movie, index) => (
                    <div className="movie-card" key={index}>
                        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'} alt={movie.title} className="movie-image" />
                        <h3 className="movie-name">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BollywoodSection;