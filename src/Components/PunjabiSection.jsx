import { useEffect, useState } from 'react';
import Content from './Content';

const PunjabiSection = ({ searchQuery, page, setPage, onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pa-IN&sort_by=popularity.desc&page=${page}&with_original_language=pa`;

      if (searchQuery) {
        // If there is a search query, fetch using the search endpoint
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}&language=pa-IN`;
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

export default PunjabiSection;
