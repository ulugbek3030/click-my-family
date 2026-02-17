import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface AuditLogEntry {
  userId: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'RESTORE';
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private dataSource: DataSource | null = null;
  private schema = 'family_graph';

  setDataSource(dataSource: DataSource, schema?: string): void {
    this.dataSource = dataSource;
    if (schema) this.schema = schema;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    if (!this.dataSource) {
      this.logger.warn('DataSource not set for AuditService');
      return;
    }

    try {
      await this.dataSource.query(
        `INSERT INTO ${this.schema}.audit_log
         (user_id, entity_type, entity_id, action, old_data, new_data, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          entry.userId,
          entry.entityType,
          entry.entityId,
          entry.action,
          entry.oldData ? JSON.stringify(entry.oldData) : null,
          entry.newData ? JSON.stringify(entry.newData) : null,
          entry.ipAddress || null,
          entry.userAgent || null,
        ],
      );
    } catch (error) {
      this.logger.error('Failed to write audit log', error);
    }
  }
}
