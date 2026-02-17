'use client';

import { usePersons } from '@/lib/hooks/use-persons';
import { useI18n } from '@/lib/providers/i18n-provider';
import { useAuth } from '@/lib/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TreePine, Plus, Key } from 'lucide-react';
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

export default function DashboardPage() {
  const { t } = useI18n();
  const { data: persons, isLoading } = usePersons();

  const totalPersons = persons?.length || 0;
  const confirmedPersons = persons?.filter((p) => p.isConfirmed).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
      </div>

      <AuthBanner />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalPersons}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{totalPersons}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.confirmed}</CardTitle>
            <Badge variant="secondary">{confirmedPersons}</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: totalPersons > 0 ? `${(confirmedPersons / totalPersons) * 100}%` : '0%' }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.dashboard.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/persons/new">
              <Plus className="h-4 w-4 mr-2" />
              {t.dashboard.addPerson}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tree">
              <TreePine className="h-4 w-4 mr-2" />
              {t.dashboard.viewTree}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
