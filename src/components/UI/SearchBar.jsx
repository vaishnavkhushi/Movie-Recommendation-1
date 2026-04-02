import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, placeholder = "Search movies..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative max-w-lg w-full mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-accent rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none transition-colors duration-150"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-accent hover:text-primary-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;