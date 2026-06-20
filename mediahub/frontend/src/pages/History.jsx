import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Download, 
  Heart, 
  Trash2, 
  FileVideo, 
  FileAudio, 
  Loader2, 
  Search,
  ExternalLink 
} from 'lucide-react';

const History = () => {
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      setDownloads(response.data);
      
      const favResponse = await api.get('/favorites');
      setFavoritesList(favResponse.data.map(f => f.download_id));
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown Size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleRedownload = async (item) => {
    setDownloadingId(item.id);
    try {
      const response = await api.post('/download', 
        { url: item.url, format: item.format }, 
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${item.title}.${item.format === 'mp3' ? 'mp3' : 'mp4'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to stream file. Please make sure the link is still valid.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleToggleFavorite = async (downloadId) => {
    try {
      const response = await api.post('/favorite', { download_id: downloadId });
      if (response.data.is_favorite) {
        setFavoritesList(prev => [...prev, downloadId]);
      } else {
        setFavoritesList(prev => prev.filter(id => id !== downloadId));
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const filteredDownloads = downloads.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search Header panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Download History</h2>
          <p className="text-xs text-gray-400">View and redownload files you processed in the past.</p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 pl-9 pr-4 py-2 rounded-xl border border-borderglass focus:outline-none focus:ring-1 focus:ring-primary text-xs"
          />
        </div>
      </div>

      {filteredDownloads.length > 0 ? (
        <GlassCard className="overflow-hidden p-0 border-collapse">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderglass bg-cardbg bg-opacity-40 text-xxs font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderglass text-xs">
                {filteredDownloads.map((item) => {
                  const isFavorited = favoritesList.includes(item.id);
                  const isDownloading = downloadingId === item.id;
                  
                  return (
                    <tr key={item.id} className="hover:bg-cardbg hover:bg-opacity-10 transition-colors">
                      {/* Media details */}
                      <td className="px-6 py-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 p-2 rounded-lg bg-slate-800 text-indigo-400">
                            {item.format === 'mp3' ? <FileAudio className="w-4 h-4" /> : <FileVideo className="w-4 h-4" />}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate max-w-[280px]" title={item.title}>
                              {item.title}
                            </p>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xxs text-gray-500 hover:text-indigo-400 flex items-center gap-1 mt-0.5 truncate max-w-[280px]"
                            >
                              Source link <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold text-white
                          ${item.platform === 'YouTube' ? 'bg-red-600/10 text-red-400 border border-red-500/20' : ''}
                          ${item.platform === 'Instagram' ? 'bg-pink-600/10 text-pink-400 border border-pink-500/20' : ''}
                          ${item.platform === 'Facebook' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : ''}
                          ${item.platform !== 'YouTube' && item.platform !== 'Instagram' && item.platform !== 'Facebook' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : ''}
                        `}>
                          {item.platform}
                        </span>
                      </td>

                      {/* Format */}
                      <td className="px-6 py-4 uppercase font-semibold text-gray-300">
                        {item.format}
                      </td>

                      {/* File Size */}
                      <td className="px-6 py-4 text-gray-300">
                        {formatSize(item.file_size)}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleFavorite(item.id)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer
                              ${isFavorited 
                                ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' 
                                : 'bg-slate-800 border-borderglass text-gray-400 hover:text-white'}`}
                            title={isFavorited ? 'Remove Favorite' : 'Save Favorite'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => handleRedownload(item)}
                            disabled={isDownloading}
                            className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 hover:text-white hover:bg-indigo-600/20 transition-all cursor-pointer"
                            title="Re-download"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="py-16 text-center text-gray-500">
          No logs found matching your filters. Go download some files!
        </GlassCard>
      )}

    </div>
  );
};

export default History;
