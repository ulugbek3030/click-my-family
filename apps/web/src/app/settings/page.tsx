'use client';

import { useI18n } from '@/lib/providers/i18n-provider';
import { useAuth } from '@/lib/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOCALES } from '@/lib/i18n';
import { useState } from 'react';

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { token, setToken } = useAuth();
  const [newToken, setNewToken] = useState('');

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{t.nav.settings}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Language / Til</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {LOCALES.map((l) => (
            <Button
              key={l.value}
              variant={locale === l.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocale(l.value)}
            >
              {l.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.auth.devMode}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>JWT Token</Label>
            <p className="text-xs text-muted-foreground mb-2">
              {token ? `${token.substring(0, 30)}...` : t.auth.tokenRequired}
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t.auth.enterToken}
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" onClick={() => { setToken(newToken || null); setNewToken(''); }}>
              {t.auth.setToken}
            </Button>
          </div>
          {token && (
            <Button variant="destructive" size="sm" onClick={() => setToken(null)}>
              {t.common.delete} Token
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
