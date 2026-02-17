import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_TRANSFER_LIMIT_TIYIN } from '@my-family/common';

export interface TransferRequest {
  fromUserId: string;
  toUserId: string;
  amount: number; // in tiyin
  description?: string;
}

export interface TransferResult {
  transactionId: string;
  status: 'completed' | 'failed';
  errorMessage?: string;
}

@Injectable()
export class ClickTransferClient {
  private readonly logger = new Logger(ClickTransferClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get('CLICK_CORE_BASE_URL', 'https://api.click.uz/core/v1');
    this.apiKey = this.config.get('CLICK_CORE_API_KEY', '');
  }

  async executeTransfer(request: TransferRequest): Promise<TransferResult> {
    try {
      // In production: HTTP call to CLICK core transfer API
      // POST ${this.baseUrl}/transfers
      this.logger.log(
        `Executing transfer: ${request.fromUserId} -> ${request.toUserId}, amount: ${request.amount}`,
      );

      // Placeholder for CLICK core integration
      return {
        transactionId: `click_txn_${Date.now()}`,
        status: 'completed',
      };
    } catch (error) {
      this.logger.error('Transfer execution failed', error);
      return {
        transactionId: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getTransferLimit(userId: string): Promise<number> {
    try {
      // In production: GET ${this.baseUrl}/users/${userId}/transfer-limit
      this.logger.debug(`Fetching transfer limit for user: ${userId}`);
      return DEFAULT_TRANSFER_LIMIT_TIYIN;
    } catch (error) {
      this.logger.error('Failed to fetch transfer limit', error);
      return DEFAULT_TRANSFER_LIMIT_TIYIN;
    }
  }
}
