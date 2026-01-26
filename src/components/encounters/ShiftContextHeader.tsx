'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Lock } from 'lucide-react';
import type { Shift } from '@/types';
import { format, parseISO } from 'date-fns';

interface ShiftContextHeaderProps {
  shift: Shift;
  instructorName?: string;
  isLocked?: boolean;
}

export function ShiftContextHeader({ shift, instructorName, isLocked = false }: ShiftContextHeaderProps) {
  const shiftDate = parseISO(shift.date);

  return (
    <Card className="bg-muted/50 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold">{shift.title}</h3>
              <Badge variant="outline">{shift.type}</Badge>
              {isLocked && (
                <Badge variant="secondary" className="bg-muted">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(shiftDate, 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{shift.startTime} - {shift.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{shift.location}</span>
              </div>
              {instructorName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Instructor: {instructorName}</span>
                </div>
              )}
            </div>

            {shift.notes && (
              <p className="text-sm text-muted-foreground mt-3 border-t pt-3">
                <span className="font-medium">Notes:</span> {shift.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

