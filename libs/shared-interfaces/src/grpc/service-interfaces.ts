export interface PersonServiceInterface {
  create(data: unknown): Promise<unknown>;
  findById(data: { id: string }): Promise<unknown>;
  findByOwner(data: { ownerUserId: string }): Promise<unknown>;
  update(data: unknown): Promise<unknown>;
  delete(data: { id: string; userId: string }): Promise<void>;
  confirm(data: { personId: string; linkedUserId: string }): Promise<unknown>;
  search(data: { ownerUserId: string; query: string }): Promise<unknown[]>;
}

export interface PrivacyServiceInterface {
  getSettings(data: { personId: string }): Promise<unknown>;
  updateSettings(data: unknown): Promise<unknown>;
  filterFields(data: { person: unknown; viewerUserId: string }): Promise<unknown>;
}

export interface GamificationServiceInterface {
  getScore(data: { userId: string }): Promise<unknown>;
  getLevels(): Promise<unknown[]>;
  getHistory(data: { userId: string; limit?: number; offset?: number }): Promise<unknown[]>;
  upgradePremium(data: { userId: string }): Promise<unknown>;
}

export interface TransferServiceInterface {
  selectRelative(data: { userId: string; personId: string }): Promise<unknown>;
  executeTransfer(data: { userId: string; amount: number; receiverUserId: string }): Promise<unknown>;
  getSelection(data: { userId: string }): Promise<unknown>;
  getLimit(data: { userId: string }): Promise<unknown>;
}

export interface NotificationServiceInterface {
  getInApp(data: { userId: string; limit?: number; offset?: number }): Promise<unknown[]>;
  getUnreadCount(data: { userId: string }): Promise<{ count: number }>;
  markRead(data: { id: string; userId: string }): Promise<void>;
  markAllRead(data: { userId: string }): Promise<void>;
}

export interface CardsServiceInterface {
  getTemplates(): Promise<unknown[]>;
  sendCard(data: unknown): Promise<unknown>;
  getSent(data: { userId: string; limit?: number; offset?: number }): Promise<unknown[]>;
  getReceived(data: { userId: string; limit?: number; offset?: number }): Promise<unknown[]>;
}
