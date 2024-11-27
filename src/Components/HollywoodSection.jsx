import { useEffect, useState } from 'react';
import Content from './Content';

const HollywoodSection = ({ searchQuery, page, setPage, onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&region=US&sort_by=popularity.desc&page=${page}&with_original_language=en`;

      if (searchQuery) {
        // If there is a search query, fetch using the search endpoint
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}&language=en-US&region=US`;
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

  return <Content movies={movies} onMovieClick={onMovieClick} />;
};

export default HollywoodSection;
