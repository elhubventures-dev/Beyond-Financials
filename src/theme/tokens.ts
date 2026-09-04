/**
 * Beyond Financials - Design System Tokens & Brand Standards
 * Theme: Geometric Balance
 * Domain: beyondfinancials.ng
 * 
 * Geometric Balance Brand Palette:
 * - Midnight Navy: #001B40 (Deep Anchor)
 * - Royal Blue: #0046AD (Trust & Primary Interactive)
 * - Geometric Gold / Yellow: #FBBF24 (Momentum & Focal Accent)
 * - Light Neutral Canvas: #F8FAFC / #FFFFFF (Clarity & Geometric Rhythm)
 * - Grounded Slate Grays: #1E293B, #64748B, #E2E8F0
 */

export const BRAND_TOKENS = {
  identity: {
    name: 'Beyond Financials',
    domain: 'beyondfinancials.ng',
    tagline: 'One financial relationship, multiple financial services.',
    market: 'Nigeria Nationwide (Future International)',
  },
  colors: {
    // Primary Royal & Midnight Blue Palette
    primary: {
      950: '#001B40', // Deep midnight navy
      900: '#06285A',
      800: '#00388A',
      700: '#0046AD', // Brand Royal Blue
      600: '#1A5FC4',
      500: '#2563EB',
      100: '#DBEAFE',
      50: '#EFF6FF',
    },
    // Accent Gold / Yellow Palette
    accent: {
      700: '#B45309',
      600: '#D97706',
      500: '#F59E0B',
      400: '#FBBF24', // Main Geometric Gold
      300: '#FCD34D',
      100: '#FEF3C7',
      50: '#FFFBEB',
    },
    // Neutral Slate Grays
    neutral: {
      950: '#001B40',
      900: '#0F172A',
      800: '#1E293B',
      700: '#334155',
      600: '#475569',
      500: '#64748B',
      400: '#94A3B8',
      300: '#CBD5E1',
      200: '#E2E8F0',
      100: '#F1F5F9',
      50: '#F8FAFC',
      white: '#FFFFFF',
    },
    // System Status Accents
    status: {
      success: '#10B981',
      warning: '#FBBF24',
      info: '#0046AD',
      danger: '#EF4444',
      phase1: '#0046AD',
      comingSoon: '#7C3AED',
      future: '#64748B',
    },
  },
  typography: {
    fontDisplay: 'Outfit, system-ui, sans-serif',
    fontBody: 'Plus Jakarta Sans, system-ui, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, monospace',
  },
  spacing: {
    containerMax: 'max-w-7xl',
    contentMax: 'max-w-5xl',
    readableMax: 'max-w-3xl',
  },
} as const;

export type ServiceStatus = 'AVAILABLE_PHASE1' | 'COMING_SOON' | 'WAITLIST' | 'FUTURE_ROADMAP';

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, { label: string; variant: 'blue' | 'amber' | 'slate' | 'purple' }> = {
  AVAILABLE_PHASE1: {
    label: 'Contracted Phase 1',
    variant: 'blue',
  },
  COMING_SOON: {
    label: 'Coming Soon',
    variant: 'amber',
  },
  WAITLIST: {
    label: 'Early Access Waitlist',
    variant: 'purple',
  },
  FUTURE_ROADMAP: {
    label: 'Future Strategic Scope',
    variant: 'slate',
  },
};
