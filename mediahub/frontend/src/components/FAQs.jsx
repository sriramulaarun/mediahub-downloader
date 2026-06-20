import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is MediaHub free to use?',
      answer: 'Yes! MediaHub offers unlimited downloads up to 720p resolution for all standard video links and audios completely free, without pop-up ads.'
    },
    {
      question: 'Why do 1080p downloads require a Premium Plan?',
      answer: 'YouTube streams high-resolution video streams (1080p, 1440p, 4K) separately from audio streams. Merging them requires substantial server-side computing power via transcoding libraries. The Premium Plan pays for these server resources.'
    },
    {
      question: 'What media formats can I download?',
      answer: 'You can download MP4 video format (360p, 720p, 1080p resolutions) and high-quality MP3 audio files. If FFmpeg is temporarily busy or missing, the tool automatically delivers pre-merged formats.'
    },
    {
      question: 'Where do my files go when I click download?',
      answer: 'Files are sent directly to your web browser. They will appear in your default downloads folder (e.g. Downloads directory on Windows/macOS).'
    },
    {
      question: 'Do you store downloaded videos on your servers?',
      answer: 'No. We download media files into a temporary server directory to process/merge them. A background cleanup job deletes these files within 10 minutes.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="max-w-xl mx-auto text-gray-400">
          Everything you need to know about formats, subscriptions, speeds, and limits.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <GlassCard 
              key={index}
              onClick={() => toggleFaq(index)}
              className="p-5 cursor-pointer text-left transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-white text-sm sm:text-md">
                  {faq.question}
                </h3>
                <button className="text-indigo-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 text-sm text-gray-400 border-t border-borderglass pt-3 leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};

export default FAQs;
