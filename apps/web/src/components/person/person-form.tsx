'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/providers/i18n-provider';
import type { CreatePersonInput, Person } from '@/lib/types/person';

const personSchema = z.object({
  firstName: z.string().min(1, 'Required').max(100),
  lastName: z.string().max(100).optional().or(z.literal('')),
  middleName: z.string().max(100).optional().or(z.literal('')),
  maidenName: z.string().max(100).optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional(),
  birthDate: z.string().optional().or(z.literal('')),
  isAlive: z.boolean().optional(),
  deathDate: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  addressText: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  defaultValues?: Partial<Person>;
  onSubmit: (data: CreatePersonInput) => void;
  isSubmitting?: boolean;
}

export function PersonForm({ defaultValues, onSubmit, isSubmitting }: PersonFormProps) {
  const { t } = useI18n();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      middleName: defaultValues?.middleName || '',
      maidenName: defaultValues?.maidenName || '',
      gender: defaultValues?.gender,
      birthDate: defaultValues?.birthDate?.split('T')[0] || '',
      isAlive: defaultValues?.isAlive ?? true,
      deathDate: defaultValues?.deathDate?.split('T')[0] || '',
      phone: defaultValues?.phone || '',
      addressText: defaultValues?.addressText || '',
      notes: defaultValues?.notes || '',
    },
  });

  const isAlive = watch('isAlive');

  const handleFormSubmit = (data: PersonFormData) => {
    const cleaned: CreatePersonInput = {
      firstName: data.firstName,
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.middleName && { middleName: data.middleName }),
      ...(data.maidenName && { maidenName: data.maidenName }),
      ...(data.gender && { gender: data.gender }),
      ...(data.birthDate && { birthDate: data.birthDate }),
      isAlive: data.isAlive,
      ...(data.deathDate && !data.isAlive && { deathDate: data.deathDate }),
      ...(data.phone && { phone: data.phone }),
      ...(data.addressText && { addressText: data.addressText }),
      ...(data.notes && { notes: data.notes }),
    };
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.person.firstName} & {t.person.lastName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">{t.person.firstName} *</Label>
              <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">{t.person.lastName}</Label>
              <Input id="lastName" {...register('lastName')} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="middleName">{t.person.middleName}</Label>
              <Input id="middleName" {...register('middleName')} />
            </div>
            <div>
              <Label htmlFor="maidenName">{t.person.maidenName}</Label>
              <Input id="maidenName" {...register('maidenName')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gender">{t.person.gender}</Label>
              <Select id="gender" {...register('gender')}>
                <option value="">—</option>
                <option value="male">{t.person.male}</option>
                <option value="female">{t.person.female}</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="birthDate">{t.person.birthDate}</Label>
              <Input id="birthDate" type="date" {...register('birthDate')} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isAlive')} className="rounded" />
              <span className="text-sm">{t.person.alive}</span>
            </label>
          </div>
          {!isAlive && (
            <div className="max-w-xs">
              <Label htmlFor="deathDate">{t.person.deceased}</Label>
              <Input id="deathDate" type="date" {...register('deathDate')} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">{t.person.phone}</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="+998..." />
            </div>
            <div>
              <Label htmlFor="addressText">{t.person.address}</Label>
              <Input id="addressText" {...register('addressText')} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">{t.person.notes}</Label>
            <textarea
              id="notes"
              {...register('notes')}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t.common.loading : t.common.save}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {t.common.cancel}
        </Button>
      </div>
    </form>
  );
}
