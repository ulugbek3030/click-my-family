'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { usePerson, useUpdatePerson, useDeletePerson } from '@/lib/hooks/use-persons';
import { useI18n } from '@/lib/providers/i18n-provider';
import { PersonForm } from '@/components/person/person-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useI18n();
  const router = useRouter();
  const { data: person, isLoading } = usePerson(id);
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t.common.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/persons"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">{person.firstName} {person.lastName || ''}</h1>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            if (confirm(t.common.confirm + '?')) {
              await deletePerson.mutateAsync(id);
              router.push('/persons');
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t.common.delete}
        </Button>
      </div>
      <PersonForm
        defaultValues={person}
        onSubmit={async (data) => {
          await updatePerson.mutateAsync({ id, data });
          router.push('/persons');
        }}
        isSubmitting={updatePerson.isPending}
      />
    </div>
  );
}
