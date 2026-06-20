import React from 'react';
import GlassCard from './GlassCard';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Social Media Manager',
      quote: 'MediaHub saves me hours every single week. I can download high-resolution Reels and YouTube clips for content research instantly. The interface is clean and doesn\'t have sketchy popups!',
      stars: 5,
      avatar: 'SJ'
    },
    {
      name: 'David Carter',
      role: 'Content Creator',
      quote: 'I upgraded to the Premium plan for 1080p merging. The download speeds are incredible, and the video quality is pristine. Being able to convert directly to MP3 has changed my workflow.',
      stars: 5,
      avatar: 'DC'
    },
    {
      name: 'Liam Patterson',
      role: 'Digital Marketer',
      quote: 'A lifesaver for marketing agencies! I can easily grab media clips for client mockups. The history tab lets me easily redownload previous videos without analyzing the link again.',
      stars: 5,
      avatar: 'LP'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Trusted by Thousands of Creators
        </h2>
        <p className="max-w-xl mx-auto text-gray-400">
          See why social managers, video editors, and marketers rely on MediaHub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, idx) => (
          <GlassCard key={idx} hover={true} className="p-6 flex flex-col justify-between gap-6">
            
            {/* Quote */}
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "{t.quote}"
            </p>

            {/* User footer */}
            <div className="flex items-center gap-3 border-t border-borderglass pt-4">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-xs">
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-semibold text-white truncate">{t.name}</h4>
                <p className="text-xs text-gray-400 truncate">{t.role}</p>
              </div>
              
              {/* Star rating */}
              <div className="flex items-center text-yellow-500 shrink-0">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
