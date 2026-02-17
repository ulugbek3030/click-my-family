'use client';

import { useI18n } from '@/lib/providers/i18n-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.nav.notifications}</h1>
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t.common.noData}</p>
        </CardContent>
      </Card>
    </div>
  );
}
