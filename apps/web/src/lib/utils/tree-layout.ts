import type { FamilyTree, TreeNode, PositionedNode, PositionedLink } from '../types/tree';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 80;
const COUPLE_GAP = 20;

interface LayoutResult {
  nodes: PositionedNode[];
  links: PositionedLink[];
  width: number;
  height: number;
}

export function layoutTree(tree: FamilyTree): LayoutResult {
  if (!tree || !tree.nodes || Object.keys(tree.nodes).length === 0) {
    return { nodes: [], links: [], width: 0, height: 0 };
  }

  const nodes = tree.nodes;
  const generations: Map<string, number> = new Map();
  const positioned: PositionedNode[] = [];
  const links: PositionedLink[] = [];

  // Step 1: Assign generations via BFS from roots
  const queue: { id: string; gen: number }[] = [];
  const visited = new Set<string>();

  // Start from roots (persons with no parents)
  const rootIds = tree.rootIds.length > 0
    ? tree.rootIds
    : Object.keys(nodes).filter(id => nodes[id].parents.length === 0);

  if (rootIds.length === 0 && Object.keys(nodes).length > 0) {
    // If no roots found, pick the first node
    rootIds.push(Object.keys(nodes)[0]);
  }

  for (const rootId of rootIds) {
    if (!visited.has(rootId)) {
      queue.push({ id: rootId, gen: 0 });
      visited.add(rootId);
    }
  }

  while (queue.length > 0) {
    const { id, gen } = queue.shift()!;
    const existing = generations.get(id);
    generations.set(id, existing !== undefined ? Math.max(existing, gen) : gen);

    const node = nodes[id];
    if (!node) continue;

    // Process children
    for (const childId of node.children) {
      if (!visited.has(childId)) {
        visited.add(childId);
        queue.push({ id: childId, gen: gen + 1 });
      }
    }

    // Process partners (same generation)
    for (const partner of node.partners) {
      if (!visited.has(partner.personId)) {
        visited.add(partner.personId);
        queue.push({ id: partner.personId, gen: gen });
      }
    }
  }

  // Handle unvisited nodes
  for (const id of Object.keys(nodes)) {
    if (!generations.has(id)) {
      generations.set(id, 0);
    }
  }

  // Step 2: Group by generation
  const genGroups: Map<number, string[]> = new Map();
  for (const [id, gen] of generations) {
    if (!genGroups.has(gen)) genGroups.set(gen, []);
    genGroups.get(gen)!.push(id);
  }

  // Step 3: Position nodes
  const maxGen = Math.max(...Array.from(genGroups.keys()), 0);

  for (let gen = 0; gen <= maxGen; gen++) {
    const ids = genGroups.get(gen) || [];
    const y = gen * (NODE_HEIGHT + VERTICAL_GAP) + 50;

    // Group couples together
    const placed = new Set<string>();
    let xOffset = 50;

    for (const id of ids) {
      if (placed.has(id)) continue;
      placed.add(id);

      const node = nodes[id];
      if (!node) continue;

      // Check if this node has a partner in the same generation
      const partnerInSameGen = node.partners.find(
        p => generations.get(p.personId) === gen && !placed.has(p.personId)
      );

      if (partnerInSameGen) {
        placed.add(partnerInSameGen.personId);
        // Place as couple
        positioned.push({ id, x: xOffset, y, node });
        const partnerNode = nodes[partnerInSameGen.personId];
        positioned.push({
          id: partnerInSameGen.personId,
          x: xOffset + NODE_WIDTH + COUPLE_GAP,
          y,
          node: partnerNode,
        });
        // Couple link
        links.push({
          source: { x: xOffset + NODE_WIDTH, y: y + NODE_HEIGHT / 2 },
          target: { x: xOffset + NODE_WIDTH + COUPLE_GAP, y: y + NODE_HEIGHT / 2 },
          type: 'couple',
        });
        xOffset += (NODE_WIDTH + COUPLE_GAP) * 2 + HORIZONTAL_GAP;
      } else {
        positioned.push({ id, x: xOffset, y, node });
        xOffset += NODE_WIDTH + HORIZONTAL_GAP;
      }
    }
  }

  // Step 4: Create parent-child links
  for (const pNode of positioned) {
    const node = nodes[pNode.id];
    if (!node) continue;

    for (const childId of node.children) {
      const childPos = positioned.find(n => n.id === childId);
      if (childPos) {
        links.push({
          source: { x: pNode.x + NODE_WIDTH / 2, y: pNode.y + NODE_HEIGHT },
          target: { x: childPos.x + NODE_WIDTH / 2, y: childPos.y },
          type: 'parent-child',
        });
      }
    }
  }

  const width = Math.max(...positioned.map(n => n.x + NODE_WIDTH), 0) + 100;
  const height = Math.max(...positioned.map(n => n.y + NODE_HEIGHT), 0) + 100;

  return { nodes: positioned, links, width, height };
}
