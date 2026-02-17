export interface FamilyTree {
  nodes: Record<string, TreeNode>;
  rootIds: string[];
}

export interface TreeNode {
  id: string;
  firstName: string;
  lastName: string | null;
  gender: string | null;
  birthDate: string | null;
  isAlive: boolean;
  isConfirmed: boolean;
  photoUrl: string | null;
  parents: string[];
  children: string[];
  partners: TreePartner[];
}

export interface TreePartner {
  personId: string;
  relationshipType: string;
  relationshipId: string;
}

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  node: TreeNode;
}

export interface PositionedLink {
  source: { x: number; y: number };
  target: { x: number; y: number };
  type: 'parent-child' | 'couple';
}
