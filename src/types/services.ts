/**
 * Beyond Financials - Public Service Domain Types & Metadata
 * 
 * Supports public product information architecture, reusable status representations,
 * feature catalogs, target audience segmentations, and waitlist routing.
 */

import { ReactNode } from 'react';
import { WaitlistInterestCategory } from './domain';

export type ServiceStatusType = 'AVAILABLE' | 'COMING_SOON' | 'JOIN_WAITLIST' | 'FUTURE';

export interface ServiceStatusConfig {
  type: ServiceStatusType;
  label: string;
  badgeVariant: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  description: string;
  isPhase1: boolean;
}

export interface ServiceFeatureItem {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export interface ServiceAudienceBenefit {
  audience: string;
  headline: string;
  description: string;
  keyPoints: string[];
}

export interface ServiceWorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Core Banking' | 'Wealth & Savings' | 'Credit & Financing' | 'Everyday Payments' | 'Capital & Markets' | 'Digital Assets';
  status: ServiceStatusType;
  waitlistInterest: WaitlistInterestCategory;
  waitlistButtonText: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  phase: 'Phase 1 Contracted' | 'Phase 2 Future Vision';
  features: ServiceFeatureItem[];
  benefits: ServiceAudienceBenefit[];
  workflow: ServiceWorkflowStep[];
  faqs: ServiceFAQItem[];
  relatedServiceSlugs: string[];
  disclaimer?: string;
}
