/**
 * Beyond Financials - 404 Page Not Found
 */

import React from 'react';
import { Link } from '../router/Router';
import { Button } from '../components/ui/Button';
import { SEOHead } from '../components/seo/SEOHead';
import { Compass, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-28 bg-[#F8FAFC] flex items-center justify-center min-h-[65vh]">
      <SEOHead
        title="Page Not Found | Beyond Financials"
        description="The requested page could not be found."
        canonicalPath="/404"
      />
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0046AD] flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0046AD]">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold font-display text-[#001B40]">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-normal">
            The page you are looking for might have been moved or does not exist. Explore our services hub or return to the homepage.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/services"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0046AD] text-white text-xs font-bold hover:bg-[#003B94] transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Explore Services Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white border border-gray-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
