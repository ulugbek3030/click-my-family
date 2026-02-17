'use client';

import { useEffect, useRef, useCallback } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { useFamilyTree } from '@/lib/hooks/use-tree';
import { layoutTree } from '@/lib/utils/tree-layout';
import { TreeNodeComponent, NODE_WIDTH, NODE_HEIGHT } from './tree-node';
import { TreeControls } from './tree-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/lib/providers/i18n-provider';
import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { PositionedLink } from '@/lib/types/tree';

function LinkPath({ link }: { link: PositionedLink }) {
  if (link.type === 'couple') {
    return (
      <line
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
        stroke="#f472b6"
        strokeWidth={2}
        strokeDasharray="6,3"
      />
    );
  }

  // Parent-child: curved path
  const midY = (link.source.y + link.target.y) / 2;
  const d = `M ${link.source.x} ${link.source.y} C ${link.source.x} ${midY}, ${link.target.x} ${midY}, ${link.target.x} ${link.target.y}`;

  return (
    <path
      d={d}
      fill="none"
      stroke="#94a3b8"
      strokeWidth={2}
    />
  );
}

export function FamilyTreeView() {
  const { data: tree, isLoading } = useFamilyTree();
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null);

  const layout = tree ? layoutTree(tree) : null;

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = select(svgRef.current);
    const g = select(gRef.current);

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;

    // Initial fit to screen
    if (layout && layout.nodes.length > 0) {
      const svgEl = svgRef.current;
      const containerWidth = svgEl.clientWidth;
      const containerHeight = svgEl.clientHeight;
      const scale = Math.min(
        containerWidth / (layout.width + 100),
        containerHeight / (layout.height + 100),
        1
      );
      const tx = (containerWidth - layout.width * scale) / 2;
      const ty = (containerHeight - layout.height * scale) / 2;
      svg.call(zoomBehavior.transform, zoomIdentity.translate(tx, ty).scale(scale));
    }

    return () => {
      svg.on('.zoom', null);
    };
  }, [layout]);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current).call(zoomBehaviorRef.current.scaleBy, 1.3);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current).call(zoomBehaviorRef.current.scaleBy, 0.7);
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current || !layout) return;
    const svgEl = svgRef.current;
    const containerWidth = svgEl.clientWidth;
    const containerHeight = svgEl.clientHeight;
    const scale = Math.min(
      containerWidth / (layout.width + 100),
      containerHeight / (layout.height + 100),
      1
    );
    const tx = (containerWidth - layout.width * scale) / 2;
    const ty = (containerHeight - layout.height * scale) / 2;
    select(svgRef.current)
      .call(zoomBehaviorRef.current.transform, zoomIdentity.translate(tx, ty).scale(scale));
  }, [layout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Skeleton className="h-64 w-96 mx-auto" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!layout || layout.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <TreePine className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{t.tree.emptyTree}</p>
          <Button asChild>
            <Link href="/persons/new">{t.person.addNew}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-200px)] border rounded-lg bg-gray-50 overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: 'grab' }}
      >
        <g ref={gRef}>
          {/* Links */}
          {layout.links.map((link, i) => (
            <LinkPath key={i} link={link} />
          ))}
          {/* Nodes */}
          {layout.nodes.map((pNode) => (
            <TreeNodeComponent
              key={pNode.id}
              node={pNode.node}
              x={pNode.x}
              y={pNode.y}
            />
          ))}
        </g>
      </svg>
      <TreeControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onAddPerson={undefined}
      />
    </div>
  );
}
