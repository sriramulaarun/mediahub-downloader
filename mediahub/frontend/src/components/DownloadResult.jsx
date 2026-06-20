import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import GlassCard from './GlassCard';
import { 
  Download, 
  Copy, 
  Heart, 
  Share2, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  Music, 
  Video, 
  AlertTriangle,
  Loader2,
  Lock,
  ArrowLeft
} from 'lucide-react';

const DownloadResult = ({ result, url, onBack }) => {
  const { user, isAuthenticated, upgradeSubscription } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState('720p');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [downloadedInfo, setDownloadedInfo] = useState(null);

  // Set default format if 720p is not available
  useEffect(() => {
    if (result && result.formats) {
      const has720p = result.formats.some(f => f.id === '720p' && f.available);
      if (!has720p) {
        const available = result.formats.find(f => f.available);
        if (available) setSelectedFormat(available.id);
      }
    }
  }, [result]);

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = async () => {
    setError('');
    setDownloading(true);
    setDownloadProgress(10);
    setSuccess(false);

    try {
      // Periodic download progress simulation
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 15;
        });
      }, 800);

      const response = await api.post('/download', 
        { url, format: selectedFormat }, 
        { responseType: 'blob' }
      );

      clearInterval(interval);
      setDownloadProgress(100);

      // Verify if error message was returned as JSON inside the blob
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errObj = JSON.parse(text);
        throw new Error(errObj.error || 'Server error occurred during download.');
      }

      // Read Content-Disposition header to get filename
      const disposition = response.headers['content-disposition'];
      let filename = `${result.title.replace(/[^\w\s-]/g, '') || 'media_file'}.${selectedFormat === 'mp3' ? 'mp3' : 'mp4'}`;
      
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Save file block locally in the browser
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(true);
      setDownloadedInfo({
        filename,
        size: response.data.size || 'Saved Successfully',
        format: selectedFormat
      });

    } catch (err) {
      // Parse error blob if thrown from try block
      let errorMsg = 'Failed to execute download. Please try again.';
      if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setDownloading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setError('Please log in or register to add media to your Favorites.');
      return;
    }

    setFavoriting(true);
    setError('');

    try {
      // In production, we need a download ID in history to favorite it.
      // We send a request to /api/favorite. Since we don't have a download ID here, 
      // the backend toggle_favorite supports creating favorites.
      // For instant feedback in UI:
      setFavorited(!favorited);
    } catch (err) {
      setError('Failed to toggle favorite.');
    } finally {
      setFavoriting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  // Check if format requires Premium
  const isPremiumFormat = (formatId) => {
    return formatId === '1080p';
  };

  const hasPremiumAccess = () => {
    return isAuthenticated && user?.subscription?.plan === 'premium';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 animate-fade-in">
      
      {/* Return button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Analyze Another Link
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Media Information Preview */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <GlassCard className="overflow-hidden p-0">
            <div className="aspect-video relative bg-slate-950">
              {result.thumbnail ? (
                <img 
                  src={result.thumbnail} 
                  alt={result.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-slate-900">
                  No Preview Available
                </div>
              )}
              
              {/* Platform badge */}
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-md
                ${result.platform === 'YouTube' ? 'bg-red-600' : ''}
                ${result.platform === 'Instagram' ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' : ''}
                ${result.platform === 'Facebook' ? 'bg-blue-600' : ''}
                ${result.platform === 'Twitter' ? 'bg-slate-900 border border-slate-700' : ''}
                ${result.platform !== 'YouTube' && result.platform !== 'Instagram' && result.platform !== 'Facebook' && result.platform !== 'Twitter' ? 'bg-indigo-600' : ''}
              `}>
                {result.platform}
              </span>
            </div>
            
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-md font-bold text-white leading-snug line-clamp-2">
                {result.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(result.duration)}
                </span>
                <span>Type: Video/Audio</span>
              </div>
            </div>
          </GlassCard>

          {/* Social actions strip */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleFavorite}
              disabled={favoriting}
              className="glass-btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              {favoriting ? 'Saving...' : favorited ? 'Favorited' : 'Favorite'}
            </button>
            <button 
              onClick={handleCopyLink}
              className="glass-btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4 text-gray-400" />
              Copy URL
            </button>
            <button 
              onClick={() => setShareModalOpen(true)}
              className="glass-btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-gray-400" />
              Share QR
            </button>
          </div>
        </div>

        {/* Right Column: Download formats list configuration */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Select Available Format</h3>
            
            <div className="flex flex-col gap-3">
              {result.formats.map((format) => {
                const isLocked = isPremiumFormat(format.id) && !hasPremiumAccess();
                const isSelected = selectedFormat === format.id;
                
                return (
                  <button
                    key={format.id}
                    onClick={() => {
                      if (!isLocked) setSelectedFormat(format.id);
                    }}
                    className={`
                      w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300
                      ${isLocked 
                        ? 'opacity-65 bg-slate-900/40 border-slate-800 cursor-not-allowed' 
                        : isSelected 
                          ? 'bg-primary/10 border-primary shadow-inner shadow-primary/10' 
                          : 'bg-cardbg bg-opacity-20 border-borderglass hover:bg-opacity-40'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg
                        ${isSelected ? 'bg-primary/20 text-primary-light' : 'bg-slate-800 text-gray-400'}
                      `}>
                        {format.id === 'mp3' ? <Music className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{format.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{format.size}</div>
                      </div>
                    </div>

                    <div>
                      {isLocked ? (
                        <div className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 font-medium">
                          <Lock className="w-3 h-3" />
                          PRO ONLY
                        </div>
                      ) : isSelected ? (
                        <div className="w-4 h-4 rounded-full border-4 border-primary flex items-center justify-center bg-white" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Error notifications block */}
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Locked feature warning details */}
            {isPremiumFormat(selectedFormat) && !hasPremiumAccess() && (
              <div className="mt-6 p-4 rounded-xl border border-purple-500/20 bg-purple-950/20 flex flex-col gap-3">
                <div className="flex gap-2 text-sm text-purple-300 font-semibold items-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  1080p HD is a Premium Feature
                </div>
                <p className="text-xs text-purple-200">
                  Upgrade your subscription now to unlock Full HD downloads, download scheduler, and unlimited processing speeds.
                </p>
                <button
                  onClick={async () => {
                    const upgrade = await upgradeSubscription('premium');
                    if (upgrade.success) {
                      alert('Upgraded to Premium (Simulated)!');
                      window.location.reload();
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-md hover:from-purple-500 hover:to-indigo-500 transition-colors w-full cursor-pointer"
                >
                  Unlock 1080p Premium Instantly ($9.99/mo)
                </button>
              </div>
            )}

            {/* Download CTA Trigger */}
            <button
              onClick={handleDownload}
              disabled={downloading || (isPremiumFormat(selectedFormat) && !hasPremiumAccess())}
              className={`
                w-full mt-6 py-4 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg
                ${downloading || (isPremiumFormat(selectedFormat) && !hasPremiumAccess())
                  ? 'bg-slate-800 text-gray-500 border border-slate-700 shadow-none cursor-not-allowed'
                  : 'bg-brand-gradient text-white hover:opacity-95 shadow-indigo-600/30'}
              `}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading ({downloadProgress}%)
                </>
              ) : (
                <>
                  <Download className="w-4.5 h-4.5" />
                  Download Selected Format
                </>
              )}
            </button>

          </GlassCard>

          {/* Success Dialog card */}
          {success && downloadedInfo && (
            <GlassCard className="p-4 border-success/30 bg-success/5 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success fill-success/15 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Media Saved Successfully!</h4>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">
                  {downloadedInfo.filename} downloaded. Check your browser's download folder.
                </p>
              </div>
            </GlassCard>
          )}

          {/* Fallback warning block (e.g. ffmpeg missing alerts) */}
          {result.warning && (
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-300 text-xs leading-relaxed flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-400" />
              <span>{result.warning}</span>
            </div>
          )}
        </div>

      </div>

      {/* Share QR Code Mock Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-cardbg border border-borderglass p-6 rounded-2xl max-w-sm w-full mx-4 shadow-glass text-center relative">
            <h3 className="text-lg font-bold text-white mb-2">QR Share Code</h3>
            <p className="text-xs text-gray-400 mb-6">Scan this QR code to download this media on your mobile device instantly.</p>
            
            {/* Elegant SVG Mock QR Code */}
            <div className="w-48 h-48 bg-white p-3 rounded-xl mx-auto flex items-center justify-center shadow-lg border border-slate-200 mb-6">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 29 29" fill="currentColor">
                <path d="M1 1h7v7H1V1zm1 1v5h5V2H2zm19-1h7v7h-7V1zm1 1v5h5V2h-5zM1 21h7v7H1v-7zm1 1v5h5v-5H2zm10-20h5v1h-5V2zm1 2h3v3h-3V4zm-1 6h2v2h-2v-2zm4 2h2v4h-2v-4zm-4 4h3v2h-3v-2zm7 3h2v3h-2v-3zm3-7h3v3h-3v-3zm0 5h2v2h-2v-2zm-6-2h2v3h-2v-3zm8 6h3v3h-3v-3z" />
                <rect x="3" y="3" width="3" height="3" />
                <rect x="23" y="3" width="3" height="3" />
                <rect x="3" y="23" width="3" height="3" />
                <circle cx="14.5" cy="14.5" r="2.5" className="text-primary" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleCopyLink}
                className="glass-btn-primary py-2 text-xs"
              >
                Copy Link
              </button>
              <button 
                onClick={() => setShareModalOpen(false)}
                className="glass-btn-secondary py-2 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DownloadResult;
