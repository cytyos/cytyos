import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-300 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>

        <div className="space-y-8 text-sm leading-relaxed bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong>Account Data:</strong> Email address, name, and encrypted password (managed via Supabase).</li>
                <li><strong>Usage Data:</strong> Project coordinates, search queries, and interaction logs to improve our AI models.</li>
                <li><strong>Payment Data:</strong> Processed directly by Stripe. We do not store full credit card numbers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. How We Use Your Data</h2>
            <p>We use your information to provide the Service, process payments, and improve our AI algorithms. We strictly do not sell your personal data to third-party data brokers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Third-Party Services</h2>
            <p>To operate, we share minimal necessary data with trusted partners:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-400">
                <li><strong>Mapbox:</strong> For geocoding and map rendering.</li>
                <li><strong>OpenAI:</strong> For processing AI analysis requests (data is anonymized where possible).</li>
                <li><strong>Stripe:</strong> For payment processing.</li>
                <li><strong>Supabase:</strong> For database and authentication hosting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Data Security</h2>
            <p>We implement industry-standard security measures (SSL, encryption at rest) to protect your data. However, no internet transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Your Rights</h2>
            <p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, contact us at support@cytyos.com.</p>
          </section>

          <div className="pt-8 border-t border-gray-800 text-xs text-gray-500">
            Last updated: January 2026.
          </div>
        </div>
      </div>
    </div>
  );
};