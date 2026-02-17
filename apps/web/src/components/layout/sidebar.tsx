'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TreePine, Users, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useI18n } from '@/lib/providers/i18n-provider';

const navItems = [
  { href: '/', icon: Home, labelKey: 'dashboard' as const },
  { href: '/tree', icon: TreePine, labelKey: 'tree' as const },
  { href: '/persons', icon: Users, labelKey: 'persons' as const },
  { href: '/notifications', icon: Bell, labelKey: 'notifications' as const },
  { href: '/settings', icon: Settings, labelKey: 'settings' as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-card h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Moya Oilam</h1>
        <p className="text-xs text-muted-foreground mt-1">CLICK Family</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t.nav[item.labelKey]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
