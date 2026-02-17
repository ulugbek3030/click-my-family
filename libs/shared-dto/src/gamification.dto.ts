export class UserScoreResponseDto {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  levelName: string;
  relativesAdded: number;
  relativesConfirmed: number;
  maxRelatives: number;
  isPremium: boolean;
  nextLevelPoints?: number;
}

export class LevelDefinitionDto {
  level: number;
  minPoints: number;
  nameUz: string;
  nameRu: string;
  iconUrl?: string;
  benefits: Record<string, unknown>;
}

export class PointsHistoryItemDto {
  id: string;
  pointsDelta: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}
