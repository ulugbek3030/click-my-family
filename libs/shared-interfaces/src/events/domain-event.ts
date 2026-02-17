export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: string;
  timestamp: string;
  sourceService: string;
  payload: T;
}

export interface PersonCreatedEvent {
  personId: string;
  ownerUserId: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  birthDatePrecision: string;
}

export interface PersonConfirmedEvent {
  personId: string;
  ownerUserId: string;
  linkedUserId: string;
}

export interface PersonDeletedEvent {
  personId: string;
  ownerUserId: string;
  wasConfirmed: boolean;
}

export interface LevelChangedEvent {
  userId: string;
  oldLevel: number;
  newLevel: number;
  totalPoints: number;
}

export interface CardSentEvent {
  cardId: string;
  senderUserId: string;
  receiverUserId: string;
  templateId: string;
  personalMessage?: string;
}

export interface HolidayCreatedEvent {
  holidayId: string;
  titleUz: string;
  titleRu: string;
  holidayDate: string;
  targetAudience: string;
  notifyDaysBefore: number[];
}
