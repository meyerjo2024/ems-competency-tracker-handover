// src/app/(app)/dashboard/student/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Loader2,
  BookOpen,
  TrendingUp,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { getShiftBookingsForStudent } from '@/actions/bookingActions';
import { getAllAvailableShifts } from '@/actions/shiftActions';
import { getAllFeedbacksForStudent } from '@/actions/shiftFeedbackActions';
import type { Shift, ShiftBooking, PatientCareFormData, ShiftFeedback } from '@/types';
import { isFuture, isToday, parseISO, format } from 'date-fns';

export interface PopulatedShiftBooking extends ShiftBooking {
  shiftDetails?: Shift;
}

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const [upcomingBookedShifts, setUpcomingBookedShifts] = React.useState<PopulatedShiftBooking[]>([]);
  const [recentEncounters, setRecentEncounters] = React.useState<PatientCareFormData[]>([]);
  const [recentFeedback, setRecentFeedback] = React.useState<ShiftFeedback[]>([]);
  const [stats, setStats] = React.useState({
    totalShiftsBooked: 0,
    totalEncounters: 0,
    pendingSubmissions: 0,
    reviewedShifts: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch bookings and shifts
        const [bookings, allShifts] = await Promise.all([
          getShiftBookingsForStudent(currentUser.id),
          getAllAvailableShifts()
        ]);

        // Populate bookings with shift details
        const populatedBookings = bookings
          .map(booking => {
            const shiftDetails = allShifts.find(shift => shift.id === booking.shiftId);
            return { ...booking, shiftDetails };
          })
          .filter(pb => pb.shiftDetails) as PopulatedShiftBooking[];

        // Get upcoming booked shifts
        const upcoming = populatedBookings
          .filter(pb => 
            pb.status === 'Booked' && 
            pb.shiftDetails &&
            (isFuture(parseISO(pb.shiftDetails.date)) || isToday(parseISO(pb.shiftDetails.date)))
          )
          .sort((a, b) => {
            if (!a.shiftDetails || !b.shiftDetails) return 0;
            return parseISO(a.shiftDetails.date).getTime() - parseISO(b.shiftDetails.date).getTime();
          });

        setUpcomingBookedShifts(upcoming);

        // Fetch all encounters for this student using a single query
        // This is much faster than fetching per shift
        const { getEncountersForStudent } = await import('@/actions/patientCareFormActions');
        const encountersResult = await getEncountersForStudent(currentUser.id);
        const allEncounters = encountersResult.success && encountersResult.data ? encountersResult.data : [];

        // Sort by date and take last 5
        const sortedEncounters = allEncounters.sort((a, b) => {
          const dateA = a.submittedAt || a.updatedAt || a.createdAt;
          const dateB = b.submittedAt || b.updatedAt || b.createdAt;
          
          // Convert Firestore Timestamp to Date if needed
          const timeA = dateA instanceof Date ? dateA.getTime() : (dateA as any)?.toDate?.()?.getTime() || 0;
          const timeB = dateB instanceof Date ? dateB.getTime() : (dateB as any)?.toDate?.()?.getTime() || 0;
          
          return timeB - timeA;
        }).slice(0, 5);

        setRecentEncounters(sortedEncounters);

        // Fetch feedback
        try {
          const feedbackResult = await getAllFeedbacksForStudent(currentUser.id);
          // Check if feedbackResult is an array (successful) or handle error
          if (Array.isArray(feedbackResult)) {
            const sortedFeedback = feedbackResult
              .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
              .slice(0, 3);
            setRecentFeedback(sortedFeedback);
          } else {
            // If there's an error fetching feedback (e.g., missing index), just set empty array
            console.log('Unable to fetch feedback (may need Firestore index)');
            setRecentFeedback([]);
          }
        } catch (feedbackError) {
          console.error('Error fetching feedback:', feedbackError);
          setRecentFeedback([]);
        }

        // Calculate stats
        const totalEncountersCount = allEncounters.length;
        const pendingCount = populatedBookings.filter(pb => pb.status === 'Attended').length;
        const reviewedCount = populatedBookings.filter(pb => pb.status === 'Reviewed').length;

        setStats({
          totalShiftsBooked: populatedBookings.length,
          totalEncounters: totalEncountersCount,
          pendingSubmissions: pendingCount,
          reviewedShifts: reviewedCount
        });

      } catch (err: any) {
        console.error("Error fetching student dashboard data:", err);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {currentUser?.fullName}!</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts Booked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShiftsBooked}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encounters Logged</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEncounters}</div>
            <p className="text-xs text-muted-foreground">Patient encounters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting instructor feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed Shifts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.reviewedShifts}</div>
            <p className="text-xs text-muted-foreground">With feedback</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Upcoming Shifts
            </CardTitle>
            <CardDescription>Your next scheduled shifts.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookedShifts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming shifts</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/shifts">Browse Available Shifts</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookedShifts.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {booking.shiftDetails?.type} - {booking.shiftDetails?.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.shiftDetails && format(parseISO(booking.shiftDetails.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge variant="outline">{booking.status}</Badge>
                  </div>
                ))}
                {upcomingBookedShifts.length > 3 && (
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/shifts">View All Shifts</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Encounters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Recent Encounters
            </CardTitle>
            <CardDescription>Your latest patient encounter logs.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEncounters.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No encounters logged yet</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/patient-care-form">Log Your First Encounter</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEncounters.map((encounter) => (
                  <div key={encounter.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {encounter.primaryImpressionCondition || 'Patient Encounter'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Age: {encounter.age || 'N/A'} {encounter.ageUnit && encounter.ageUnit !== 'N/A' ? encounter.ageUnit : ''} | {encounter.sex || 'N/A'}
                      </p>
                    </div>
                    <Badge variant={encounter.isDraft ? "secondary" : "default"}>
                      {encounter.isDraft ? 'Draft' : 'Submitted'}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/encounters">View All Encounters</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Recent Feedback
            </CardTitle>
            <CardDescription>Instructor feedback on your shifts.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFeedback.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No feedback yet</p>
                <p className="text-xs mt-1">Complete shifts to receive instructor feedback</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">Shift Feedback</p>
                      {feedback.performanceRating && (
                        <Badge variant={
                          feedback.performanceRating === 'Excellent' ? 'default' :
                          feedback.performanceRating === 'Good' ? 'secondary' :
                          'outline'
                        }>
                          {feedback.performanceRating}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feedback.overallFeedback}
                    </p>
                    {feedback.createdAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(feedback.createdAt, 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/patient-care-form">
                <FileText className="mr-2 h-4 w-4" />
                Log New Encounter
              </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link href="/shifts">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Shifts
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/encounters">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Encounters
                </Link>
              </Button>
            </div>

            {stats.pendingSubmissions > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">
                  You have {stats.pendingSubmissions} shift{stats.pendingSubmissions > 1 ? 's' : ''} awaiting review
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your instructor will provide feedback soon
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
