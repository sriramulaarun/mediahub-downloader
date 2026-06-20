import React from 'react';
import GlassCard from './GlassCard';
import { Zap, ShieldCheck, History, Sparkles, Clock, LayoutGrid } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'High-Speed Downloads',
      description: 'Our backend utilizes fast connections to process, convert, and merge media streams in seconds.',
      icon: Zap,
    },
    {
      title: 'Unified Input',
      description: 'One single input bar parses YouTube, Instagram, Facebook, and Twitter URLs. No separate configurations needed.',
      icon: LayoutGrid,
    },
    {
      title: 'History & Favorites Sync',
      description: 'Log in to securely store your past downloads, keep track of favorites, and download them again whenever you need.',
      icon: History,
    },
    {
      title: 'Premium transcoders',
      description: 'Upgrade to unlock server-side FFmpeg merging for 1080p Full HD video streams and high-bitrate MP3 extractions.',
      icon: Sparkles,
    },
    {
      title: 'Bulk Download Manager',
      description: 'Download whole playlists, albums, or multiple Reels simultaneously. (Available for Premium members).',
      icon: Clock,
    },
    {
      title: 'Secure & Clean Interface',
      description: 'Unlike standard download sites, we provide a clean SaaS experience without pop-up ads, redirect scripts, or trackers.',
      icon: ShieldCheck,
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Engineered for Media Creators
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400">
          MediaHub gives you powerful download mechanics combined with a clean and secure SaaS layout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <GlassCard key={idx} hover={true} className="p-6 flex flex-col gap-4 items-start">
              <div className="p-3 rounded-xl bg-primary bg-opacity-10 border border-primary/20 text-primary-light">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mt-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
