'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TreePine, Users, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useI18n } from '@/lib/providers/i18n-provider';

const tabs = [
  { href: '/', icon: TreePine, labelKey: 'tree' as const },
  { href: '/persons', icon: Users, labelKey: 'persons' as const },
  { href: '/settings', icon: MoreHorizontal, labelKey: 'settings' as const },
];

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span>{t.nav[tab.labelKey]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
