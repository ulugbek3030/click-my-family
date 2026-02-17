'use client';

import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Plus } from 'lucide-react';
import { useI18n } from '@/lib/providers/i18n-provider';

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onAddPerson?: () => void;
}

export function TreeControls({ onZoomIn, onZoomOut, onFitToScreen, onAddPerson }: TreeControlsProps) {
  const { t } = useI18n();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      {onAddPerson && (
        <Button size="icon" onClick={onAddPerson} title={t.person.addNew}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={onZoomIn} title={t.tree.zoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomOut} title={t.tree.zoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onFitToScreen} title={t.tree.fitToScreen}>
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
