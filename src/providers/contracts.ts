/**
 * Beyond Financials - External Provider Adapter Interfaces
 * 
 * ARCHITECTURE PRINCIPLE:
 * External providers have NOT yet been finally selected.
 * The application MUST NOT be hard-coded around a single provider (e.g. Providus,
 * Paystack, Monnify, Smile Identity, Termii, etc.).
 * 
 * All interactions pass through these vendor-agnostic adapter interfaces.
 */

import { CurrencyCode, KYCTier } from '../types/domain';

export interface ProviderResult<T = unknown> {
  success: boolean;
  providerName: string;
  providerReference: string;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
  isMock: boolean;
}

/**
 * Banking & Core Ledger Integration Adapter
 */
export interface BankingProvider {
  name: string;
  isMock: boolean;
  createVirtualAccount(params: {
    userId: string;
    accountName: string;
    bvn?: string;
    currency: CurrencyCode;
  }): Promise<ProviderResult<{ accountNumber: string; bankName: string; accountReference: string }>>;

  initiateInterbankTransfer(params: {
    sourceAccount: string;
    destinationBankCode: string;
    destinationAccountNumber: string;
    destinationAccountName: string;
    amountKobo: number;
    narration: string;
    reference: string;
  }): Promise<ProviderResult<{ transferId: string; status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' }>>;

  queryAccountName(params: {
    bankCode: string;
    accountNumber: string;
  }): Promise<ProviderResult<{ accountName: string; isValid: boolean }>>;
}

/**
 * KYC & Identity Verification Adapter (BVN, NIN, Liveness)
 */
export interface KYCProvider {
  name: string;
  isMock: boolean;
  verifyBVN(params: {
    bvn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }): Promise<ProviderResult<{ verified: boolean; matchScore: number; verifiedTier: KYCTier }>>;

  verifyNIN(params: {
    nin: string;
    firstName: string;
    lastName: string;
  }): Promise<ProviderResult<{ verified: boolean; matchScore: number }>>;

  verifySelfieLiveness(params: {
    selfieImageBase64: string;
    bvnImageRef?: string;
  }): Promise<ProviderResult<{ livenessConfirmed: boolean; confidenceScore: number }>>;
}

/**
 * Payment & Merchant Acquiring Adapter
 */
export interface PaymentProvider {
  name: string;
  isMock: boolean;
  initializePayment(params: {
    amountKobo: number;
    currency: CurrencyCode;
    customerEmail: string;
    reference: string;
    callbackUrl?: string;
  }): Promise<ProviderResult<{ checkoutUrl: string; accessCode: string }>>;

  verifyTransaction(reference: string): Promise<ProviderResult<{
    verified: boolean;
    amountPaidKobo: number;
    paymentChannel: string;
  }>>;
}

/**
 * Utility, Airtime, Data & Bill Payments Adapter
 */
export interface BillPaymentProvider {
  name: string;
  isMock: boolean;
  purchaseAirtime(params: {
    operator: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
    phoneNumber: string;
    amountKobo: number;
    reference: string;
  }): Promise<ProviderResult<{ rechargeToken?: string; transactionStatus: string }>>;

  validateElectricityMeter(params: {
    discoCode: string;
    meterNumber: string;
    meterType: 'PREPAID' | 'POSTPAID';
  }): Promise<ProviderResult<{ customerName: string; address: string; isValid: boolean }>>;
}

/**
 * Notification Adapter (SMS, Email, In-app)
 */
export interface NotificationProvider {
  name: string;
  isMock: boolean;
  sendOTP(params: {
    recipient: string;
    code: string;
    channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  }): Promise<ProviderResult<{ deliveryStatus: string }>>;

  sendEmail(params: {
    to: string;
    subject: string;
    bodyHtml: string;
  }): Promise<ProviderResult<{ messageId: string }>>;
}

/**
 * Strategic Future Adapters (Draft Interfaces - Strictly not active in Phase 1)
 */
export interface CryptoProvider {
  name: string;
  isMock: boolean;
  getExchangeRate(pair: string): Promise<ProviderResult<{ rate: number; timestamp: string }>>;
}

export interface InvestmentProvider {
  name: string;
  isMock: boolean;
  listOfferings(): Promise<ProviderResult<Array<{ id: string; name: string; assetClass: string }>>>;
}
