// RabbitMQ Exchange Names
export const FAMILY_EVENTS_EXCHANGE = 'family.events';
export const GAMIFICATION_EVENTS_EXCHANGE = 'gamification.events';
export const CARDS_EVENTS_EXCHANGE = 'cards.events';
export const ADMIN_EVENTS_EXCHANGE = 'admin.events';
export const DEAD_LETTER_EXCHANGE = 'family.dlx';

// Event Types
export const FAMILY_EVENTS = {
  PERSON_CREATED: 'family.person.created',
  PERSON_UPDATED: 'family.person.updated',
  PERSON_CONFIRMED: 'family.person.confirmed',
  PERSON_DELETED: 'family.person.deleted',
  PERSON_ARCHIVED: 'family.person.archived',
  RELATIONSHIP_CREATED: 'family.relationship.created',
  RELATIONSHIP_DELETED: 'family.relationship.deleted',
  CHANGE_REQUEST_CREATED: 'family.changerequest.created',
  CHANGE_REQUEST_APPROVED: 'family.changerequest.approved',
  CHANGE_REQUEST_REJECTED: 'family.changerequest.rejected',
} as const;

export const GAMIFICATION_EVENTS = {
  LEVEL_CHANGED: 'gamification.level.changed',
  POINTS_CHANGED: 'gamification.points.changed',
  PREMIUM_PURCHASED: 'gamification.premium.purchased',
} as const;

export const CARDS_EVENTS = {
  CARD_SENT: 'cards.card.sent',
  CARD_READ: 'cards.card.read',
} as const;

export const ADMIN_EVENTS = {
  HOLIDAY_CREATED: 'admin.holiday.created',
  HOLIDAY_UPDATED: 'admin.holiday.updated',
  HOLIDAY_DELETED: 'admin.holiday.deleted',
} as const;

// Queue Names
export const QUEUES = {
  GAMIFICATION_FAMILY_EVENTS: 'gamification.family.events',
  NOTIFICATION_FAMILY_EVENTS: 'notification.family.events',
  NOTIFICATION_CARDS_EVENTS: 'notification.cards.events',
  NOTIFICATION_ADMIN_EVENTS: 'notification.admin.events',
  TRANSFER_FAMILY_EVENTS: 'transfer.family.events',
  TRANSFER_GAMIFICATION_EVENTS: 'transfer.gamification.events',
  DEAD_LETTERS: 'family.dead-letters',
} as const;
