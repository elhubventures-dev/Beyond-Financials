/**
 * Beyond Financials - Public Services & Product Data Catalog
 * 
 * Strict Content Guidelines:
 * - No invented interest rates, minimum balances, withdrawal penalties, or returns.
 * - No invented loan limits, approval guarantees, or fee schedules.
 * - Accurate phase classification (Phase 1 Contracted vs. Future Vision).
 * - Benefit-driven, educational product-vision language.
 */

import { ServiceDefinition, ServiceStatusConfig, ServiceStatusType } from '../types/services';

export const SERVICE_STATUS_MAP: Record<ServiceStatusType, ServiceStatusConfig> = {
  AVAILABLE: {
    type: 'AVAILABLE',
    label: 'Operational',
    badgeVariant: 'emerald',
    description: 'Service is active and processing live operations.',
    isPhase1: true,
  },
  COMING_SOON: {
    type: 'COMING_SOON',
    label: 'Coming Soon (Phase 1)',
    badgeVariant: 'amber',
    description: 'Contracted Phase 1 deliverable currently in active milestone engineering.',
    isPhase1: true,
  },
  JOIN_WAITLIST: {
    type: 'JOIN_WAITLIST',
    label: 'Early Access Waitlist',
    badgeVariant: 'blue',
    description: 'Early registration open for priority onboarding rollout.',
    isPhase1: true,
  },
  FUTURE: {
    type: 'FUTURE',
    label: 'Future Strategic Scope',
    badgeVariant: 'purple',
    description: 'Strategic roadmap capability planned for subsequent platform releases.',
    isPhase1: false,
  },
};

export const SERVICES_LIST: ServiceDefinition[] = [
  {
    id: 'banking',
    slug: 'banking',
    title: 'Digital Banking & Accounts',
    tagline: 'Your Single Financial Hub for Everyday Money',
    shortDescription:
      'Manage accounts, virtual accounts, and instant interbank money transfers through a single unified ledger.',
    fullDescription:
      'Beyond Financials Banking is engineered as the central foundation of your financial life. From personalized virtual accounts to instant fund transfers and granular transaction histories, experience high-speed digital money management built on modern financial infrastructure.',
    category: 'Core Banking',
    status: 'COMING_SOON',
    waitlistInterest: 'digital_banking',
    waitlistButtonText: 'Join Banking Waitlist',
    metaTitle: 'Beyond Financials Banking | Digital Financial Services',
    metaDescription:
      'Experience unified digital banking with Beyond Financials. Seamless accounts, dedicated virtual accounts, and instant transfers built for Nigeria.',
    canonicalPath: '/services/banking',
    phase: 'Phase 1 Contracted',
    features: [
      {
        title: 'Dedicated Virtual Accounts',
        description: 'Receive personal and business deposits seamlessly through dedicated virtual account numbers mapped to your profile.',
        tag: 'Phase 1',
      },
      {
        title: 'Instant Interbank Transfers',
        description: 'Transfer funds quickly and securely to commercial banks and mobile wallets across Nigeria with real-time settlement status.',
        tag: 'Phase 1',
      },
      {
        title: 'Unified Multi-Wallet Balance',
        description: 'Monitor your primary wallet, savings reserves, and transactional floats in one cohesive view without switching apps.',
        tag: 'Phase 1',
      },
      {
        title: 'Real-Time Transaction Ledger',
        description: 'Comprehensive, downloadable transaction histories with categorized spending insights and instant digital receipts.',
        tag: 'Phase 1',
      },
      {
        title: 'Tiered KYC Compliance',
        description: 'Progress seamlessly through regulatory identity verification tiers (BVN, NIN, Selfie, Proof of Address) to unlock higher limits.',
        tag: 'Phase 1',
      },
      {
        title: 'Zero-Exposure Security',
        description: 'Multi-factor authentication, biometric verification, and session guards designed to keep your financial credentials protected.',
        tag: 'Phase 1',
      },
    ],
    benefits: [
      {
        audience: 'Everyday Consumers & Families',
        headline: 'Clear, Transparent Money Management',
        description: 'Keep all your daily inflows, outflows, and essential expenses organized with clean transaction breakdowns and instant notifications.',
        keyPoints: [
          'Instant notifications for incoming and outgoing funds',
          'Clean, searchable digital receipts for every payment',
          'Simple identity verification process with tiered access',
        ],
      },
      {
        audience: 'Salary Earners & Professionals',
        headline: 'Predictable Cash Flow & Dedicated Accounts',
        description: 'Route your salary into a secure digital environment with automated categorizations and direct links to savings and financing.',
        keyPoints: [
          'Direct payroll reception through dedicated virtual account',
          'Instant allocation into automated savings or bill budgets',
          'Priority access to salary advance and credit services',
        ],
      },
      {
        audience: 'Entrepreneurs & Freelancers',
        headline: 'Professional Inflow Management',
        description: 'Give your clients dedicated virtual accounts to pay into, keeping personal funds and commercial proceeds clearly segregated.',
        keyPoints: [
          'Dedicated virtual account identifiers for clients',
          'Exportable statements for record-keeping and tax filing',
          'Rapid settlement into main operational float',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Create Your Profile',
        description: 'Sign up in minutes with basic contact details and basic security credentials.',
      },
      {
        step: '02',
        title: 'Verify Your Identity',
        description: 'Complete seamless Tier 1 verification with your regulatory identifiers for safety.',
      },
      {
        step: '03',
        title: 'Receive Dedicated Virtual Account',
        description: 'Get your unique account number to start receiving funds instantly from any Nigerian bank.',
      },
      {
        step: '04',
        title: 'Transact Across the Ecosystem',
        description: 'Transfer money, automate savings, pay utility bills, or apply for credit from one unified interface.',
      },
    ],
    faqs: [
      {
        question: 'Is Beyond Financials currently a licensed commercial bank?',
        answer:
          'Beyond Financials is a financial technology platform currently in active Phase 1 engineering. Banking infrastructure and account services will be operated in direct partnership with licensed deposit-taking financial institutions in compliance with Central Bank of Nigeria (CBN) regulations.',
      },
      {
        question: 'When will customer onboarding officially open?',
        answer:
          'Customer onboarding will commence upon completion of our Phase 1 milestone engineering and regulatory readiness checks. Joining the waitlist guarantees you priority invitation and early onboarding access.',
      },
      {
        question: 'What documents are required to open an account?',
        answer:
          'In alignment with Nigerian tiered KYC regulations, basic accounts require verified phone number and name. Higher tiers will require BVN, NIN, facial biometric confirmation, and proof of residential address.',
      },
      {
        question: 'Can I transfer funds to all Nigerian banks?',
        answer:
          'Yes, our interbank transfer integration is designed to support instant payments to all commercial banks, microfinance institutions, and mobile money operators nationwide.',
      },
    ],
    relatedServiceSlugs: ['savings', 'payments', 'loans'],
    disclaimer:
      'Banking services and virtual accounts are provided via licensed financial partner institutions. Beyond Financials does not take unauthorized deposits directly.',
  },
  {
    id: 'savings',
    slug: 'savings',
    title: 'Disciplined & Goal Savings',
    tagline: 'Structured Tools to Build Sustainable Wealth',
    shortDescription:
      'Grow your savings with flexible pools, targeted goal vaults, locked deposits, and automated recurring schedules.',
    fullDescription:
      'Saving money requires discipline and the right financial architecture. Beyond Financials Savings provides multiple structured saving modes tailored to your goals—whether you are setting aside funds for emergencies, budgeting for rent, or locking capital away for long-term growth.',
    category: 'Wealth & Savings',
    status: 'COMING_SOON',
    waitlistInterest: 'smart_savings',
    waitlistButtonText: 'Join Savings Waitlist',
    metaTitle: 'Beyond Financials Savings | Save Toward Your Goals',
    metaDescription:
      'Build long-term financial resilience with Beyond Financials Savings. Flexible savings, goal vaults, locked deposits, and scheduled auto-save.',
    canonicalPath: '/services/savings',
    phase: 'Phase 1 Contracted',
    features: [
      {
        title: 'Flexible Savings Pocket',
        description: 'An easily accessible emergency buffer that allows you to deposit and withdraw funds whenever life happens.',
        tag: 'Phase 1',
      },
      {
        title: 'Goal-Based Target Vaults',
        description: 'Create customized targets for rent, education, business startup capital, or travel with visual milestone tracking.',
        tag: 'Phase 1',
      },
      {
        title: 'Locked Fixed Deposits',
        description: 'Commit funds for predetermined durations to avoid impulsive spending and build strict capital discipline.',
        tag: 'Phase 1',
      },
      {
        title: 'Automated Scheduled Auto-Save',
        description: 'Set daily, weekly, or monthly recurring transfers from your main wallet into your dedicated savings targets.',
        tag: 'Phase 1',
      },
      {
        title: 'Strict Accounting Isolation',
        description: 'Savings balances are segregated within the immutable double-entry ledger so your saved funds remain secure.',
        tag: 'Phase 1',
      },
      {
        title: 'Multi-Goal Progress Dashboard',
        description: 'Real-time percentage progress bars, timeline projections, and achievement badges to keep you motivated.',
        tag: 'Phase 1',
      },
    ],
    benefits: [
      {
        audience: 'Disciplined Savers & Budgeters',
        headline: 'Automate Good Habits Without Stress',
        description: 'Remove the friction of manual transfers by setting automated rules that quietly build your reserves every payday.',
        keyPoints: [
          'Automatic recurring debits aligned with your income cycle',
          'Separation of daily spending cash from protected reserves',
          'Clear timeline visibility toward target completion',
        ],
      },
      {
        audience: 'Families & Household Planners',
        headline: 'Dedicated Buckets for Critical Expenses',
        description: 'Prevent unexpected expenses from disrupting your finances by maintaining dedicated pockets for school fees, healthcare, and rent.',
        keyPoints: [
          'Multiple simultaneous goal vaults for distinct family needs',
          'Target milestone tracking with target completion dates',
          'Instant top-ups from your primary digital wallet',
        ],
      },
      {
        audience: 'Micro-Entrepreneurs',
        headline: 'Working Capital Accumulation',
        description: 'Lock away a portion of daily business revenue to fund future inventory replenishment or equipment upgrades.',
        keyPoints: [
          'Daily or weekly micro-deposits from sales revenue',
          'Lock terms preventing premature capital drain',
          'Exportable savings summaries for accounting',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Choose a Savings Type',
        description: 'Select Flexible, Goal Target, or Locked Savings based on your time horizon.',
      },
      {
        step: '02',
        title: 'Set Target & Schedule',
        description: 'Define your desired goal amount and choose recurring daily, weekly, or monthly auto-deposits.',
      },
      {
        step: '03',
        title: 'Track Your Growth',
        description: 'Monitor your progress in real time as your balances build consistently.',
      },
      {
        step: '04',
        title: 'Reach Your Milestone',
        description: 'Withdraw funds back to your wallet upon goal maturity or roll over into long-term investments.',
      },
    ],
    faqs: [
      {
        question: 'What savings modes will be available at launch?',
        answer:
          'Beyond Financials is engineering four core savings modalities: Flexible Savings (accessible anytime), Goal-Based Vaults (dedicated milestone targets), Locked Deposits (fixed duration for discipline), and Scheduled Auto-Save.',
      },
      {
        question: 'Are there minimum balance requirements or hidden charges?',
        answer:
          'Beyond Financials is committed to transparent, fair pricing. Specific commercial terms and yield rates will be published prior to public launch upon partner institution finalization.',
      },
      {
        question: 'Can I lock savings for a specific period?',
        answer:
          'Yes. Locked Savings are designed specifically to help users lock funds for chosen periods to cultivate strict financial discipline and prevent impulsive withdrawals.',
      },
      {
        question: 'How do I fund my savings account?',
        answer:
          'You will be able to fund your savings directly from your Beyond Financials primary wallet or via instant bank transfer from any external account.',
      },
    ],
    relatedServiceSlugs: ['banking', 'investments', 'payments'],
    disclaimer:
      'Specific yield structures and partner terms will be published upon regulatory deployment. Beyond Financials does not promise speculative or guaranteed returns.',
  },
  {
    id: 'loans',
    slug: 'loans',
    title: 'Transparent Credit & Financing',
    tagline: 'Accessible Capital Tailored to Your Real Cash Flow',
    shortDescription:
      'Fair, transparent financing options engineered for salary earners, entrepreneurs, and individuals facing vital cash needs.',
    fullDescription:
      'Access to reliable credit is essential for economic momentum. Beyond Financials Loans is being built to provide straightforward personal and business financing without predatory traps, opaque hidden charges, or harassment. Whether you need salary bridge financing or working capital for inventory, our credit products are designed for sustainable repayment.',
    category: 'Credit & Financing',
    status: 'COMING_SOON',
    waitlistInterest: 'personal_loans',
    waitlistButtonText: 'Join the Loan Interest List',
    metaTitle: 'Beyond Financials Loans | Flexible Financing Solutions',
    metaDescription:
      'Explore accessible financing options designed for salary earners, business owners, and personal needs with Beyond Financials. Join the loan interest list.',
    canonicalPath: '/services/loans',
    phase: 'Phase 1 Contracted',
    features: [
      {
        title: 'Personal Cash Flow Financing',
        description: 'Manage planned life events, tuition payments, or urgent personal expenses with structured, predictable repayment schedules.',
        tag: 'Phase 1',
      },
      {
        title: 'Salary-Linked Advance',
        description: 'Bridge mid-month cash crunches before payday with automated salary-linked credit facilities for verified employees.',
        tag: 'Phase 1',
      },
      {
        title: 'SME Working Capital',
        description: 'Fuel retail inventory purchases, service equipment acquisition, and business expansion based on verified commercial turnover.',
        tag: 'Phase 1',
      },
      {
        title: 'Emergency Safety Net Credit',
        description: 'Rapid-access emergency credit lines designed to handle critical medical or urgent household repairs with dignity.',
        tag: 'Phase 1',
      },
      {
        title: 'Transparent Repayment Schedules',
        description: 'Clear breakdown of principal, tenor, and repayment dates before acceptance—no sudden surprises or hidden deductions.',
        tag: 'Phase 1',
      },
      {
        title: 'Automated Direct Settlement',
        description: 'Approved loan amounts disburse directly into your Beyond Financials wallet with seamless scheduled debit repayments.',
        tag: 'Phase 1',
      },
    ],
    benefits: [
      {
        audience: 'Salary Earners & Civil Servants',
        headline: 'Peace of Mind Between Paychecks',
        description: 'Never worry about sudden timing mismatches between urgent bills and salary payday. Access convenient salary advances built around your earnings.',
        keyPoints: [
          'Pre-qualification based on verified payroll inflow',
          'Automatic repayment deduction upon salary deposit',
          'No collateral required for verified salary earners',
        ],
      },
      {
        audience: 'Entrepreneurs & Small Business Owners',
        headline: 'Keep Your Business Moving Forward',
        description: 'Seize bulk inventory discounts or fulfill client purchase orders quickly without stalling your operational cash flow.',
        keyPoints: [
          'Credit evaluation considering actual business turnover',
          'Flexible tenors matched to customer payment cycles',
          'Streamlined digital application with minimal paperwork',
        ],
      },
      {
        audience: 'Students & Young Adults',
        headline: 'Educational & Skill Financing',
        description: 'Fund essential educational materials, certifications, and vocational courses with structured instalment schedules.',
        keyPoints: [
          'Accessible starter credit lines for verified students',
          'Predictable monthly instalment schedules',
          'Builds early positive financial credit history',
        ],
      },
      {
        audience: 'General Consumers & Families',
        headline: 'Emergency Relief with Total Dignity',
        description: 'Address medical emergencies or urgent home repairs without relying on predatory lenders or compromising your privacy.',
        keyPoints: [
          'Strict data privacy and respectful customer care',
          'Clear disclosures before you accept any financing',
          'No contact shaming or unauthorized data harvesting',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Complete Identity & Income Verification',
        description: 'Verify your profile and link your verified salary or business account information.',
      },
      {
        step: '02',
        title: 'Select Financing Category & Amount',
        description: 'Choose between personal, salary advance, or business financing based on your need.',
      },
      {
        step: '03',
        title: 'Review Transparent Terms',
        description: 'Inspect full repayment breakdown, tenor, and instalment amounts with zero hidden clauses.',
      },
      {
        step: '04',
        title: 'Instant Disbursement & Repayment',
        description: 'Funds are credited directly to your Beyond Financials wallet with automated scheduled repayment.',
      },
    ],
    faqs: [
      {
        question: 'Who is eligible to apply for Beyond Financials loans?',
        answer:
          'Our financing solutions are being engineered for salary earners, civil servants, registered entrepreneurs, small business owners, and general consumers who have completed Tier 2 or Tier 3 KYC verification.',
      },
      {
        question: 'Are loan limits and interest rates confirmed yet?',
        answer:
          'Specific interest rates, loan limits, tenors, and underwriting algorithms will be finalized in accordance with partner credit policies and regulatory requirements prior to public credit rollout.',
      },
      {
        question: 'Will Beyond Financials harass my phone contacts for repayment?',
        answer:
          'Never. Beyond Financials strictly prohibits contact harassment, unauthorized phonebook scraping, or predatory recovery methods. We comply strictly with the Nigeria Data Protection Act (NDPA) and ethical lending standards.',
      },
      {
        question: 'How do I get early priority for loan access?',
        answer:
          'Join our Loan Interest List on the waitlist. Priority onboarding and pre-qualification invitations will be dispatched to early registrants when the credit module goes live.',
      },
    ],
    relatedServiceSlugs: ['banking', 'savings'],
    disclaimer:
      'Credit underwriting and loan facilities are subject to identity verification, affordability checks, and credit approval by licensed lending partners. We do not guarantee unconditional loan approvals.',
  },
  {
    id: 'payments',
    slug: 'payments',
    title: 'Everyday Utility & Bill Payments',
    tagline: 'Fast, Dependable Payments for Daily Living',
    shortDescription:
      'Recharge airtime, buy data, pay electricity DISCOs, renew cable TV, and settle government fees instantly from your wallet balance.',
    fullDescription:
      'Paying for essential services should be fast, dependable, and error-free. Beyond Financials Payments connects directly with major utility, telecommunications, and government billers across Nigeria, ensuring your tokens, subscriptions, and receipts generate instantly with zero downtime.',
    category: 'Everyday Payments',
    status: 'COMING_SOON',
    waitlistInterest: 'bill_payments',
    waitlistButtonText: 'Join Payments Waitlist',
    metaTitle: 'Beyond Financials Payments | Everyday Utility & Bill Payments',
    metaDescription:
      'Pay electricity, buy airtime, subscribe to internet and cable TV, and settle government fees with Beyond Financials. Instant digital receipts.',
    canonicalPath: '/services/payments',
    phase: 'Phase 1 Contracted',
    features: [
      {
        title: 'Instant Airtime & Data Top-ups',
        description: 'Instant recharge for MTN, Airtel, Glo, and 9mobile with saved beneficiary numbers and automated repeat purchases.',
        tag: 'Phase 1',
      },
      {
        title: 'Electricity Token Generation (DISCOs)',
        description: 'Purchase prepaid and postpaid power tokens for Ikeja, Eko, Abuja, Kano, Ibadan, Enugu, Port Harcourt, and other DISCOs.',
        tag: 'Phase 1',
      },
      {
        title: 'Cable TV & Entertainment Subscriptions',
        description: 'Renew DStv, GOtv, and StarTimes packages instantly with immediate decoder reconnection verification.',
        tag: 'Phase 1',
      },
      {
        title: 'Broadband & Fiber Internet',
        description: 'Renew Spectranet, Smile, Swift, and fibre broadband connections with one click directly from your balance.',
        tag: 'Phase 1',
      },
      {
        title: 'Government & Tax Collections',
        description: 'Settle state and federal revenue fees, vehicle registrations, and municipal levies with verifiable government receipts.',
        tag: 'Phase 1',
      },
      {
        title: 'Education & Examination Pin Purchases',
        description: 'Purchase WAEC, NECO, and JAMB registration pins and scratch cards securely without queueing.',
        tag: 'Phase 1',
      },
    ],
    benefits: [
      {
        audience: 'Busy Households & Individuals',
        headline: 'Never Get Disconnected in the Dark',
        description: 'Recharge electricity meters and internet at any hour of the day or night with instant token delivery directly on your screen and via SMS.',
        keyPoints: [
          'Instant meter token generation and history archiving',
          'Beneficiary saving for quick recurring monthly recharges',
          'Zero delays on cable TV signal reconnection',
        ],
      },
      {
        audience: 'Remote Workers & Digital Creatives',
        headline: 'Zero-Interruption Connectivity',
        description: 'Keep your mobile data and home fiber running smoothly with scheduled auto-renewals so you never drop off client meetings.',
        keyPoints: [
          'Automatic renewal triggers for broadband packages',
          'Instant digital invoices for expense claims and reimbursements',
          'Direct debit from your primary wallet balance',
        ],
      },
      {
        audience: 'Retail Merchants & Agents',
        headline: 'Commercial Value-Added Services',
        description: 'Provide essential bill payment services to your local community and earn transparent transaction commissions.',
        keyPoints: [
          'Fast transaction processing for walk-in customers',
          'Printable receipts and SMS dispatch',
          'Integrated accounting into your merchant settlement float',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Select Bill Category',
        description: 'Choose Airtime, Data, Electricity, Cable TV, Internet, Education, or Government Payments.',
      },
      {
        step: '02',
        title: 'Enter Provider & Account Details',
        description: 'Input meter number, phone number, or smartcard number with automatic name validation.',
      },
      {
        step: '03',
        title: 'Confirm Payment Amount',
        description: 'Review provider details and authorized debit amount with zero hidden surcharges.',
      },
      {
        step: '04',
        title: 'Instant Fulfillment & Digital Receipt',
        description: 'Receive your token or confirmation immediately with an official downloadable transaction receipt.',
      },
    ],
    faqs: [
      {
        question: 'Which electricity distribution companies (DISCOs) are supported?',
        answer:
          'Our utility billing integration is configured to support all major Nigerian DISCOs including IKEDC, EKEDC, AEDC, IBEDC, EEDC, PHED, KAEDCO, and KEDCO for both prepaid and postpaid meters.',
      },
      {
        question: 'What happens if my token generation is delayed by network issues?',
        answer:
          'All bill payments are protected by our immutable ledger state machine. If an external biller aggregator fails to respond, the transaction status is tracked and unfulfilled debits are automatically resolved.',
      },
      {
        question: 'Can I save beneficiary details for my frequent bills?',
        answer:
          'Yes. You will be able to save meter numbers, smartcards, and phone numbers with custom nicknames for one-tap payments in subsequent sessions.',
      },
      {
        question: 'Can I download official receipts for tax and business accounting?',
        answer:
          'Yes. Every successful bill payment generates an official branded digital receipt complete with verification reference, timestamp, and breakdown.',
      },
    ],
    relatedServiceSlugs: ['banking', 'savings'],
    disclaimer:
      'Utility and bill payment fulfillment relies on operational connectivity with third-party aggregators and utility service providers.',
  },
  {
    id: 'investments',
    slug: 'investments',
    title: 'Curated Investments & Wealth',
    tagline: 'Access Structured Growth Opportunities with Clarity',
    shortDescription:
      'Explore a curated marketplace of structured investment opportunities and portfolio tracking tools to build long-term capital.',
    fullDescription:
      'Long-term financial freedom requires moving beyond basic savings into structured asset accumulation. Beyond Financials Investments is being designed as an intuitive, transparent gateway for retail investors to explore vetted opportunities, diversify holdings, and track portfolio performance with institutional clarity.',
    category: 'Capital & Markets',
    status: 'FUTURE',
    waitlistInterest: 'investments_future',
    waitlistButtonText: 'Join the Investment Interest List',
    metaTitle: 'Beyond Financials Investments | Coming Soon',
    metaDescription:
      'Explore structured investment opportunities and portfolio wealth management tools with Beyond Financials. Join the investment waitlist.',
    canonicalPath: '/services/investments',
    phase: 'Phase 2 Future Vision',
    features: [
      {
        title: 'Curated Opportunity Marketplace',
        description: 'Explore vetted commercial paper, fixed income, real estate notes, and agriculture opportunities when regulatory frameworks permit.',
        tag: 'Future Scope',
      },
      {
        title: 'Unified Portfolio Tracker',
        description: 'Monitor all asset allocations, maturity schedules, and performance analytics from a single visual dashboard.',
        tag: 'Future Scope',
      },
      {
        title: 'Transparent Risk & Horizon Disclosures',
        description: 'Clear, unbiased risk ratings, underlying asset documentation, and maturity timelines for every investment product.',
        tag: 'Future Scope',
      },
      {
        title: 'Automated Dividend & Yield Reinvestment',
        description: 'Route matured yields and interest earnings back into your primary wallet or automatically compound them into new vaults.',
        tag: 'Future Scope',
      },
      {
        title: 'Fractional Asset Participation',
        description: 'Participate in high-value institutional grade opportunities through accessible minimum entry thresholds.',
        tag: 'Future Scope',
      },
      {
        title: 'Tax & Performance Reporting',
        description: 'Generate annual portfolio statements and realized yield reports for personal accounting and tax compliance.',
        tag: 'Future Scope',
      },
    ],
    benefits: [
      {
        audience: 'Long-Term Wealth Builders',
        headline: 'Diversify Beyond Inflation',
        description: 'Protect your purchasing power by putting surplus capital to work across diverse asset classes with structured maturity timelines.',
        keyPoints: [
          'Access to multiple asset categories on one platform',
          'Clear visibility into maturity dates and yield structures',
          'Automatic dividend settlement into your digital account',
        ],
      },
      {
        audience: 'First-Time Retail Investors',
        headline: 'Demystifying Complex Financial Markets',
        description: 'No intimidating jargon or opaque contracts. Understand exactly where your capital is allocated and what the risk parameters are.',
        keyPoints: [
          'Educational guides explaining risk vs. return dynamics',
          'Transparent prospectuses and asset origin information',
          'Simulated projection tools to plan future capital milestones',
        ],
      },
      {
        audience: 'Corporate & SME Treasuries',
        headline: 'Optimize Idle Operational Cash',
        description: 'Put seasonal surplus cash to work in short-term liquid notes rather than leaving it idle in non-yielding operational accounts.',
        keyPoints: [
          'Short-term commercial notes and liquid money market assets',
          'Institutional reporting and audit-ready documentation',
          'Seamless liquidity redemption back to working capital',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Complete Investor Risk Profiling',
        description: 'Answer basic questions regarding your investment horizon, goals, and risk appetite.',
      },
      {
        step: '02',
        title: 'Explore Vetted Opportunities',
        description: 'Browse transparent asset listings detailing underlying assets, duration, and legal structures.',
      },
      {
        step: '03',
        title: 'Allocate Capital',
        description: 'Fund your chosen portfolio directly from your Beyond Financials primary account or savings reserves.',
      },
      {
        step: '04',
        title: 'Monitor & Reinvest',
        description: 'Track asset value in real time and automatically compound returns upon maturity.',
      },
    ],
    faqs: [
      {
        question: 'Are investment products currently active or trading?',
        answer:
          'No. Investment marketplace features represent Phase 2 strategic roadmap capabilities and are currently in conceptual design. No live investment opportunities or returns are currently offered.',
      },
      {
        question: 'Will Beyond Financials promise guaranteed investment returns?',
        answer:
          'No. All real investments carry market risk. Beyond Financials does not promise speculative or guaranteed returns. Products will carry clear risk disclosures in full compliance with capital market regulations.',
      },
      {
        question: 'Who will manage and originate the investment assets?',
        answer:
          'All future investment opportunities will be originated and managed by SEC-licensed asset managers, trustees, and authorized capital market operators in compliance with Nigerian securities law.',
      },
      {
        question: 'How do I get notified when investment features launch?',
        answer:
          'Join our Investment Interest List on the waitlist. You will receive exclusive early research reports and priority access invitations as regulatory clearances are finalized.',
      },
    ],
    relatedServiceSlugs: ['crypto', 'savings', 'banking'],
    disclaimer:
      'Investment products are part of our future strategic roadmap and will be offered in partnership with licensed asset managers upon regulatory approval. Past performance does not guarantee future results.',
  },
  {
    id: 'crypto',
    slug: 'crypto',
    title: 'Digital Assets & Cryptocurrency',
    tagline: 'Bridging Traditional Finance with Web3 Capital',
    shortDescription:
      'A secure, user-friendly gateway to buy, sell, store, and fund your Beyond Financials account using digital assets.',
    fullDescription:
      'Digital currencies and blockchain protocols are transforming cross-border value exchange. Beyond Financials Crypto is envisioned as an intuitive, regulatory-compliant bridge that enables users to manage digital assets alongside fiat accounts—making crypto accessible, secure, and practical for everyday utility.',
    category: 'Digital Assets',
    status: 'FUTURE',
    waitlistInterest: 'crypto_future',
    waitlistButtonText: 'Join the Crypto Interest List',
    metaTitle: 'Beyond Financials Crypto | Digital Asset Services Coming Soon',
    metaDescription:
      'Explore digital asset capabilities and multi-asset account integration with Beyond Financials. Secure crypto vision built for Africa and beyond.',
    canonicalPath: '/services/crypto',
    phase: 'Phase 2 Future Vision',
    features: [
      {
        title: 'Buy & Sell Digital Assets',
        description: 'Seamlessly convert between Nigerian Naira and major digital currencies (e.g. USDT, BTC, ETH) with transparent pricing.',
        tag: 'Future Scope',
      },
      {
        title: 'Multi-Asset Wallet Balances',
        description: 'Hold digital asset tokens securely alongside your fiat wallet balances in one integrated dashboard.',
        tag: 'Future Scope',
      },
      {
        title: 'Crypto Account Funding',
        description: 'Fund your Beyond Financials fiat account by depositing supported cryptocurrencies directly from external wallets.',
        tag: 'Future Scope',
      },
      {
        title: 'Instant Crypto-to-Fiat Conversion',
        description: 'Liquidate digital asset holdings into your primary wallet balance in real time for immediate bill payments or local transfers.',
        tag: 'Future Scope',
      },
      {
        title: 'Institutional Custody & Security',
        description: 'Multi-signature cold storage infrastructure and automated fraud anomaly detection to safeguard asset keys.',
        tag: 'Future Scope',
      },
      {
        title: 'Compliance & AML Screened Transfers',
        description: 'Strict on-chain transaction monitoring, address screening, and travel rule compliance to prevent illicit activities.',
        tag: 'Future Scope',
      },
    ],
    benefits: [
      {
        audience: 'Cross-Border Freelancers & Exporters',
        headline: 'Get Paid Globally Without Friction',
        description: 'Receive stablecoin remittances from global clients and instantly convert into local currency to pay bills and fund savings.',
        keyPoints: [
          'Instant deposit addresses for international client invoices',
          'Fast conversion into Naira wallet balances',
          'Eliminates exorbitant wire transfer delays and foreign fees',
        ],
      },
      {
        audience: 'Digital Asset Beginners',
        headline: 'Crypto Made Accessible and Safe',
        description: 'No intimidating technical jargon or complex private key risks. Enjoy a secure, guided interface that treats crypto with the ease of mobile banking.',
        keyPoints: [
          'Simple buy and sell interface with zero guesswork',
          'Clear explanations of transaction fees and confirmation times',
          'Protected by enterprise security and biometric verification',
        ],
      },
      {
        audience: 'Tech-Forward Businesses & Merchants',
        headline: 'Accept Multi-Currency Settlement',
        description: 'Broaden your customer base across borders by accepting digital asset settlements with instant local currency liquidation.',
        keyPoints: [
          'Multi-asset merchant invoice checkout links',
          'Automated conversion to mitigate crypto market volatility',
          'Consolidated ledger accounting with your fiat revenue',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Verify Advanced Identity Tier',
        description: 'Complete Tier 2/3 KYC verification and digital asset regulatory compliance checks.',
      },
      {
        step: '02',
        title: 'Access Multi-Asset Wallet',
        description: 'View your secure fiat and digital asset balances in one consolidated interface.',
      },
      {
        step: '03',
        title: 'Buy, Receive, or Deposit',
        description: 'Purchase crypto directly using your wallet balance or generate deposit addresses for incoming transfers.',
      },
      {
        step: '04',
        title: 'Convert & Spend Seamlessly',
        description: 'Swap between assets or liquidate to your primary wallet to pay bills, save, or transfer funds instantly.',
      },
    ],
    faqs: [
      {
        question: 'Are cryptocurrency services currently operational on Beyond Financials?',
        answer:
          'No. Digital asset and cryptocurrency capabilities are part of our Phase 2 future strategic roadmap. We do not currently connect live blockchain nodes or execute crypto transactions in this foundation release.',
      },
      {
        question: 'Does Beyond Financials show live or speculative crypto prices?',
        answer:
          'No. In compliance with strict transparency rules, we do not show live or fabricated crypto prices or volatile exchange tickers until regulatory licensing and provider partnerships are active.',
      },
      {
        question: 'Will Beyond Financials comply with SEC and CBN digital asset guidelines?',
        answer:
          'Yes. All future digital asset offerings will adhere strictly to Central Bank of Nigeria (CBN) banking guidelines, Securities and Exchange Commission (SEC) Virtual Asset Service Provider (VASP) regulations, and global AML/CFT standards.',
      },
      {
        question: 'How do I register interest for digital asset features?',
        answer:
          'Join our Crypto Interest List on the waitlist. You will be prioritized for early product updates, beta testing invitations, and regulatory rollout announcements.',
      },
    ],
    relatedServiceSlugs: ['banking', 'investments'],
    disclaimer:
      'Digital assets and cryptocurrency features are subject to evolving regulatory frameworks and partner licensing. Cryptocurrency trading involves market risk and is not covered by standard deposit insurance.',
  },
];

export const getServiceBySlug = (slug: string): ServiceDefinition | undefined => {
  return SERVICES_LIST.find((s) => s.slug === slug || s.id === slug);
};
