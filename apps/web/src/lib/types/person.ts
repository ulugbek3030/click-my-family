export interface Person {
  id: string;
  ownerUserId: string;
  linkedUserId?: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  maidenName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  birthDatePrecision?: 'full' | 'year_only' | 'unknown';
  isAlive: boolean;
  deathDate?: string;
  deathDatePrecision?: 'full' | 'year_only' | 'unknown';
  phone?: string;
  addressText?: string;
  addressLat?: number;
  addressLng?: number;
  photoUrl?: string;
  socialLinks?: Record<string, string>;
  notes?: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonInput {
  firstName: string;
  lastName?: string;
  middleName?: string;
  maidenName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  birthDatePrecision?: 'full' | 'year_only' | 'unknown';
  isAlive?: boolean;
  deathDate?: string;
  deathDatePrecision?: 'full' | 'year_only' | 'unknown';
  phone?: string;
  addressText?: string;
  addressLat?: number;
  addressLng?: number;
  photoUrl?: string;
  socialLinks?: Record<string, string>;
  notes?: string;
}

export type UpdatePersonInput = Partial<CreatePersonInput>;
