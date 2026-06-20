import React, { useState } from 'react';
import api from '../services/api';
import { Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const LandingHero = ({ onAnalysisSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const validateUrl = (inputUrl) => {
    if (!inputUrl.trim()) {
      return 'Please paste a URL first.';
    }
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const instagramPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/;
    const facebookPattern = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+$/;
    const twitterPattern = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/;

    if (
      !youtubePattern.test(inputUrl) &&
      !instagramPattern.test(inputUrl) &&
      !facebookPattern.test(inputUrl) &&
      !twitterPattern.test(inputUrl)
    ) {
      return 'Unsupported platform or invalid URL format. Please paste a valid link.';
    }
    return null;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setStatusMessage('Connecting to media servers...');
    
    // Rotate messages to simulate loading progress
    const messages = [
      'Locating media source...',
      'Bypassing format restrictions...',
      'Extracting download options...',
      'Preparing high-speed streams...'
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < messages.length) {
        setStatusMessage(messages[msgIndex]);
        msgIndex++;
      }
    }, 1500);

    try {
      const response = await api.post('/analyze', { url });
      clearInterval(interval);
      onAnalysisSuccess(response.data, url);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'Failed to analyze URL. The content might be private or restricted.');
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
      
      {/* Small notification badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        New: Instagram Reels & High Speed YouTube MP3 supported
      </div>

      {/* Headline titles */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
        Download Videos, Audio & <br className="hidden sm:inline" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          Images Instantly
        </span>
      </h1>

      <p className="max-w-2xl text-base sm:text-lg text-gray-400 mb-10">
        Paste any supported media link from YouTube, Instagram, Facebook, or Twitter/X and download in seconds.
      </p>

      {/* Main Link Input Glass Form */}
      <div className="w-full max-w-3xl px-2">
        <form onSubmit={handleAnalyze} className="relative bg-cardbg bg-opacity-30 backdrop-blur-md p-2 rounded-2xl border border-borderglass shadow-glass flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:border-primary/50">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Paste media link here (e.g., https://www.youtube.com/watch?v=...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary py-3.5 px-8 flex items-center justify-center gap-2 cursor-pointer font-bold text-sm shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze URL'
            )}
          </button>
        </form>

        {/* Dynamic status indicators */}
        {loading && (
          <div className="mt-4 text-sm text-indigo-300 flex items-center justify-center gap-2 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {statusMessage}
          </div>
        )}

        {/* Error alerting banner */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm text-left max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default LandingHero;
