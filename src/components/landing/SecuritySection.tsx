import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Lock, KeyRound, FileCheck, EyeOff, ServerCrash, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      icon: <EyeOff className="w-5 h-5 text-[#F59E0B]" />,
      title: 'Zero Client Secrets',
      description:
        'All API keys, cryptographic secrets, provider webhooks, and signing certificates remain strictly server-side. No credentials exist in browser memory.',
    },
    {
      icon: <Lock className="w-5 h-5 text-[#0046AD]" />,
      title: 'Double-Layer Input Validation',
      description:
        'All payloads are strongly typed with TypeScript and validated across both client forms and Express API gateway before processing.',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      title: 'PII Sanitized Logging',
      description:
        'Customer BVN, NIN, passwords, and banking identifiers are automatically stripped and redacted from server request and error logs.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-[#001B40]" />,
      title: 'Role-Based Access Control',
      description:
        'Granular permissions separating Super Admins, Operations, Customer Care, Merchants, and Retail users with strict audit logs.',
    },
  ];

  return (
    <section id="security" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            Security & Data Protection Principles
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Security Engineered into Every Layer
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            Financial platforms must prioritize trust and data protection from the very first line of code. Our architecture is designed with reference to Nigerian data protection principles (NDPA) and strict cybersecurity safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((pillar, idx) => (
            <Card key={idx} variant="default" className="space-y-3 border border-gray-200/90 bg-white hover:border-[#0046AD]/30 transition-colors">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200 w-fit">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold font-display text-[#001B40]">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
