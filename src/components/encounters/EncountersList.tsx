'use client';

import * as React from 'react';
import { EncounterCard } from './EncounterCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Plus } from 'lucide-react';
import type { PatientCareFormData, Shift } from '@/types';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

interface EncountersListProps {
  encounters: PatientCareFormData[];
  shifts: Map<string, Shift>;
  onRefresh?: () => void;
}

type FilterType = 'all' | 'drafts' | 'submitted';

export function EncountersList({ encounters, shifts, onRefresh }: EncountersListProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter encounters based on selected filter
  const filteredByStatus = React.useMemo(() => {
    if (filter === 'drafts') {
      return encounters.filter(e => e.isDraft);
    } else if (filter === 'submitted') {
      return encounters.filter(e => !e.isDraft);
    }
    return encounters;
  }, [encounters, filter]);

  // Further filter by search query
  const filteredEncounters = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredByStatus;
    }

    const query = searchQuery.toLowerCase();
    return filteredByStatus.filter(encounter => {
      const patientInfo = `${encounter.age} ${encounter.sex}`.toLowerCase();
      const complaints = (encounter.complaints || []).join(' ').toLowerCase();
      const impression = `${encounter.primaryImpressionCondition} ${encounter.secondaryImpressionCondition}`.toLowerCase();
      
      return patientInfo.includes(query) || complaints.includes(query) || impression.includes(query);
    });
  }, [filteredByStatus, searchQuery]);

  // Group encounters by shift
  const groupedEncounters = React.useMemo(() => {
    const groups: Map<string, PatientCareFormData[]> = new Map();
    
    filteredEncounters.forEach(encounter => {
      const shiftId = encounter.shiftId || 'unknown';
      if (!groups.has(shiftId)) {
        groups.set(shiftId, []);
      }
      groups.get(shiftId)!.push(encounter);
    });

    // Sort encounters within each group by encounter number or date
    groups.forEach((encounterList, shiftId) => {
      encounterList.sort((a, b) => {
        if (a.encounterNumber && b.encounterNumber) {
          return a.encounterNumber - b.encounterNumber;
        }
        // Fallback to date sorting
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    });

    return groups;
  }, [filteredEncounters]);

  const handleNewEncounter = () => {
    router.push('/patient-care-form');
  };

  const draftCount = encounters.filter(e => e.isDraft).length;
  const submittedCount = encounters.filter(e => !e.isDraft).length;

  if (encounters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Encounters Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          You haven't logged any patient encounters yet. Start by booking a shift and logging your first encounter.
        </p>
        <Button onClick={handleNewEncounter}>
          <Plus className="h-4 w-4 mr-2" />
          Log First Encounter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters and Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({encounters.length})
            </Button>
            <Button
              variant={filter === 'drafts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('drafts')}
            >
              Drafts ({draftCount})
            </Button>
            <Button
              variant={filter === 'submitted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('submitted')}
            >
              Submitted ({submittedCount})
            </Button>
          </div>
          <Button onClick={handleNewEncounter} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Encounter
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search encounters by patient info, complaints, or impression..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Encounters Grouped by Shift */}
      {filteredEncounters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No encounters match your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedEncounters.entries()).map(([shiftId, shiftEncounters]) => {
            const shift = shifts.get(shiftId);
            
            return (
              <div key={shiftId} className="space-y-3">
                {/* Shift Header */}
                <div className="border-l-4 border-primary pl-4 py-2">
                  {shift ? (
                    <>
                      <h3 className="font-semibold text-lg">{shift.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {format(parseISO(shift.date), 'PPP')}</span>
                        <span>🕐 {shift.startTime} - {shift.endTime}</span>
                        <span>📍 {shift.location}</span>
                        <Badge variant="outline">{shift.type}</Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg">Unknown Shift</h3>
                      <p className="text-sm text-muted-foreground">Shift details not available</p>
                    </>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {shiftEncounters.length} {shiftEncounters.length === 1 ? 'encounter' : 'encounters'}
                  </p>
                </div>

                {/* Encounter Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {shiftEncounters.map((encounter) => (
                    <EncounterCard
                      key={encounter.id}
                      encounter={encounter}
                      onDelete={onRefresh}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

