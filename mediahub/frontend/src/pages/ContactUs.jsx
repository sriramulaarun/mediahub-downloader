import React, { useState } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all the fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contact', { name, email, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative z-10 animate-fade-in text-left">
      
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Contact Support</h2>
        <p className="max-w-xl mx-auto text-gray-400">Have questions about downloads, pricing plans, or need custom integrations? Let us know!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Support channels card */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Direct Channels</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Our operations team reviews support tickets daily. We aim to reply to all queries within 24 hours.
              </p>
              
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">Email Support</div>
                    <div className="text-white font-semibold mt-0.5">support@mediahub.download</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">Business Inquiries</div>
                    <div className="text-white font-semibold mt-0.5">bizdev@mediahub.download</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-borderglass pt-4 mt-6 text-xxs text-gray-500 font-medium">
              MediaHub Downloader Platform Service Co.
            </div>
          </GlassCard>
        </div>

        {/* Messaging Form */}
        <div className="md:col-span-7">
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>
            
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="py-8 text-center flex flex-col items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-success" />
                <div>
                  <h4 className="text-md font-bold text-white">Message Logged!</h4>
                  <p className="text-xs text-gray-400 mt-1">Thank you. Your message has been saved. We will contact you soon.</p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="glass-btn-secondary py-2 px-6 text-xs mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 p-3 rounded-xl border border-borderglass focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 p-3 rounded-xl border border-borderglass focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 font-medium">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900/50 p-3 rounded-xl border border-borderglass focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default ContactUs;
