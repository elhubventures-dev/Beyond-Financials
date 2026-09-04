/**
 * Beyond Financials - Mock Provider Implementations
 * 
 * [MOCK / DEVELOPMENT ONLY]
 * CAUTION: These classes provide architecture test fixtures only.
 * They DO NOT connect to real banking rails, NIBSS, CBN, telecommunication telcos,
 * or payment switches. No real financial value or transactions occur here.
 */

import {
  BankingProvider,
  KYCProvider,
  PaymentProvider,
  BillPaymentProvider,
  NotificationProvider,
  ProviderResult,
} from '../contracts';
import { KYCTier } from '../../types/domain';

export class MockBankingProvider implements BankingProvider {
  public readonly name = 'MOCK_BANKING_ADAPTER_DEV_ONLY';
  public readonly isMock = true;

  async createVirtualAccount(params: {
    userId: string;
    accountName: string;
  }): Promise<ProviderResult<{ accountNumber: string; bankName: string; accountReference: string }>> {
    console.warn('[MOCK / DEV ONLY] MockBankingProvider.createVirtualAccount invoked.');
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-VA-${Date.now()}`,
      isMock: true,
      data: {
        accountNumber: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        bankName: 'Beyond Sandbox Reserve Bank (MOCK)',
        accountReference: `REF-VA-${params.userId.slice(0, 8)}`,
      },
    };
  }

  async initiateInterbankTransfer(params: {
    amountKobo: number;
    destinationAccountNumber: string;
  }): Promise<ProviderResult<{ transferId: string; status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' }>> {
    console.warn('[MOCK / DEV ONLY] MockBankingProvider.initiateInterbankTransfer invoked.');
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-TRX-${Date.now()}`,
      isMock: true,
      data: {
        transferId: `TRX-${Date.now()}`,
        status: 'SUCCESSFUL',
      },
    };
  }

  async queryAccountName(params: {
    bankCode: string;
    accountNumber: string;
  }): Promise<ProviderResult<{ accountName: string; isValid: boolean }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-LOOKUP-${Date.now()}`,
      isMock: true,
      data: {
        accountName: 'DEMO CUSTOMER (MOCK VERIFICATION)',
        isValid: true,
      },
    };
  }
}

export class MockKYCProvider implements KYCProvider {
  public readonly name = 'MOCK_KYC_ADAPTER_DEV_ONLY';
  public readonly isMock = true;

  async verifyBVN(params: {
    bvn: string;
    firstName: string;
    lastName: string;
  }): Promise<ProviderResult<{ verified: boolean; matchScore: number; verifiedTier: KYCTier }>> {
    console.warn('[MOCK / DEV ONLY] MockKYCProvider.verifyBVN invoked.');
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-BVN-${Date.now()}`,
      isMock: true,
      data: {
        verified: true,
        matchScore: 98.5,
        verifiedTier: KYCTier.TIER_2_VERIFIED,
      },
    };
  }

  async verifyNIN(params: { nin: string }): Promise<ProviderResult<{ verified: boolean; matchScore: number }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-NIN-${Date.now()}`,
      isMock: true,
      data: {
        verified: true,
        matchScore: 99.0,
      },
    };
  }

  async verifySelfieLiveness(): Promise<ProviderResult<{ livenessConfirmed: boolean; confidenceScore: number }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-LIVENESS-${Date.now()}`,
      isMock: true,
      data: {
        livenessConfirmed: true,
        confidenceScore: 0.99,
      },
    };
  }
}

export class MockPaymentProvider implements PaymentProvider {
  public readonly name = 'MOCK_PAYMENT_GATEWAY_DEV_ONLY';
  public readonly isMock = true;

  async initializePayment(params: {
    amountKobo: number;
    reference: string;
  }): Promise<ProviderResult<{ checkoutUrl: string; accessCode: string }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-PAY-${Date.now()}`,
      isMock: true,
      data: {
        checkoutUrl: `https://beyondfinancials.ng/mock-checkout?ref=${params.reference}`,
        accessCode: `MOCK_ACCESS_${Date.now()}`,
      },
    };
  }

  async verifyTransaction(reference: string): Promise<ProviderResult<{
    verified: boolean;
    amountPaidKobo: number;
    paymentChannel: string;
  }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-VERIFY-${reference}`,
      isMock: true,
      data: {
        verified: true,
        amountPaidKobo: 500000,
        paymentChannel: 'CARD_MOCK',
      },
    };
  }
}

export class MockBillPaymentProvider implements BillPaymentProvider {
  public readonly name = 'MOCK_BILLS_ADAPTER_DEV_ONLY';
  public readonly isMock = true;

  async purchaseAirtime(params: {
    operator: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
    phoneNumber: string;
    amountKobo: number;
  }): Promise<ProviderResult<{ rechargeToken?: string; transactionStatus: string }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-AIRTIME-${Date.now()}`,
      isMock: true,
      data: {
        rechargeToken: 'MOCK-TOKEN-998811',
        transactionStatus: 'DELIVERED_MOCK',
      },
    };
  }

  async validateElectricityMeter(): Promise<ProviderResult<{ customerName: string; address: string; isValid: boolean }>> {
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-METER-${Date.now()}`,
      isMock: true,
      data: {
        customerName: 'BEYOND DEMO PROPERTY (MOCK)',
        address: '10 Financial District, Victoria Island, Lagos',
        isValid: true,
      },
    };
  }
}

export class MockNotificationProvider implements NotificationProvider {
  public readonly name = 'MOCK_NOTIFICATION_ADAPTER_DEV_ONLY';
  public readonly isMock = true;

  async sendOTP(params: { recipient: string; code: string }): Promise<ProviderResult<{ deliveryStatus: string }>> {
    console.info(`[MOCK NOTIFICATION] OTP for ${params.recipient}: ${params.code}`);
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-OTP-${Date.now()}`,
      isMock: true,
      data: { deliveryStatus: 'SENT_MOCK' },
    };
  }

  async sendEmail(params: { to: string; subject: string }): Promise<ProviderResult<{ messageId: string }>> {
    console.info(`[MOCK EMAIL] To: ${params.to} | Subject: ${params.subject}`);
    return {
      success: true,
      providerName: this.name,
      providerReference: `MOCK-MAIL-${Date.now()}`,
      isMock: true,
      data: { messageId: `msg_${Date.now()}` },
    };
  }
}
