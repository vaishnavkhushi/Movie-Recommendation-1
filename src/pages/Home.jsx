import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Star, ArrowRight, Search } from 'lucide-react';
import { tmdbApi, getImageUrl } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularResponse] = await Promise.all([
          tmdbApi.getPopularMovies()
        ]);
        
        setPopularMovies(popularResponse.results.slice(0, 8));
        setFeaturedMovies(popularResponse.results.slice(0, 3));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const featuredMovie = featuredMovies[0];

  return (
    <div className="min-h-screen bg-bgpalette dark:bg-gray-900">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredMovie.backdrop_path, 'original')}
              alt={featuredMovie.title}
              className="w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
             <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Discover your next
                <span className="block text-pink-400 dark:text-blue-400">Cinematic Obsession</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                Explore top films, read in-depth reviews, and dive into the world of cinema.
            </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/discover"
                  className="btn-primary inline-flex items-center text-lg px-8 py-4 rounded-xl"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Exploring
                </Link>
                
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="btn-secondary inline-flex items-center text-lg px-8 py-4 rounded-xl"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Featured Movie
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Popular Movies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-primary-500 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The most popular movies everyone's talking about
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {popularMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link
              to="/discover"
              className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium text-lg group"
            >
              Discover More Movies
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose net-flix?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your ultimate companion for discovering and exploring movies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Search",
                description: "Find movies by title, genre, or mood with our intelligent search system"
              },
              {
                icon: Star,
                title: "Expert Reviews",
                description: "Read detailed reviews and ratings from critics and fellow movie enthusiasts"
              },
              {
                icon: TrendingUp,
                title: "Trending Picks",
                description: "Stay updated with the latest trending movies and hidden gems"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;