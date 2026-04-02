import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdbApi';

const MovieCard = ({ movie, index = 0 }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="card overflow-hidden group cursor-pointer"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(movie.release_date)}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;