import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { I18nProvider } from '@/lib/providers/i18n-provider';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'Moya Oilam — CLICK Family',
  description: 'Семейное дерево в экосистеме CLICK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <I18nProvider>
            <QueryProvider>
              <AppShell>{children}</AppShell>
            </QueryProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
