import { useState, useRef, useEffect } from 'react';
import { deleteShow, updateShow } from '../api';

const WatchItem = ({ show, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const previewRef = useRef(null);
  
  // Format date if it comes in different formats
  const formatWatchedDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    try {
      // Handle date with or without time component
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  };
  
  // Default fallback image
  const fallbackImage = 'https://via.placeholder.com/300x450?text=No+Image';

  // Safely initialize form data with fallbacks for all fields
  const [formData, setFormData] = useState({
    title: show.title || 'Untitled',
    type: show.type || 'Movie',
    status: show.status || 'Watching',
    rating: show.rating || 3,
    notes: show.notes || '',
    watched_at: formatWatchedDate(show.watched_at),
    genre: show.genre || 'Uncategorized',
    poster_url: show.poster_url || fallbackImage
  });

  const statusColors = {
    'Finished': 'bg-green-100 text-green-800 border-green-200',
    'Watching': 'bg-blue-100 text-blue-800 border-blue-200',
    'Plan to Watch': 'bg-purple-100 text-purple-800 border-purple-200',
    'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Dropped': 'bg-red-100 text-red-800 border-red-200'
  };

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

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target) && 
          cardRef.current && cardRef.current.contains(event.target)) {
        // Only close if clicking on the card but outside the preview
        setShowPreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle image errors by setting a state flag
  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = fallbackImage;
  };

  const ratingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300'} text-lg transition-all duration-300 ${isExpanded ? 'hover:scale-110' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedShow = await updateShow(show.id, formData);
      onUpdate(updatedShow);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating show:", err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteShow(show.id);
      onDelete(show.id);
    } catch (err) {
      console.error("Error deleting show:", err);
      setIsDeleting(false);
    }
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePreview = (e) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 transition-all border border-gray-100 hover:border-purple-200 fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Edit Show</h3>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                required
              >
                <option value="">Select Type</option>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
                <option value="Drama">Drama</option>
                <option value="Series">Series</option>
                <option value="Anime">Anime</option>
                <option value="Documentary">Documentary</option>
                <option value="Reality Show">Reality Show</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                required
              >
                <option value="">Select Status</option>
                <option value="Finished">Finished</option>
                <option value="Watching">Watching</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                required
              >
                <option value="">Select Rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Below Average</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                placeholder="Action, Romance, Comedy..."
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Watch Date</label>
              <input
                type="date"
                name="watched_at"
                value={formData.watched_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">Poster URL</label>
            <input
              type="url"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
              placeholder="https://example.com/poster.jpg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus text-sm"
              placeholder="Write your thoughts or opinions about this show..."
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Compact card view with preview
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-6 relative ${isDeleting ? 'opacity-50 scale-95' : ''}`}
      ref={cardRef}
    >
      {/* Main Compact Card */}
      <div className="flex flex-row">
        {/* Poster thumbnail */}
        <div 
          className="w-[100px] h-[140px] relative overflow-hidden cursor-pointer"
          onClick={togglePreview}
        >
          <img 
            src={imageError ? fallbackImage : (show.poster_url || fallbackImage)} 
            alt={show.title || "Show poster"} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute top-0 right-0 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-xs font-medium rounded-bl flex items-center gap-1">
            <span>{typeIcons[show.type] || '🎬'}</span> 
          </div>
        </div>
        
        {/* Basic info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <h3 
              className="font-bold text-gray-800 hover:text-purple-700 transition-colors cursor-pointer" 
              onClick={togglePreview}
            >
              {show.title || "Untitled"}
            </h3>
            <div className="flex space-x-0.5 scale-90">{ratingStars(show.rating)}</div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1 mb-2">
            {(show.genre || "").split(',').slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="bg-purple-50 text-purple-700 px-2 py-0.5 text-xs rounded-full border border-purple-200"
              >
                {genre.trim()}
              </span>
            ))}
            {(show.genre || "").split(',').length > 3 && (
              <span className="text-xs text-gray-500">+{show.genre.split(',').length - 3} more</span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs mr-2 ${statusColors[show.status] || 'bg-gray-100'}`}>
              {show.status}
            </span>
            <span>{new Date(show.watched_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={togglePreview}
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
            >
              <span>{showPreview ? 'Hide details' : 'View details'}</span>
              <span className="ml-1">{showPreview ? '↑' : '↓'}</span>
            </button>
            
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors text-xs font-medium flex items-center"
              >
                <span className="text-[10px] mr-1">✎</span> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 transition-colors text-xs font-medium flex items-center"
                disabled={isDeleting}
              >
                <span className="text-[10px] mr-1">✕</span> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Panel (Slide Down) */}
      <div 
        ref={previewRef}
        className={`bg-white border-t border-gray-100 px-5 py-4 overflow-hidden transition-all duration-300 ${
          showPreview ? 'animate-slideDown max-h-[600px]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex">
          <div className="w-1/3 pr-4">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
              <img 
                src={imageError ? fallbackImage : (show.poster_url || fallbackImage)} 
                alt={show.title || "Show poster"} 
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="w-2/3">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{show.title}</h3>
            
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs mr-2 ${statusColors[show.status] || 'bg-gray-100'}`}>
                {show.status}
              </span>
              <span>{new Date(show.watched_at).toLocaleDateString()}</span>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Genres:</h4>
              <div className="flex flex-wrap gap-1.5">
                {show.genre.split(',').map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-purple-50 text-purple-700 px-2 py-0.5 text-xs rounded-full border border-purple-200"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            {show.notes && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <span className="text-purple-500 mr-1.5">📝</span> Notes:
                </h4>
                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-gray-600 text-sm">
                  {show.notes}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={togglePreview}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <span>Close preview</span>
                <span className="ml-1">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchItem;
