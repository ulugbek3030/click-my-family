'use client';

import { useI18n } from '@/lib/providers/i18n-provider';
import { useAuth } from '@/lib/providers/auth-provider';
import { FamilyTreeView } from '@/components/tree/family-tree-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Key } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function AuthBanner() {
  const { token, setToken } = useAuth();
  const { t } = useI18n();
  const [inputToken, setInputToken] = useState('');

  if (token) return null;

  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">{t.auth.devMode}: {t.auth.tokenRequired}</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={t.auth.enterToken}
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="text-xs"
          />
          <Button size="sm" onClick={() => { setToken(inputToken); setInputToken(''); }}>
            {t.auth.setToken}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <AuthBanner />
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
