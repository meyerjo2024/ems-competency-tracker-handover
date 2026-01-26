'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Users, FileText, Plus, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import { getShiftsForInstructor } from '@/actions/shiftActions';
import { getPendingReviewsCount } from '@/actions/bookingActions';
import type { Shift } from '@/types';
import { format, parseISO, isFuture, isToday } from 'date-fns';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

function InstructorDashboardContent() {
  const { currentUser } = useAuth();
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalShifts: 0,
    upcomingShifts: 0,
    activeStudents: 0,
    pendingReviews: 0,
  });

  React.useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch instructor's shifts (returns array directly)
        const instructorShifts = await getShiftsForInstructor(currentUser.id);
        setShifts(instructorShifts);

        // Calculate upcoming shifts
        const upcoming = instructorShifts.filter(shift => {
          const shiftDate = parseISO(shift.date);
          return isToday(shiftDate) || isFuture(shiftDate);
        });

        // Fetch pending reviews count
        const pendingCount = await getPendingReviewsCount(currentUser.id);

        // Calculate unique students across all shifts
        // This is a simplified count - in reality we'd fetch bookings for each shift
        const uniqueStudents = new Set<string>();
        
        setStats({
          totalShifts: instructorShifts.length,
          upcomingShifts: upcoming.length,
          activeStudents: uniqueStudents.size, // Will be 0 for now
          pendingReviews: pendingCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const upcomingShifts = shifts
    .filter(shift => {
      const shiftDate = parseISO(shift.date);
      return isToday(shiftDate) || isFuture(shiftDate);
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your shifts and monitor student progress
          </p>
        </div>
        <Button asChild>
          <Link href="/shifts">
            <Plus className="h-4 w-4 mr-2" />
            Create Shift
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingShifts} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all shifts
            </p>
          </CardContent>
        </Card>

        <Card className={stats.pendingReviews > 0 ? "border-yellow-300 bg-yellow-50/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            {stats.pendingReviews > 0 ? (
              <Clock className="h-4 w-4 text-yellow-600" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.pendingReviews > 0 ? 'text-yellow-700' : ''}`}>
              {stats.pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReviews === 1 ? 'Shift' : 'Shifts'} awaiting feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shifts</CardTitle>
          <CardDescription>
            Your scheduled shifts for the coming days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming shifts scheduled</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/shifts">Create Your First Shift</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShifts.map((shift) => {
                const shiftDate = parseISO(shift.date);
                const isNow = isToday(shiftDate);

                return (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{shift.title}</h3>
                        {isNow && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(shiftDate, 'EEEE, MMM dd, yyyy')} • {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {shift.location} • {shift.type}
                      </div>
                      <div className="text-sm mt-2">
                        <span className="font-medium">{shift.bookedCount}/{shift.capacity}</span> students booked
                      </div>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/instructor/shifts/${shift.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/shifts" className="flex flex-col items-start">
                <span className="font-semibold">Manage Shifts</span>
                <span className="text-sm text-muted-foreground">
                  View and edit all your shifts
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/shifts" className="flex flex-col items-start">
                <span className="font-semibold">Review Shifts</span>
                <span className="text-sm text-muted-foreground">
                  Provide student feedback
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InstructorDashboardPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Instructor', 'Administrator']}>
      <InstructorDashboardContent />
    </RoleProtectedRoute>
  );
}

