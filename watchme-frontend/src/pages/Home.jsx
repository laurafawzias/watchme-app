import { useState, useEffect } from 'react';
import WatchItem from '../components/WatchItem';
import { getShows } from '../api';

const Home = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    finished: 0,
    averageRating: 0
  });
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState(''); // New genre filter
  const [filteredShows, setFilteredShows] = useState([]);

  // Helper function to check if a show is finished (either "Finished" or "Completed")
  const isFinished = (status) => {
    return status === 'Finished' || status === 'Completed';
  };

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getShows();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setShows(data);
          setFilteredShows(data);
          
          // Calculate statistics - treating both statuses as "Finished"
          const finishedShows = data.filter(show => isFinished(show.status)).length;
          const totalRating = data.reduce((sum, show) => sum + parseInt(show.rating || 0), 0);
          const avgRating = data.length > 0 ? (totalRating / data.length).toFixed(1) : 0;
          
          setStats({
            total: data.length,
            finished: finishedShows,
            averageRating: avgRating
          });
        } else {
          console.error('API did not return an array:', data);
          setShows([]);
          setFilteredShows([]);
          setError('Invalid data format received from the server.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shows:', err);
        setError('Failed to load watchlist. Please try again later.');
        setLoading(false);
      }
    };

    fetchShows();
  }, []);
  
  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...shows];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(show => 
        show.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter - treating both statuses as "Finished"
    if (statusFilter) {
      if (statusFilter === 'Finished') {
        // If Finished is selected, show both "Finished" and "Completed" statuses
        result = result.filter(show => isFinished(show.status));
      } else {
        // Otherwise filter normally
        result = result.filter(show => show.status === statusFilter);
      }
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter(show => show.type === typeFilter);
    }
    
    // Apply genre filter (new)
    if (genreFilter) {
      result = result.filter(show => 
        show.genre.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }
    
    setFilteredShows(result);
  }, [shows, searchQuery, statusFilter, typeFilter, genreFilter]);

  const handleUpdate = (updatedShow) => {
    const updatedShows = shows.map(show => show.id === updatedShow.id ? updatedShow : show);
    setShows(updatedShows);
    
    // Update statistics after a show is updated - treating both statuses as "Finished"
    const finishedShows = updatedShows.filter(show => isFinished(show.status)).length;
    const totalRating = updatedShows.reduce((sum, show) => sum + parseInt(show.rating || 0), 0);
    const avgRating = updatedShows.length > 0 ? (totalRating / updatedShows.length).toFixed(1) : 0;
    
    setStats({
      total: updatedShows.length,
      finished: finishedShows,
      averageRating: avgRating
    });
  };

  const handleDelete = (id) => {
    const updatedShows = shows.filter(show => show.id !== id);
    setShows(updatedShows);
    
    // Update statistics after a show is deleted - treating both statuses as "Finished"
    const finishedShows = updatedShows.filter(show => isFinished(show.status)).length;
    const totalRating = updatedShows.reduce((sum, show) => sum + parseInt(show.rating || 0), 0);
    const avgRating = updatedShows.length > 0 ? (totalRating / updatedShows.length).toFixed(1) : 0;
    
    setStats({
      total: updatedShows.length,
      finished: finishedShows,
      averageRating: avgRating
    });
  };
  
  // Get unique status values for filter dropdown, but normalize "Completed" to "Finished"
  const uniqueStatuses = Array.from(new Set(shows.map(show => {
    // Normalize "Completed" to "Finished"
    return show.status === 'Completed' ? 'Finished' : show.status;
  }))).filter(Boolean);
  
  // Type icons mapping
  const typeIcons = {
    'Movie': '🎬',
    'TV Show': '📺',
    'Drama': '🎭',
    'Series': '📼',
    'Anime': '🌸',
    'Documentary': '🎥',
    'Reality Show': '👥',
    'Other': '🎞️'
  };

  // Genre icons mapping
  const genreIcons = {
    'Action': '💥',
    'Adventure': '🧗',
    'Animation': '🧸',
    'Comedy': '😂',
    'Crime': '🔪',
    'Documentary': '📝',
    'Drama': '😢',
    'Fantasy': '🦄',
    'Horror': '👻',
    'Mystery': '🔍',
    'Romance': '❤️',
    'Sci-Fi': '🚀',
    'Thriller': '😱',
    'Western': '🤠',
    'Sports': '⚽',
    'Music': '🎵',
    'Biography': '📚',
    'History': '📜',
    'War': '🪖',
    'Family': '👪'
  };

  // Get unique type values for filter dropdown
  const uniqueTypes = Array.from(new Set(shows.map(show => show.type))).filter(Boolean);
  
  // Extract all genres from shows and create a unique array
  const allGenres = shows
    .flatMap(show => show.genre?.split(',').map(g => g.trim()) || [])
    .filter(Boolean);
  
  const uniqueGenres = Array.from(new Set(allGenres)).sort();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Your watchlist is empty</h2>
          <p className="text-gray-500 mb-6">Start adding shows to track what you're watching!</p>
          <a 
            href="/add" 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Your First Show
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Watchlist</h1>
        <a 
          href="/add" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <span className="mr-1">+</span> Add Show
        </a>
      </div>
      
      {/* Statistics Panel */}
      <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-purple-800 text-xs font-medium mb-1">TOTAL SHOWS</p>
          <p className="text-3xl font-bold text-purple-900">{stats.total}</p>
        </div>
        <div className="text-center border-x border-purple-100">
          <p className="text-purple-800 text-xs font-medium mb-1">FINISHED</p>
          <p className="text-3xl font-bold text-purple-900">{stats.finished}</p>
        </div>
        <div className="text-center">
          <p className="text-purple-800 text-xs font-medium mb-1">AVG RATING</p>
          <p className="text-3xl font-bold text-purple-900 flex items-center justify-center">
            {stats.averageRating} <span className="text-yellow-500 ml-1 text-xl">★</span>
          </p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 space-y-4">
        <h3 className="font-medium text-gray-700 mb-3">Filter Shows</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search by Title</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shows..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          {/* Type Filter with Emojis */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Filter by Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {typeIcons[type] || '🎬'} {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Genre Filter with Emojis (new) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Filter by Genre</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genreIcons[genre] || '🎭'} {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(searchQuery || statusFilter || typeFilter || genreFilter) && (
          <div className="flex justify-end">
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setTypeFilter('');
                setGenreFilter(''); // Reset genre filter
              }}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
            >
              <span>Clear all filters</span>
              <span className="ml-1">×</span>
            </button>
          </div>
        )}
        
        {/* Filter Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredShows.length} of {shows.length} shows
        </div>
      </div>
      
      {/* Show empty state if filtered shows is empty */}
      {filteredShows.length === 0 && shows.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-2">No matching shows found</h2>
          <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(filteredShows) && filteredShows.map(show => (
          <WatchItem 
            key={show.id} 
            show={show} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
