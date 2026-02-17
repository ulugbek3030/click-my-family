import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CacheService, CacheKey } from '@my-family/caching';

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

export interface FamilyTree {
  nodes: Record<string, TreeNode>;
  rootIds: string[];
}

@Injectable()
export class TreeService {
  private readonly logger = new Logger(TreeService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly cache: CacheService,
  ) {}

  async getFullTree(ownerUserId: string): Promise<FamilyTree> {
    const cached = await this.cache.get<FamilyTree>(CacheKey.tree(ownerUserId));
    if (cached) return cached;

    const tree = await this.buildTree(ownerUserId);
    await this.cache.set(CacheKey.tree(ownerUserId), tree, 300); // 5 min TTL
    return tree;
  }

  private async buildTree(ownerUserId: string): Promise<FamilyTree> {
    // Fetch all persons
    const persons = await this.dataSource.query(
      `SELECT id, first_name, last_name, gender, birth_date, is_alive,
              is_confirmed, photo_url
       FROM family_graph.person
       WHERE owner_user_id = $1 AND is_archived = false
       ORDER BY created_at ASC`,
      [ownerUserId],
    );

    // Fetch all parent-child links
    const parentChildren = await this.dataSource.query(
      `SELECT id, parent_id, child_id, relationship_type
       FROM family_graph.parent_child
       WHERE owner_user_id = $1`,
      [ownerUserId],
    );

    // Fetch all couple relationships
    const couples = await this.dataSource.query(
      `SELECT id, person_a_id, person_b_id, relationship_type
       FROM family_graph.couple_relationship
       WHERE owner_user_id = $1`,
      [ownerUserId],
    );

    // Build node map
    const nodes: Record<string, TreeNode> = {};
    const childSet = new Set<string>();

    for (const p of persons) {
      nodes[p.id] = {
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        gender: p.gender,
        birthDate: p.birth_date,
        isAlive: p.is_alive,
        isConfirmed: p.is_confirmed,
        photoUrl: p.photo_url,
        parents: [],
        children: [],
        partners: [],
      };
    }

    // Add parent-child links
    for (const pc of parentChildren) {
      if (nodes[pc.parent_id]) {
        nodes[pc.parent_id].children.push(pc.child_id);
      }
      if (nodes[pc.child_id]) {
        nodes[pc.child_id].parents.push(pc.parent_id);
        childSet.add(pc.child_id);
      }
    }

    // Add couple relationships
    for (const c of couples) {
      if (nodes[c.person_a_id]) {
        nodes[c.person_a_id].partners.push({
          personId: c.person_b_id,
          relationshipType: c.relationship_type,
          relationshipId: c.id,
        });
      }
      if (nodes[c.person_b_id]) {
        nodes[c.person_b_id].partners.push({
          personId: c.person_a_id,
          relationshipType: c.relationship_type,
          relationshipId: c.id,
        });
      }
    }

    // Root nodes = persons who have no parents
    const rootIds = Object.keys(nodes).filter((id) => !childSet.has(id));

    return { nodes, rootIds };
  }

  async getAncestors(ownerUserId: string, personId: string): Promise<TreeNode[]> {
    // Recursive CTE to find all ancestors
    const result = await this.dataSource.query(
      `WITH RECURSIVE ancestors AS (
        SELECT parent_id AS id, 1 AS depth
        FROM family_graph.parent_child
        WHERE child_id = $1 AND owner_user_id = $2

        UNION ALL

        SELECT pc.parent_id AS id, a.depth + 1
        FROM family_graph.parent_child pc
        JOIN ancestors a ON pc.child_id = a.id
        WHERE pc.owner_user_id = $2 AND a.depth < 20
      )
      SELECT DISTINCT p.id, p.first_name, p.last_name, p.gender,
             p.birth_date, p.is_alive, p.is_confirmed, p.photo_url
      FROM ancestors a
      JOIN family_graph.person p ON p.id = a.id
      WHERE p.is_archived = false
      ORDER BY p.birth_date ASC NULLS LAST`,
      [personId, ownerUserId],
    );

    return result.map(this.mapToTreeNode);
  }

  async getDescendants(ownerUserId: string, personId: string): Promise<TreeNode[]> {
    const result = await this.dataSource.query(
      `WITH RECURSIVE descendants AS (
        SELECT child_id AS id, 1 AS depth
        FROM family_graph.parent_child
        WHERE parent_id = $1 AND owner_user_id = $2

        UNION ALL

        SELECT pc.child_id AS id, d.depth + 1
        FROM family_graph.parent_child pc
        JOIN descendants d ON pc.parent_id = d.id
        WHERE pc.owner_user_id = $2 AND d.depth < 20
      )
      SELECT DISTINCT p.id, p.first_name, p.last_name, p.gender,
             p.birth_date, p.is_alive, p.is_confirmed, p.photo_url
      FROM descendants d
      JOIN family_graph.person p ON p.id = d.id
      WHERE p.is_archived = false
      ORDER BY p.birth_date ASC NULLS LAST`,
      [personId, ownerUserId],
    );

    return result.map(this.mapToTreeNode);
  }

  private mapToTreeNode(row: Record<string, unknown>): TreeNode {
    return {
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string | null,
      gender: row.gender as string | null,
      birthDate: row.birth_date as string | null,
      isAlive: row.is_alive as boolean,
      isConfirmed: row.is_confirmed as boolean,
      photoUrl: row.photo_url as string | null,
      parents: [],
      children: [],
      partners: [],
    };
  }
}
