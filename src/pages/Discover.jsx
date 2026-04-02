import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List } from 'lucide-react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import SearchBar from '../components/UI/SearchBar';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: 'popular', name: 'Popular', description: 'Most popular movies right now' },
    { id: 'top_rated', name: 'Top Rated', description: 'Highest rated movies of all time' }
  ];

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedCategory, searchQuery]);

  const fetchGenres = async () => {
    try {
      const response = await tmdbApi.getGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchQuery) {
        response = await tmdbApi.searchMovies(searchQuery);
      } else if (selectedGenre) {
        response = await tmdbApi.getMoviesByGenre(selectedGenre);
      } else {
        switch (selectedCategory) {
          case 'top_rated':
            response = await tmdbApi.getTopRatedMovies();
            break;
          default:
            response = await tmdbApi.getPopularMovies();
        }
      }
      
      setMovies(response.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setSearchQuery('');
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedGenre(null);
    setSearchQuery('');
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre);
      return `${genre?.name} Movies`;
    }
    const category = categories.find(c => c.id === selectedCategory);
    return category?.name || 'Discover Movies';
  };

  const getPageDescription = () => {
    if (searchQuery) return `Found ${movies.length} movies`;
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre);
      return `Explore the best ${genre?.name.toLowerCase()} movies`;
    }
    const category = categories.find(c => c.id === selectedCategory);
    return category?.description || 'Explore amazing movies';
  };

  return (
    <div className="min-h-screen bg-bgpalette dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {getPageDescription()}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <SearchBar onSearch={handleSearch} />
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary inline-flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={false}
          animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
          className="overflow-hidden mb-8"
        >
          <div className="card p-6">
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenreSelect(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedGenre === null
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedGenre === genre.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : movies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Grid className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery 
                  ? `No movies found for "${searchQuery}". Try a different search term.`
                  : "No movies found for the selected filters. Try adjusting your criteria."
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre(null);
                  setSelectedCategory('popular');
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Discover;