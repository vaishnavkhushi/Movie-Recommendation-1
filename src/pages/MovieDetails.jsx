import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, ArrowLeft, User, Quote, Play } from 'lucide-react';
import { tmdbApi, getImageUrl } from '../services/tmdbApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const [movieResponse, creditsResponse, reviewsResponse, videosResponse, providersResponse] = await Promise.all([
        tmdbApi.getMovieDetails(id),
        tmdbApi.getMovieCredits(id),
        tmdbApi.getMovieReviews(id),
        tmdbApi.getMovieVideos(id),
        tmdbApi.getWatchProviders(id)
      ]);

      setMovie(movieResponse);
      setCast(creditsResponse.cast.slice(0, 6));
      setReviews(reviewsResponse.results.slice(0, 3));
      setVideos(videosResponse.results);
      setWatchProviders(providersResponse.results);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTrailer = () => {
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const getWatchLink = () => {
    if (!watchProviders || !watchProviders.US) return false;
    const providers = watchProviders.US.flatrate || watchProviders.US.rent || watchProviders.US.buy;
    return providers && providers.length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Movie Not Found
          </h2>
          <Link to="/discover" className="btn-primary">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgpalette dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/discover"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Discover
            </Link>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-shrink-0"
              >
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-80 h-auto rounded-xl shadow-2xl"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-6 text-white/80">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                    <span className="text-lg font-medium">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{formatRuntime(120)}</span>
                  </div>
                </div>
                
                <p className="text-lg text-white mb-8 max-w-3xl leading-relaxed">
                  {movie.overview}
                </p>

                {getTrailer() ? (
                  <a
                    href={getTrailer()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center text-lg px-8 py-4 rounded-xl"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Trailer
                  </a>
                ) : getWatchLink() ? (
                  <button
                    onClick={() => window.open(`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`, '_blank')}
                    className="btn-primary inline-flex items-center text-lg px-8 py-4 rounded-xl"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Where to Watch
                  </button>
                ) : null}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
            >
              Main Cast
            </motion.h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {cast.map((actor, index) => (
                <motion.div
                  key={actor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
                    <img
                      src={getImageUrl(actor.profile_path)}
                      alt={actor.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {actor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {actor.character}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
            >
              Reviews
            </motion.h2>
            
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="card p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 dark:bg-primary-900/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.author}
                        </h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {review.rating}/10
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Quote className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p style={{ color: '#000' }} className="leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetails;