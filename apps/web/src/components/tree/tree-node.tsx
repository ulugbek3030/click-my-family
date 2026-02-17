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

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

function getBirthLabel(birthDate: string | null, isAlive: boolean): string {
  if (!birthDate) return '';
  try {
    const year = new Date(birthDate).getFullYear();
    if (isNaN(year)) return '';
    return isAlive ? `р. ${year}` : `${year} — ...`;
  } catch {
    return '';
  }
}

export function TreeNodeComponent({ node, x, y, isSelected, onClick, onAddRelation }: TreeNodeProps) {
  const initials = `${node.firstName[0]}${node.lastName?.[0] || ''}`.toUpperCase();
  const isMale = node.gender === 'male';
  const isFemale = node.gender === 'female';
  const fullName = `${node.firstName} ${node.lastName || ''}`.trim();
  const birthLabel = getBirthLabel(node.birthDate, node.isAlive);

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer">
      {/* Card background */}
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={14}
        ry={14}
        className={cn(
          'fill-white stroke-2 transition-colors',
          isSelected ? 'stroke-primary' : 'stroke-border',
          !node.isAlive && 'opacity-70'
        )}
        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }}
        onClick={onClick}
      />
      {/* Avatar circle — left side */}
      <circle
        cx={36}
        cy={32}
        r={20}
        className={cn(
          isMale ? 'fill-blue-100 stroke-blue-300' : isFemale ? 'fill-pink-100 stroke-pink-300' : 'fill-gray-100 stroke-gray-300'
        )}
        strokeWidth={2}
        onClick={onClick}
      />
      <text
        x={36}
        y={37}
        textAnchor="middle"
        className={cn(
          'text-xs font-bold pointer-events-none',
          isMale ? 'fill-blue-700' : isFemale ? 'fill-pink-700' : 'fill-gray-600'
        )}
      >
        {initials}
      </text>
      {/* Name — right side */}
      <text
        x={66}
        y={birthLabel ? 28 : 35}
        textAnchor="start"
        className="text-xs font-semibold fill-foreground pointer-events-none"
      >
        {fullName.length > 18 ? fullName.slice(0, 17) + '…' : fullName}
      </text>
      {/* Birth date label */}
      {birthLabel && (
        <text
          x={66}
          y={44}
          textAnchor="start"
          className="text-[10px] fill-muted-foreground pointer-events-none"
        >
          {birthLabel}
        </text>
      )}
      {/* Add relation button — pill/tab shape at bottom center */}
      {onAddRelation && (
        <g
          onClick={(e) => { e.stopPropagation(); onAddRelation(node.id); }}
          className="cursor-pointer"
        >
          <rect
            x={NODE_WIDTH / 2 - 18}
            y={NODE_HEIGHT - 8}
            width={36}
            height={20}
            rx={10}
            ry={10}
            className="fill-primary"
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
          />
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT + 6}
            textAnchor="middle"
            className="text-sm font-bold fill-white pointer-events-none"
          >
            +
          </text>
        </g>
      )}
      {/* Status: deceased */}
      {!node.isAlive && (
        <text x={NODE_WIDTH - 16} y={16} className="text-[10px] fill-muted-foreground pointer-events-none">✝</text>
      )}
      {/* Status: unconfirmed */}
      {!node.isConfirmed && (
        <circle cx={NODE_WIDTH - 12} cy={12} r={4} className="fill-yellow-400 stroke-yellow-600" strokeWidth={1} />
      )}
    </g>
  );
}

export { NODE_WIDTH, NODE_HEIGHT };
