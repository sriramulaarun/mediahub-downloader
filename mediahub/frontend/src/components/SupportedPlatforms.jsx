import React from 'react';
import GlassCard from './GlassCard';
import { ShieldAlert } from 'lucide-react';

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SupportedPlatforms = () => {
  const platforms = [
    {
      name: 'YouTube',
      tagline: 'Video & Audio MP3 Downloader',
      description: 'Download standard videos in 360p, 720p, or Full HD 1080p. Extract high-quality MP3 audio files directly.',
      icon: YoutubeIcon,
      iconColor: 'text-red-500',
      badge: 'Active (Phase 1)',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    {
      name: 'Instagram',
      tagline: 'Reels & Photo Downloader',
      description: 'Download reels, standard post videos, and high-resolution photo slides directly to your device.',
      icon: InstagramIcon,
      iconColor: 'text-pink-500',
      badge: 'Active (Phase 1)',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    {
      name: 'Facebook',
      tagline: 'Video & Page Downloader',
      description: 'Download Facebook watch videos, public group uploads, and page video content in HD quality.',
      icon: FacebookIcon,
      iconColor: 'text-blue-500',
      badge: 'Beta (Phase 2)',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    },
    {
      name: 'Twitter / X',
      tagline: 'Thread Video Downloader',
      description: 'Save videos and animated GIFs embedded in tweets instantly. Preserves original resolution.',
      icon: TwitterIcon,
      iconColor: 'text-slate-300',
      badge: 'Beta (Phase 2)',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    }
  ];

  return (
    <section id="platforms" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Supported Media Platforms
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400">
          MediaHub supports downloads from the most popular video sharing and social media websites with high processing speeds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <GlassCard key={platform.name} hover={true} className="p-6 flex gap-4">
              <div className={`p-4 rounded-2xl bg-cardbg bg-opacity-80 flex items-center justify-center shrink-0 border border-borderglass
                ${platform.name === 'YouTube' ? 'shadow-lg shadow-red-500/5' : ''}
                ${platform.name === 'Instagram' ? 'shadow-lg shadow-pink-500/5' : ''}
                ${platform.name === 'Facebook' ? 'shadow-lg shadow-blue-500/5' : ''}
              `}>
                <Icon className={`w-8 h-8 ${platform.iconColor}`} />
              </div>
              <div className="flex-1 flex flex-col items-start gap-2">
                <div className="w-full flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xxs font-semibold border ${platform.badgeColor}`}>
                    {platform.badge}
                  </span>
                </div>
                <div className="text-xs font-medium text-indigo-400">{platform.tagline}</div>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  {platform.description}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};

export default SupportedPlatforms;
