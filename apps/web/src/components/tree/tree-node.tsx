'use client';

import type { TreeNode as TreeNodeType } from '@/lib/types/tree';
import { cn } from '@/lib/utils/cn';

interface TreeNodeProps {
  node: TreeNodeType;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: () => void;
  onAddRelation?: (nodeId: string) => void;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 120;

export function TreeNodeComponent({ node, x, y, isSelected, onClick, onAddRelation }: TreeNodeProps) {
  const initials = `${node.firstName[0]}${node.lastName?.[0] || ''}`.toUpperCase();
  const isMale = node.gender === 'male';
  const isFemale = node.gender === 'female';

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer">
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={12}
        ry={12}
        className={cn(
          'fill-white stroke-2 transition-colors',
          isSelected ? 'stroke-primary' : 'stroke-border',
          !node.isAlive && 'opacity-70'
        )}
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}
        onClick={onClick}
      />
      {/* Avatar circle */}
      <circle
        cx={NODE_WIDTH / 2}
        cy={28}
        r={18}
        className={cn(
          isMale ? 'fill-blue-100 stroke-blue-300' : isFemale ? 'fill-pink-100 stroke-pink-300' : 'fill-gray-100 stroke-gray-300'
        )}
        strokeWidth={2}
        onClick={onClick}
      />
      <text
        x={NODE_WIDTH / 2}
        y={33}
        textAnchor="middle"
        className={cn(
          'text-xs font-bold pointer-events-none',
          isMale ? 'fill-blue-700' : isFemale ? 'fill-pink-700' : 'fill-gray-600'
        )}
      >
        {initials}
      </text>
      {/* Name */}
      <text
        x={NODE_WIDTH / 2}
        y={60}
        textAnchor="middle"
        className="text-xs font-medium fill-foreground pointer-events-none"
      >
        {node.firstName}
      </text>
      <text
        x={NODE_WIDTH / 2}
        y={74}
        textAnchor="middle"
        className="text-[10px] fill-muted-foreground pointer-events-none"
      >
        {node.lastName || ''}
      </text>
      {/* Add relation button */}
      {onAddRelation && (
        <g
          onClick={(e) => { e.stopPropagation(); onAddRelation(node.id); }}
          className="cursor-pointer"
        >
          <circle
            cx={NODE_WIDTH / 2}
            cy={NODE_HEIGHT - 10}
            r={12}
            className="fill-primary stroke-white"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          />
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT - 5}
            textAnchor="middle"
            className="text-sm font-bold fill-white pointer-events-none"
          >
            +
          </text>
        </g>
      )}
      {/* Status indicators */}
      {!node.isAlive && (
        <text x={NODE_WIDTH - 15} y={18} className="text-[10px] fill-muted-foreground pointer-events-none">✝</text>
      )}
      {!node.isConfirmed && (
        <circle cx={15} cy={12} r={5} className="fill-yellow-400 stroke-yellow-600" strokeWidth={1} />
      )}
    </g>
  );
}

export { NODE_WIDTH, NODE_HEIGHT };
