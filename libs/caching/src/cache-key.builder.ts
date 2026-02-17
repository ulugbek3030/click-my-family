export class CacheKey {
  static tree(userId: string): string {
    return `family:tree:${userId}`;
  }

  static person(personId: string): string {
    return `family:person:${personId}`;
  }

  static privacy(personId: string, viewerUserId: string): string {
    return `privacy:${personId}:${viewerUserId}`;
  }

  static score(userId: string): string {
    return `gamification:score:${userId}`;
  }

  static levels(): string {
    return 'gamification:levels';
  }

  static transferSelection(userId: string): string {
    return `transfer:selection:${userId}`;
  }

  static transferLimit(userId: string): string {
    return `transfer:limit:${userId}`;
  }

  static unreadNotifications(userId: string): string {
    return `notification:unread:${userId}`;
  }

  static unreadCards(userId: string): string {
    return `cards:unread:${userId}`;
  }

  static cardTemplates(): string {
    return 'cards:templates:active';
  }

  static upcomingHolidays(): string {
    return 'admin:holidays:upcoming';
  }

  static rateLimit(userId: string, endpoint: string): string {
    return `ratelimit:${userId}:${endpoint}`;
  }
}
