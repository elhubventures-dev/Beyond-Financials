import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from '../../router/Router';
import {
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
  TrendingUp,
  Coins,
  Store,
  Users2,
  ArrowRight,
} from 'lucide-react';

const ECOSYSTEM = [
  {
    title: 'Digital banking',
    description: 'A home for everyday money — accounts, wallets, transfers, and transaction history.',
    status: 'Coming soon',
    href: '/services/banking',
    icon: <Landmark className="w-5 h-5 text-[#0046AD]" />,
  },
  {
    title: 'Savings',
    description: 'Set money aside for goals, emergencies, and the plans you do not want to spend early.',
    status: 'Coming soon',
    href: '/services/savings',
    icon: <PiggyBank className="w-5 h-5 text-emerald-600" />,
  },
  {
    title: 'Loans',
    description: 'Access to clearer, more respectful financing when credit becomes available.',
    status: 'Coming soon',
    href: '/services/loans',
    icon: <HandCoins className="w-5 h-5 text-amber-600" />,
  },
  {
    title: 'Payments',
    description: 'Airtime, data, electricity, cable TV, internet, and other everyday bills in one place.',
    status: 'Coming soon',
    href: '/services/payments',
    icon: <ReceiptText className="w-5 h-5 text-teal-600" />,
  },
  {
    title: 'Merchant services',
    description: 'A simpler way for businesses to collect payments and see what they have earned.',
    status: 'Coming soon',
    icon: <Store className="w-5 h-5 text-indigo-600" />,
  },
  {
    title: 'Agent services',
    description: 'Tools for neighbourhood agents who help people move and access money locally.',
    status: 'Coming soon',
    icon: <Users2 className="w-5 h-5 text-blue-800" />,
  },
  {
    title: 'Investments',
    description: 'A future place to explore wealth-building options and see your holdings clearly.',
    status: 'Planned',
    href: '/services/investments',
    icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
  },
  {
    title: 'Digital assets',
    description: 'Future services for buying, selling, and using digital assets alongside everyday money.',
    status: 'Planned',
    href: '/services/crypto',
    icon: <Coins className="w-5 h-5 text-amber-500" />,
  },
];

export const ArchitecturePreview: React.FC = () => {
  return (
    <section id="ecosystem" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            Our financial ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Services that belong together
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            Instead of jumping between separate apps, Beyond Financials is designed so banking, savings, loans, payments, and later wealth services can live in one relationship. Nothing here is open for transactions yet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ECOSYSTEM.map((item) => (
            <Card key={item.title} variant="default" className="flex flex-col justify-between border border-gray-200/90 bg-white h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 w-fit">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.status === 'Planned' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-[#001B40]">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
              {item.href ? (
                <Link to={item.href} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0046AD] hover:underline">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <p className="mt-4 text-xs text-gray-400">Details will be shared as launch approaches.</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
