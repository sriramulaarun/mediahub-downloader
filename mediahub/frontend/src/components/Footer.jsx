import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Play, Heart } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const seoLinks = [
    { name: 'YouTube Downloader', path: '/youtube-downloader' },
    { name: 'Instagram Downloader', path: '/instagram-downloader' },
    { name: 'MP3 Downloader', path: '/mp3-downloader' },
    { name: 'Facebook Downloader', path: '/facebook-downloader' },
    { name: 'Video Downloader', path: '/video-downloader' },
  ];

  const quickLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/#features' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-darkbg border-t border-borderglass pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-gradient">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">MediaHub</span>
            </Link>
            <p className="text-sm text-gray-400">
              Download Videos, Audio & Images Instantly. Paste any supported media link and download in seconds.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="p-2 rounded-lg bg-cardbg bg-opacity-40 hover:bg-opacity-80 text-gray-400 hover:text-white transition-colors duration-300">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-cardbg bg-opacity-40 hover:bg-opacity-80 text-gray-400 hover:text-white transition-colors duration-300">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Downloaders */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Supported Downloaders</h3>
            <ul className="space-y-2">
              {seoLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-borderglass pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} MediaHub Downloader. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by <  span className="text-white font-semibold">Sriramula Arun.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
