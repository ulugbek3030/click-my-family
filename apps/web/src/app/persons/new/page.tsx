'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePerson } from '@/lib/hooks/use-persons';
import { useI18n } from '@/lib/providers/i18n-provider';
import { PersonForm } from '@/components/person/person-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewPersonPage() {
  const { t } = useI18n();
  const router = useRouter();
  const createPerson = useCreatePerson();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/persons"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold">{t.person.addNew}</h1>
      </div>
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <PersonForm
        onSubmit={async (data) => {
          try {
            setError(null);
            await createPerson.mutateAsync(data);
            router.push('/');
          } catch (err) {
            setError(err instanceof Error ? err.message : t.common.error);
          }
        }}
        isSubmitting={createPerson.isPending}
      />
    </div>
  );
}
