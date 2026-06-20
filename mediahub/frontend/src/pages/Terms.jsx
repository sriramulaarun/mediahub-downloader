import React from 'react';
import GlassCard from '../components/GlassCard';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 relative z-10 text-left animate-fade-in">
      <GlassCard className="p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white border-b border-borderglass pb-4">Terms of Service</h1>
        
        <div className="text-sm text-gray-300 leading-relaxed space-y-4">
          <p>
            Welcome to MediaHub Downloader. By using our services, you agree to comply with and be bound by the following terms of use.
          </p>

          <h2 className="text-md font-bold text-white pt-2">1. Acceptable Use Policy</h2>
          <p>
            MediaHub Downloader is provided strictly as a transcoding utility for personal, non-commercial use. Users are fully responsible for ensuring they have the legal right to download and store any media content processed through our server layers.
          </p>

          <h2 className="text-md font-bold text-white pt-2">2. Intellectual Property Rights</h2>
          <p>
            We respect the intellectual property rights of content creators. You must not use our service to download copyright-protected material without explicit consent from the rights holder. Any downloads that breach copyright are at the user's sole risk.
          </p>

          <h2 className="text-md font-bold text-white pt-2">3. Subscription and Billing</h2>
          <p>
            Our premium features require a recurring monthly subscription fee. Subscription upgrades are billed in advance, are non-refundable, and can be cancelled at any time from your settings panel.
          </p>

          <h2 className="text-md font-bold text-white pt-2">4. Disclaimer of Warranty</h2>
          <p>
            The service is provided "as is" and "as available". We do not guarantee uninterrupted processing speeds, platform cookie freshness, or complete uptime of third-party platforms.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Terms;
