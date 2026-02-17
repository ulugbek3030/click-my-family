'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useI18n } from '@/lib/providers/i18n-provider';
import { useCreatePerson } from '@/lib/hooks/use-persons';
import { useCreateParentChild, useCreateCouple } from '@/lib/hooks/use-relationships';
import type { TreeNode } from '@/lib/types/tree';

type RelationType = 'parent' | 'child' | 'partner';

interface AddRelationshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceNode: TreeNode | null;
  existingPersons: TreeNode[];
}

export function AddRelationshipDialog({
  open,
  onOpenChange,
  sourceNode,
  existingPersons,
}: AddRelationshipDialogProps) {
  const { t } = useI18n();
  const createPerson = useCreatePerson();
  const createParentChild = useCreateParentChild();
  const createCouple = useCreateCouple();

  const [relationType, setRelationType] = useState<RelationType>('parent');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setRelationType('parent');
    setMode('new');
    setSelectedPersonId('');
    setFirstName('');
    setLastName('');
    setGender('');
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!sourceNode) return;
    setError(null);
    setIsSubmitting(true);

    try {
      let relatedPersonId = selectedPersonId;

      // Create new person if needed
      if (mode === 'new') {
        if (!firstName.trim()) {
          setError(t.common.error);
          setIsSubmitting(false);
          return;
        }
        const newPerson = await createPerson.mutateAsync({
          firstName: firstName.trim(),
          ...(lastName.trim() && { lastName: lastName.trim() }),
          ...(gender && { gender }),
        });
        relatedPersonId = newPerson.id;
      }

      if (!relatedPersonId) {
        setError(t.common.error);
        setIsSubmitting(false);
        return;
      }

      // Create relationship
      if (relationType === 'parent') {
        await createParentChild.mutateAsync({
          parentId: relatedPersonId,
          childId: sourceNode.id,
          relationshipType: 'biological',
        });
      } else if (relationType === 'child') {
        await createParentChild.mutateAsync({
          parentId: sourceNode.id,
          childId: relatedPersonId,
          relationshipType: 'biological',
        });
      } else if (relationType === 'partner') {
        await createCouple.mutateAsync({
          personAId: sourceNode.id,
          personBId: relatedPersonId,
          relationshipType: 'married',
        });
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
      setIsSubmitting(false);
    }
  };

  // Filter out the source node from existing persons list
  const availablePersons = existingPersons.filter((p) => p.id !== sourceNode?.id);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.person.addRelative}
            {sourceNode && (
              <span className="text-muted-foreground font-normal text-sm ml-2">
                ({sourceNode.firstName} {sourceNode.lastName || ''})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Relation type */}
          <div>
            <Label>{t.relationship.type}</Label>
            <Select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value as RelationType)}
            >
              <option value="parent">{t.person.addParent}</option>
              <option value="child">{t.person.addChild}</option>
              <option value="partner">{t.person.addPartner}</option>
            </Select>
          </div>

          {/* Mode: new or existing */}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === 'new' ? 'default' : 'outline'}
              onClick={() => setMode('new')}
              className="flex-1"
            >
              {t.common.add}
            </Button>
            {availablePersons.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant={mode === 'existing' ? 'default' : 'outline'}
                onClick={() => setMode('existing')}
                className="flex-1"
              >
                {t.common.search}
              </Button>
            )}
          </div>

          {mode === 'new' ? (
            <div className="space-y-3">
              <div>
                <Label>{t.person.firstName} *</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.person.firstName}
                />
              </div>
              <div>
                <Label>{t.person.lastName}</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.person.lastName}
                />
              </div>
              <div>
                <Label>{t.person.gender}</Label>
                <Select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female' | '')}>
                  <option value="">—</option>
                  <option value="male">{t.person.male}</option>
                  <option value="female">{t.person.female}</option>
                </Select>
              </div>
            </div>
          ) : (
            <div>
              <Label>{t.common.search}</Label>
              <Select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
              >
                <option value="">—</option>
                {availablePersons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName || ''}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? t.common.loading : t.common.save}
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              {t.common.cancel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
