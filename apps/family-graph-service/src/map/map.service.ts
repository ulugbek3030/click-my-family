import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface MapPin {
  personId: string;
  firstName: string;
  lastName: string | null;
  addressText: string;
  lat: number;
  lng: number;
}

@Injectable()
export class MapService {
  private readonly logger = new Logger(MapService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getRelativesMap(ownerUserId: string): Promise<MapPin[]> {
    // Get persons with coordinates who have address sharing enabled
    const result = await this.dataSource.query(
      `SELECT p.id AS person_id, p.first_name, p.last_name,
              p.address_text, p.address_lat AS lat, p.address_lng AS lng
       FROM family_graph.person p
       LEFT JOIN privacy.privacy_settings ps ON ps.person_id = p.id AND ps.owner_user_id = p.owner_user_id
       WHERE p.owner_user_id = $1
         AND p.is_archived = false
         AND p.address_lat IS NOT NULL
         AND p.address_lng IS NOT NULL
         AND (p.owner_user_id = $1 OR COALESCE(ps.share_address, false) = true)
       ORDER BY p.first_name ASC`,
      [ownerUserId],
    );

    return result.map((row: Record<string, unknown>) => ({
      personId: row.person_id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string | null,
      addressText: row.address_text as string,
      lat: parseFloat(row.lat as string),
      lng: parseFloat(row.lng as string),
    }));
  }
}
