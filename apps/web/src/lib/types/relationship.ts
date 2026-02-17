export interface CreateCoupleRelationshipInput {
  personAId: string;
  personBId: string;
  relationshipType: 'couple' | 'civil_union' | 'married' | 'divorced' | 'widowed';
  startDate?: string;
  startDatePrecision?: 'full' | 'year_only' | 'unknown';
  endDate?: string;
  endDatePrecision?: 'full' | 'year_only' | 'unknown';
  marriagePlace?: string;
}

export interface CreateParentChildInput {
  parentId: string;
  childId: string;
  relationshipType: 'biological' | 'adoption' | 'guardianship' | 'foster';
}
