import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addShow } from "../api";

function AddShow() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [preview, setPreview] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        status: "",
        rating: "",
        genre: "",
        poster_url: "",
        watched_at: "",
        notes: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Preview the poster URL as it's typed
        if (name === 'poster_url' && value) {
            setPreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        
        try {
            await addShow(formData);
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to add show. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
                <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
                    <span className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-3">➕</span>
                    Add New Show
                </h1>
                
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6">
                        {errorMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Form Side */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter the show title"
                                    onChange={handleChange}
                                    value={formData.title}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                                    <select
                                        id="type"
                                        name="type"
                                        onChange={handleChange}
                                        value={formData.type}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
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
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                                    <select
                                        id="status"
                                        name="status"
                                        onChange={handleChange}
                                        value={formData.status}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
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
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            id="rating"
                                            name="rating"
                                            onChange={handleChange}
                                            value={formData.rating}
                                            className="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                            required
                                        >
                                            <option value="">Select Rating</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Below Average</option>
                                            <option value="3">3 - Average</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </select>
                                        <span className="absolute top-1/2 transform -translate-y-1/2 left-2.5 text-yellow-400">⭐</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="watched_at" className="block text-sm font-medium text-gray-700 mb-1">Watch Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        id="watched_at"
                                        name="watched_at"
                                        onChange={handleChange}
                                        value={formData.watched_at}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    placeholder="Action, Romance, Comedy... (separate with commas)"
                                    onChange={handleChange}
                                    value={formData.genre}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Share your thoughts or impressions about this show..."
                                    onChange={handleChange}
                                    value={formData.notes}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        {/* Preview Side */}
                        <div>
                            <div className="mb-4">
                                <label htmlFor="poster_url" className="block text-sm font-medium text-gray-700 mb-1">Poster URL <span className="text-red-500">*</span></label>
                                <input
                                    type="url"
                                    id="poster_url"
                                    name="poster_url"
                                    placeholder="https://example.com/poster.jpg"
                                    onChange={handleChange}
                                    value={formData.poster_url}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mindful-focus"
                                    required
                                />
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                                <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                                    {preview ? (
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x450?text=Invalid+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">🖼️</div>
                                                <p>Poster preview will appear here</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Enter an image URL from the internet to see the poster preview.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-purple-600 text-white shadow-md font-medium hover:bg-purple-700 transition-colors flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    Saving...
                                </>
                            ) : (
                                <>Save Show</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    All fields with <span className="text-red-500">*</span> are required
                </p>
            </div>
        </div>
    );
}

export default AddShow;
