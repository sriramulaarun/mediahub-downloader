import React, { useState } from 'react';
import LandingHero from '../components/LandingHero';
import DownloadResult from '../components/DownloadResult';
import SupportedPlatforms from '../components/SupportedPlatforms';
import Features from '../components/Features';
import FAQs from '../components/FAQs';
import Testimonials from '../components/Testimonials';
import GlassCard from '../components/GlassCard';
import { ArrowRight, HelpCircle, Shield, Globe, Award } from 'lucide-react';

const Home = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  const handleAnalysisSuccess = (result, url) => {
    setAnalysisResult(result);
    setAnalyzedUrl(url);
    // Smooth scroll back to top of container to show result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToInput = () => {
    setAnalysisResult(null);
    setAnalyzedUrl('');
  };

  return (
    <div className="relative w-full">
      {analysisResult ? (
        <DownloadResult 
          result={analysisResult} 
          url={analyzedUrl} 
          onBack={handleBackToInput} 
        />
      ) : (
        <>
          {/* Main Hero URL Input Panel */}
          <LandingHero onAnalysisSuccess={handleAnalysisSuccess} />

          {/* Supported platform section grid */}
          <SupportedPlatforms />

          {/* How It Works Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                How It Works
              </h2>
              <p className="max-w-xl mx-auto text-gray-400">
                Download high-quality social clips in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Paste URL Link', desc: 'Copy the video, audio, reel, or photo link from social media apps and paste it into the search bar above.' },
                { step: '2', title: 'Analyze Metadata', desc: 'Click Analyze URL. Our parser extracts all resolutions, file sizes, conversion formats, and custom stream options.' },
                { step: '3', title: 'Download File', desc: 'Select your preferred format (e.g. 720p MP4 or high-fidelity MP3 audio) and download the file to your device.' }
              ].map((item) => (
                <GlassCard key={item.step} className="p-8 text-center flex flex-col items-center gap-4 relative">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-600/20">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Technical Specs/Features Panel */}
          <Features />

          {/* Customer Reviews/Social Proof */}
          <Testimonials />

          {/* FAQ Accordion List */}
          <FAQs />
        </>
      )}
    </div>
  );
};

export default Home;
