'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePersons, usePersonSearch } from '@/lib/hooks/use-persons';
import { useI18n } from '@/lib/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Users } from 'lucide-react';
import { formatDate, getAge } from '@/lib/utils/date';
import type { Person } from '@/lib/types/person';

function PersonItem({ person }: { person: Person }) {
  const { t, locale } = useI18n();
  const age = getAge(person.birthDate, person.isAlive);
  const initials = `${person.firstName[0]}${person.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Link href={`/persons/${person.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            {person.photoUrl && <AvatarImage src={person.photoUrl} alt={person.firstName} />}
            <AvatarFallback className={person.gender === 'male' ? 'bg-blue-100 text-blue-700' : person.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100'}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">
                {person.firstName} {person.lastName || ''}
              </p>
              {person.isConfirmed && <Badge variant="secondary" className="text-xs">{t.person.confirmed}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {person.birthDate && formatDate(person.birthDate, locale)}
              {age && ` (${age})`}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {person.gender === 'male' ? '♂' : person.gender === 'female' ? '♀' : ''}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function PersonsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const { data: allPersons, isLoading: loadingAll } = usePersons();
  const { data: searchResults, isLoading: loadingSearch } = usePersonSearch(search);

  const persons = search.length > 0 ? searchResults : allPersons;
  const isLoading = search.length > 0 ? loadingSearch : loadingAll;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.person.title}</h1>
        <Button asChild>
          <Link href="/persons/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.person.addNew}
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.person.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : persons && persons.length > 0 ? (
          persons.map((person) => <PersonItem key={person.id} person={person} />)
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t.common.noData}</p>
            <Button asChild className="mt-4">
              <Link href="/persons/new">{t.person.addNew}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
