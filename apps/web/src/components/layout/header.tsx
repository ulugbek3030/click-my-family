'use client';

import { Bell, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useI18n } from '@/lib/providers/i18n-provider';
import { useUnreadCount } from '@/lib/hooks/use-notifications';
import { LOCALES } from '@/lib/i18n';

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const { data: unread } = useUnreadCount();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="lg:hidden">
          <h1 className="text-lg font-bold text-primary">Moya Oilam</h1>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === 'uz' ? 'ru' : 'uz')}
            className="gap-1 text-xs"
          >
            <Globe className="h-4 w-4" />
            {LOCALES.find((l) => l.value === locale)?.label}
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <a href="/notifications">
              <Bell className="h-5 w-5" />
              {unread?.count && unread.count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {unread.count > 99 ? '99+' : unread.count}
                </Badge>
              )}
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
