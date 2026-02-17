import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PaymentRequest {
  userId: string;
  amount: number; // in tiyin
  description: string;
  referenceType?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  paymentId: string;
  status: 'completed' | 'failed' | 'pending';
  errorMessage?: string;
}

@Injectable()
export class ClickPaymentClient {
  private readonly logger = new Logger(ClickPaymentClient.name);
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get('CLICK_CORE_BASE_URL', 'https://api.click.uz/core/v1');
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // In production: POST ${this.baseUrl}/payments
      this.logger.log(`Processing payment for user: ${request.userId}, amount: ${request.amount}`);

      return {
        paymentId: `click_pay_${Date.now()}`,
        status: 'completed',
      };
    } catch (error) {
      this.logger.error('Payment processing failed', error);
      return {
        paymentId: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
