import React from 'react';
import GlassCard from '../components/GlassCard';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 relative z-10 text-left animate-fade-in">
      <GlassCard className="p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white border-b border-borderglass pb-4">Privacy Policy</h1>
        
        <div className="text-sm text-gray-300 leading-relaxed space-y-4">
          <p>
            Your privacy is extremely important to us. This policy details how we treat account credentials, telemetry data, and media download files.
          </p>

          <h2 className="text-md font-bold text-white pt-2">1. Temporary Download Storage</h2>
          <p>
            When you request a download, the backend temporary folder caches the transcoded file. We run a background cleanup task that completely wipes files from server disks within 10 minutes of download. No parsed video logs are permanently cached on disk.
          </p>

          <h2 className="text-md font-bold text-white pt-2">2. Credentials Encryption</h2>
          <p>
            We use salted hashing to secure passwords on SQLite or PostgreSQL databases. Raw strings are never saved in database tables. JWT tokens are verified securely on every REST query.
          </p>

          <h2 className="text-md font-bold text-white pt-2">3. Cookies and Social Accounts</h2>
          <p>
            We do not share search keywords, URLs, or browser cookies with third-party tracking networks. Free downloads do not require registration and leave no profile trails.
          </p>

          <h2 className="text-md font-bold text-white pt-2">4. Analytics Tracking</h2>
          <p>
            We use basic platform metrics to monitor download frequency and prevent DDOS rate limit issues. You can review your activity logs at any time from your private profile dashboard.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default PrivacyPolicy;
