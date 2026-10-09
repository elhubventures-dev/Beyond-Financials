import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from '../../router/Router';
import { ShieldCheck, Lock, UserCheck, EyeOff, Bell, FileCheck } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const principles = [
    {
      icon: <Lock className="w-5 h-5 text-[#0046AD]" />,
      title: 'Secure account access',
      description: 'Sign-in is designed so only you can reach your profile, with extra checks where they matter.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Identity verification',
      description: 'When accounts open, we will confirm who you are before higher-value services are available.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-[#F59E0B]" />,
      title: 'Privacy',
      description: 'We ask only for what a service needs, and we will not harvest your phone contacts.',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-[#001B40]" />,
      title: 'Careful handling of information',
      description: 'Personal details are treated as confidential and used to provide the service you requested.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      title: 'Transaction protection',
      description: 'Payments and transfers are being designed so activity can be reviewed and unexpected charges investigated.',
    },
    {
      icon: <Bell className="w-5 h-5 text-indigo-600" />,
      title: 'Monitoring',
      description: 'We plan to watch for unusual activity and keep you informed about important account events.',
    },
  ];

  return (
    <section id="security" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            Security & privacy
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Built with care for your information
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            Trust matters in financial services. Beyond Financials is being designed around secure access, identity checks, privacy, and responsible handling of personal information. We do not claim that any system is impossible to compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((pillar) => (
            <Card key={pillar.title} variant="default" className="space-y-3 border border-gray-200/90 bg-white hover:border-[#0046AD]/30 transition-colors">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200 w-fit">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold font-display text-[#001B40]">
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>

        <Link to="/security" className="inline-flex text-sm font-bold text-[#0046AD] hover:underline">
          Read our security principles
        </Link>
      </div>
    </section>
  );
};
