'use client';

import { useI18n } from '@/lib/providers/i18n-provider';
import { FamilyTreeView } from '@/components/tree/family-tree-view';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.tree.title}</h1>
        <Button asChild size="sm">
          <Link href="/persons/new">
            <Plus className="h-4 w-4 mr-1" />
            {t.person.addNew}
          </Link>
        </Button>
      </div>
      <FamilyTreeView />
    </div>
  );
}
