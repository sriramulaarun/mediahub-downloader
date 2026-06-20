import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Download, 
  Heart, 
  Play, 
  Music, 
  Video, 
  Loader2, 
  Trash2,
  ExternalLink 
} from 'lucide-react';

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (downloadId) => {
    try {
      await api.delete(`/favorite?download_id=${downloadId}`);
      setFavorites(prev => prev.filter(f => f.download_id !== downloadId));
    } catch (err) {
      console.error('Failed to delete favorite', err);
    }
  };

  const handleDownload = async (item) => {
    const download = item.download;
    if (!download) return;
    
    setDownloadingId(item.id);
    try {
      const response = await api.post('/download', 
        { url: download.url, format: download.format }, 
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${download.title}.${download.format === 'mp3' ? 'mp3' : 'mp4'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to stream file. Please check link validity.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Favorite Downloads</h2>
        <p className="text-xs text-gray-400">Your collection of bookmarked media URLs.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => {
            const dl = item.download;
            if (!dl) return null;
            const isDownloading = downloadingId === item.id;
            
            return (
              <GlassCard key={item.id} className="p-0 overflow-hidden flex flex-col justify-between" hover={true}>
                
                {/* Visual Type Indicator header */}
                <div className="p-4 bg-cardbg bg-opacity-20 border-b border-borderglass flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-xxs font-bold text-white
                    ${dl.platform === 'YouTube' ? 'bg-red-600/10 text-red-400 border border-red-500/20' : ''}
                    ${dl.platform === 'Instagram' ? 'bg-pink-600/10 text-pink-400 border border-pink-500/20' : ''}
                    ${dl.platform === 'Facebook' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : ''}
                    ${dl.platform !== 'YouTube' && dl.platform !== 'Instagram' && dl.platform !== 'Facebook' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : ''}
                  `}>
                    {dl.platform}
                  </span>

                  <span className="text-xxs font-semibold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {dl.format}
                  </span>
                </div>

                {/* Content body info */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white text-sm line-clamp-2 leading-snug" title={dl.title}>
                      {dl.title}
                    </h3>
                    <a 
                      href={dl.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xxs text-gray-500 hover:text-indigo-400 inline-flex items-center gap-1 mt-2 truncate max-w-full"
                    >
                      Original Source Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="flex gap-2 border-t border-borderglass/60 pt-4 mt-2">
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="flex-1 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white hover:border-transparent text-indigo-400 text-xs font-bold py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      Download
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFavorite(dl.id)}
                      className="px-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-400 py-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="py-16 text-center text-gray-500">
          No favorites saved. Click the Heart button on any analyzed URL to add it here.
        </GlassCard>
      )}

    </div>
  );
};

export default Favorites;
