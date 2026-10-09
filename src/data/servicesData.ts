/**
 * Beyond Financials - Public Services & Product Data Catalog
 * 
 * Strict Content Guidelines:
 * - No invented interest rates, minimum balances, withdrawal penalties, or returns.
 * - No invented loan limits, approval guarantees, or fee schedules.
 * - Customer benefit language only. No project scope, budget, or provider architecture.
 * - Future services must read as coming soon or planned, never as live.
 */

import { ServiceDefinition, ServiceStatusConfig, ServiceStatusType } from '../types/services';

export const SERVICE_STATUS_MAP: Record<ServiceStatusType, ServiceStatusConfig> = {
  AVAILABLE: {
    type: 'AVAILABLE',
    label: 'Available',
    badgeVariant: 'emerald',
    description: 'This service is open to customers.',
    isPhase1: true,
  },
  COMING_SOON: {
    type: 'COMING_SOON',
    label: 'Coming Soon',
    badgeVariant: 'amber',
    description: 'This service is being prepared and is not available yet.',
    isPhase1: true,
  },
  JOIN_WAITLIST: {
    type: 'JOIN_WAITLIST',
    label: 'Join the Waitlist',
    badgeVariant: 'blue',
    description: 'Register your interest and we will share updates as launch approaches.',
    isPhase1: true,
  },
  FUTURE: {
    type: 'FUTURE',
    label: 'Planned',
    badgeVariant: 'purple',
    description: 'This service is part of our longer vision and is not available yet.',
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
      'A planned home for your accounts, wallet, transfers, and a clear history of where your money goes.',
    fullDescription:
      'Digital banking on Beyond Financials is being designed as the centre of your financial life. When it opens, you will be able to hold an account, see your balance, move money, and look back at what you spent — in one place. It is not available yet.',
    category: 'Core Banking',
    status: 'COMING_SOON',
    waitlistInterest: 'digital_banking',
    waitlistButtonText: 'Join Banking Waitlist',
    metaTitle: 'Beyond Financials Banking | Digital Financial Services',
    metaDescription:
      'Digital accounts, wallets, and transfers from Beyond Financials. Coming soon for people and businesses in Nigeria. Join the waitlist.',
    canonicalPath: '/services/banking',
    phase: 'near_term',
    features: [
      {
        title: 'Dedicated Virtual Accounts',
        description: 'Receive personal and business deposits seamlessly through dedicated virtual account numbers mapped to your profile.',
        tag: 'Coming Soon',
      },
      {
        title: 'Transfers',
        description: 'Move money conveniently to other banks and wallets across Nigeria when transfers become available.',
        tag: 'Coming Soon',
      },
      {
        title: 'Unified Multi-Wallet Balance',
        description: 'Monitor your primary wallet, savings reserves, and transactional floats in one cohesive view without switching apps.',
        tag: 'Coming Soon',
      },
      {
        title: 'Transaction history',
        description: 'A clear record of money in and money out, with receipts you can keep for your own records.',
        tag: 'Coming Soon',
      },
      {
        title: 'Identity checks',
        description: 'We will confirm who you are before higher-value account features are opened. Exact requirements will be published at launch.',
        tag: 'Coming Soon',
      },
      {
        title: 'Protected access',
        description: 'Sign-in protections are being designed so your account stays private to you.',
        tag: 'Coming Soon',
      },
    ],
    benefits: [
      {
        audience: 'Everyday Consumers & Families',
        headline: 'Clear, Transparent Money Management',
        description: 'Keep daily money in and money out organised, with notifications when activity happens.',
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
        description: 'Confirm your identity before an account can be used. The exact checks will be explained when accounts open.',
      },
      {
        step: '03',
        title: 'Receive Dedicated Virtual Account',
        description: 'Get an account number so people and employers can pay you, once accounts are open.',
      },
      {
        step: '04',
        title: 'Transact Across the Ecosystem',
        description: 'Transfer money, automate savings, pay utility bills, or apply for credit from one unified interface.',
      },
    ],
    faqs: [
      {
        question: 'Is Beyond Financials a licensed bank?',
        answer:
          'No. Beyond Financials is not a bank, and we do not claim a banking licence. Account services are not available yet. Any future banking services will be offered only after the partnerships and approvals required for those services are in place.',
      },
      {
        question: 'When can I open an account?',
        answer:
          'Not yet. Join the waitlist and we will let you know when account opening begins. A waitlist place does not reserve an account number or guarantee access.',
      },
      {
        question: 'What will I need to open an account?',
        answer:
          'Identity checks will be required before an account can be used. The exact documents will be published before accounts open. This website will never ask for your BVN, NIN, or password on a public form.',
      },
      {
        question: 'Will I be able to send money to other banks?',
        answer:
          'That is the plan. Transfers are not live. When they open, they are intended to help you move money to banks and wallets across Nigeria.',
      },
    ],
    relatedServiceSlugs: ['savings', 'payments', 'loans'],
    disclaimer:
      'Digital banking is coming soon and is not available today. Beyond Financials is not a licensed bank. Future account services will be offered only with the approvals those services require.',
  },
  {
    id: 'savings',
    slug: 'savings',
    title: 'Disciplined & Goal Savings',
    tagline: 'Structured Tools to Build Sustainable Wealth',
    shortDescription:
      'Planned tools to set money aside for goals, emergencies, and longer plans — without invented rates or penalties.',
    fullDescription:
      'Saving is easier when the money you want to keep is separate from the money you spend. Beyond Financials Savings is being designed for flexible savings, goal savings, and planned set-asides. It is not open yet, and we will not publish interest rates until they are real.',
    category: 'Wealth & Savings',
    status: 'COMING_SOON',
    waitlistInterest: 'smart_savings',
    waitlistButtonText: 'Join Savings Waitlist',
    metaTitle: 'Beyond Financials Savings | Save Toward Your Goals',
    metaDescription:
      'Build long-term financial resilience with Beyond Financials Savings. Flexible savings, goal vaults, locked deposits, and scheduled auto-save.',
    canonicalPath: '/services/savings',
    phase: 'near_term',
    features: [
      {
        title: 'Flexible Savings Pocket',
        description: 'An easily accessible emergency buffer that allows you to deposit and withdraw funds whenever life happens.',
        tag: 'Coming Soon',
      },
      {
        title: 'Goal-Based Target Vaults',
        description: 'Create customized targets for rent, education, business startup capital, or travel with visual milestone tracking.',
        tag: 'Coming Soon',
      },
      {
        title: 'Locked Fixed Deposits',
        description: 'Commit funds for predetermined durations to avoid impulsive spending and build strict capital discipline.',
        tag: 'Coming Soon',
      },
      {
        title: 'Automated Scheduled Auto-Save',
        description: 'Set daily, weekly, or monthly recurring transfers from your main wallet into your dedicated savings targets.',
        tag: 'Coming Soon',
      },
      {
        title: 'A clear view of what you have saved',
        description: 'Designed so the money you set aside stays organised and separate from everyday spending.',
        tag: 'Coming Soon',
      },
      {
        title: 'Multi-Goal Progress Dashboard',
        description: 'Real-time percentage progress bars, timeline projections, and achievement badges to keep you motivated.',
        tag: 'Coming Soon',
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
        question: 'Will I be able to save money?',
        answer:
          'Yes, that is the plan. Flexible savings, goal savings, and scheduled set-asides are coming soon. They are not open yet, and we have not published interest rates, minimum balances, or withdrawal rules.',
      },
      {
        question: 'Are there minimum balance requirements or hidden charges?',
        answer:
          'We have not published minimum balances, fees, or interest rates. Those details will appear only when they are confirmed, before savings open.',
      },
      {
        question: 'Can I lock savings for a specific period?',
        answer:
          'Yes. Locked Savings are designed specifically to help users lock funds for chosen periods to cultivate strict financial discipline and prevent impulsive withdrawals.',
      },
      {
        question: 'How do I fund my savings account?',
        answer:
          'You will be able to move money into savings from your Beyond Financials account, once both services are available.',
      },
    ],
    relatedServiceSlugs: ['banking', 'investments', 'payments'],
    disclaimer:
      'Interest rates, minimum balances, and withdrawal rules are not published. Beyond Financials does not promise returns.',
  },
  {
    id: 'loans',
    slug: 'loans',
    title: 'Transparent Credit & Financing',
    tagline: 'Accessible Capital Tailored to Your Real Cash Flow',
    shortDescription:
      'Responsible financing for salary earners, civil servants, entrepreneurs, and households — not available yet.',
    fullDescription:
      'Loans on Beyond Financials are being designed around access, clear terms, and respectful treatment. Salary earners, civil servants, entrepreneurs, business owners, and consumers are the people we want to serve. Amounts, rates, and eligibility are not published because they are not confirmed. Join the loan interest list to hear when applications open.',
    category: 'Credit & Financing',
    status: 'COMING_SOON',
    waitlistInterest: 'personal_loans',
    waitlistButtonText: 'Join the Loan Interest List',
    metaTitle: 'Beyond Financials Loans | Flexible Financing Solutions',
    metaDescription:
      'Explore accessible financing options designed for salary earners, business owners, and personal needs with Beyond Financials. Join the loan interest list.',
    canonicalPath: '/services/loans',
    phase: 'near_term',
    features: [
      {
        title: 'Personal Cash Flow Financing',
        description: 'Manage planned life events, tuition payments, or urgent personal expenses with structured, predictable repayment schedules.',
        tag: 'Coming Soon',
      },
      {
        title: 'Salary-Linked Advance',
        description: 'Bridge mid-month cash crunches before payday with automated salary-linked credit facilities for verified employees.',
        tag: 'Coming Soon',
      },
      {
        title: 'SME Working Capital',
        description: 'Fuel retail inventory purchases, service equipment acquisition, and business expansion based on verified commercial turnover.',
        tag: 'Coming Soon',
      },
      {
        title: 'Emergency Safety Net Credit',
        description: 'Rapid-access emergency credit lines designed to handle critical medical or urgent household repairs with dignity.',
        tag: 'Coming Soon',
      },
      {
        title: 'Transparent Repayment Schedules',
        description: 'Clear breakdown of principal, tenor, and repayment dates before acceptance—no sudden surprises or hidden deductions.',
        tag: 'Coming Soon',
      },
      {
        title: 'Automated Direct Settlement',
        description: 'Approved loan amounts disburse directly into your Beyond Financials wallet with seamless scheduled debit repayments.',
        tag: 'Coming Soon',
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
          'Terms will be shown clearly before you accept any offer',
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
        question: 'Who are loans being designed for?',
        answer:
          'Salary earners, civil servants, entrepreneurs, business owners, and households. Eligibility rules are not published yet and will be shared only when lending opens. Joining the interest list does not mean you are approved.',
      },
      {
        question: 'Are loan limits and interest rates confirmed yet?',
        answer:
          'Specific interest rates, loan limits, tenors, and underwriting algorithms will be finalized in accordance with partner credit policies and regulatory requirements prior to public credit rollout.',
      },
      {
        question: 'Will you contact my friends or family about a loan?',
        answer:
          'No. We will not scrape your phone contacts or message people you know about your finances. Any future lending will be discussed with you directly.',
      },
      {
        question: 'How do I register interest in loans?',
        answer:
          'Join the loan interest list. We will contact you when lending is ready to open. That registration is not an application and not an approval.',
      },
    ],
    relatedServiceSlugs: ['banking', 'savings'],
    disclaimer:
      'Loans are coming soon. We do not publish rates, amounts, tenors, or approval times until they are confirmed, and we do not guarantee that an application will be approved.',
  },
  {
    id: 'payments',
    slug: 'payments',
    title: 'Everyday Utility & Bill Payments',
    tagline: 'Fast, Dependable Payments for Daily Living',
    shortDescription:
      'A planned place to buy airtime and data, pay electricity, renew cable TV, and settle other everyday bills.',
    fullDescription:
      'Everyday payments should be simple. Beyond Financials is preparing bill payments for airtime, mobile data, electricity, cable TV, internet, and selected government payments. These services are not live, and we will only show them as available when you can actually use them.',
    category: 'Everyday Payments',
    status: 'COMING_SOON',
    waitlistInterest: 'bill_payments',
    waitlistButtonText: 'Join Payments Waitlist',
    metaTitle: 'Beyond Financials Payments | Everyday Utility & Bill Payments',
    metaDescription:
      'Pay electricity, buy airtime, subscribe to internet and cable TV, and settle government fees with Beyond Financials. Instant digital receipts.',
    canonicalPath: '/services/payments',
    phase: 'near_term',
    features: [
      {
        title: 'Instant Airtime & Data Top-ups',
        description: 'Instant recharge for MTN, Airtel, Glo, and 9mobile with saved beneficiary numbers and automated repeat purchases.',
        tag: 'Coming Soon',
      },
      {
        title: 'Electricity Token Generation (DISCOs)',
        description: 'Purchase prepaid and postpaid power tokens for Ikeja, Eko, Abuja, Kano, Ibadan, Enugu, Port Harcourt, and other DISCOs.',
        tag: 'Coming Soon',
      },
      {
        title: 'Cable TV & Entertainment Subscriptions',
        description: 'Renew popular cable TV packages from the same place as your other money, when payments open.',
        tag: 'Coming Soon',
      },
      {
        title: 'Broadband & Fiber Internet',
        description: 'Renew Spectranet, Smile, Swift, and fibre broadband connections with one click directly from your balance.',
        tag: 'Coming Soon',
      },
      {
        title: 'Government & Tax Collections',
        description: 'Settle state and federal revenue fees, vehicle registrations, and municipal levies with verifiable government receipts.',
        tag: 'Coming Soon',
      },
      {
        title: 'Education & Examination Pin Purchases',
        description: 'Purchase WAEC, NECO, and JAMB registration pins and scratch cards securely without queueing.',
        tag: 'Coming Soon',
      },
    ],
    benefits: [
      {
        audience: 'Busy Households & Individuals',
        headline: 'Never Get Disconnected in the Dark',
        description: 'Pay for electricity and internet when you need them, once bill payments are available.',
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
        question: 'What if a payment does not complete?',
        answer:
          'Payments are not live yet. When they are, we intend to show a clear status for each payment and help you see whether it completed, so you are not left guessing.',
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
    phase: 'later',
    features: [
      {
        title: 'Curated Opportunity Marketplace',
        description: 'Explore vetted commercial paper, fixed income, real estate notes, and agriculture opportunities when regulatory frameworks permit.',
        tag: 'Planned',
      },
      {
        title: 'Unified Portfolio Tracker',
        description: 'Monitor all asset allocations, maturity schedules, and performance analytics from a single visual dashboard.',
        tag: 'Planned',
      },
      {
        title: 'Transparent Risk & Horizon Disclosures',
        description: 'Clear, unbiased risk ratings, underlying asset documentation, and maturity timelines for every investment product.',
        tag: 'Planned',
      },
      {
        title: 'Automated Dividend & Yield Reinvestment',
        description: 'Route matured yields and interest earnings back into your primary wallet or automatically compound them into new vaults.',
        tag: 'Planned',
      },
      {
        title: 'Fractional Asset Participation',
        description: 'Participate in high-value institutional grade opportunities through accessible minimum entry thresholds.',
        tag: 'Planned',
      },
      {
        title: 'Tax & Performance Reporting',
        description: 'Generate annual portfolio statements and realized yield reports for personal accounting and tax compliance.',
        tag: 'Planned',
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
          'No. Investments are planned for later and are not available. There are no live products, prices, or returns on this website.',
      },
      {
        question: 'Will Beyond Financials promise guaranteed investment returns?',
        answer:
          'No. Investments can lose money. Beyond Financials does not promise or guarantee returns. Any future product will explain its risks before you can invest.',
      },
      {
        question: 'Who will manage and originate the investment assets?',
        answer:
          'That has not been decided in public. Investment services will not be offered until the permissions those services require are in place. We do not name partners or claim approvals we do not have.',
      },
      {
        question: 'How do I get notified when investment features launch?',
        answer:
          'Join the investment interest list. We will tell you when there is something real to explore. Joining does not reserve a product or promise a return.',
      },
    ],
    relatedServiceSlugs: ['crypto', 'savings', 'banking'],
    disclaimer:
      'Investments are planned and are not available. We do not show products, performance, or promised returns.',
  },
  {
    id: 'crypto',
    slug: 'crypto',
    title: 'Digital Assets & Cryptocurrency',
    tagline: 'Digital assets, alongside your everyday money',
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
    phase: 'later',
    features: [
      {
        title: 'Buy & Sell Digital Assets',
        description: 'Seamlessly convert between Nigerian Naira and major digital currencies (e.g. USDT, BTC, ETH) with transparent pricing.',
        tag: 'Planned',
      },
      {
        title: 'Multi-Asset Wallet Balances',
        description: 'Hold digital asset tokens securely alongside your fiat wallet balances in one integrated dashboard.',
        tag: 'Planned',
      },
      {
        title: 'Crypto Account Funding',
        description: 'Fund your Beyond Financials fiat account by depositing supported cryptocurrencies directly from external wallets.',
        tag: 'Planned',
      },
      {
        title: 'Instant Crypto-to-Fiat Conversion',
        description: 'Liquidate digital asset holdings into your primary wallet balance in real time for immediate bill payments or local transfers.',
        tag: 'Planned',
      },
      {
        title: 'Careful safekeeping',
        description: 'Digital-asset features are being designed so holdings are protected and clearly separated from everyday spending money.',
        tag: 'Planned',
      },
      {
        title: 'Responsible use',
        description: 'Any future digital-asset service will include identity checks and monitoring appropriate to that service. Details will be published before it opens.',
        tag: 'Planned',
      },
    ],
    benefits: [
      {
        audience: 'Cross-Border Freelancers & Exporters',
        headline: 'Get Paid Globally Without Friction',
        description: 'A planned way for people paid from abroad to turn digital assets into money they can use locally.',
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
        description: 'A later option for businesses that want to accept digital assets and see the value in local money.',
        keyPoints: [
          'Multi-asset merchant invoice checkout links',
          'Automated conversion to mitigate crypto market volatility',
          'A single view of business money alongside your other Beyond Financials activity.',
        ],
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Verify Advanced Identity Tier',
        description: 'Confirm your identity before digital-asset features can be used. The checks will be explained before they are required.',
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
        description: 'Move between digital assets and everyday money to pay bills, save, or transfer, when the service exists.',
      },
    ],
    faqs: [
      {
        question: 'Are cryptocurrency services currently operational on Beyond Financials?',
        answer:
          'No. Cryptocurrency and digital-asset services are planned and are not operational. This website does not show prices, exchange rates, or trading activity.',
      },
      {
        question: 'Does Beyond Financials show live or speculative crypto prices?',
        answer:
          'No. This website does not show live prices, exchange rates, or trading activity. We will not display figures until a real service exists.',
      },
      {
        question: 'Will Beyond Financials support cryptocurrency?',
        answer:
          'That is part of the longer vision: buying and selling digital assets, and using them alongside everyday money. It is not available now, and we do not claim the licences or approvals those services would need.',
      },
      {
        question: 'How do I register interest for digital asset features?',
        answer:
          'Join the waitlist and choose digital assets as an interest. We will share updates when there is a real service to talk about.',
      },
    ],
    relatedServiceSlugs: ['banking', 'investments'],
    disclaimer:
      'Digital-asset services are planned and are not available. Buying and selling digital assets can lose money. We do not show prices or promise returns.',
  },
];

export const getServiceBySlug = (slug: string): ServiceDefinition | undefined => {
  return SERVICES_LIST.find((s) => s.slug === slug || s.id === slug);
};
