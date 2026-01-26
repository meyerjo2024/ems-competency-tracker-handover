// src/app/(app)/shifts/page.tsx
'use client';

import * as React from 'react';
import { ShiftCalendar } from "@/components/shifts/ShiftCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2, Edit, Trash2, FileText, CheckCircle, Clock, AlertCircle, Eye, Calendar as CalendarIcon, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose 
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid, startOfDay } from "date-fns";
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import { createShift, getAllAvailableShifts, getShiftsForInstructor, updateShift, deleteShift } from '@/actions/shiftActions';
import { bookShift, cancelShiftBooking, getShiftBookingsForStudent, submitShiftForReview, getShiftPendingReviewCount } from '@/actions/bookingActions';
import { getEncountersForShift } from '@/actions/patientCareFormActions';
import { shiftTypeOptions } from '@/components/forms/patient-care-form/patient-care-form-constants';
import type { Shift, ShiftBooking, UserProfile } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config';

type UpdateShiftInput = Partial<Omit<Shift, 'id' | 'createdAt' | 'updatedAt' | 'instructorId' | 'bookedCount'>>;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

const shiftFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date({ required_error: "Date is required." }),
  startTime: z.string().regex(timeRegex, { message: "Invalid start time format (HH:MM)." }),
  endTime: z.string().regex(timeRegex, { message: "Invalid end time format (HH:MM)." }),
  type: z.string().min(1, { message: "Shift type is required." }).refine(val => val !== "N/A", { message: "Shift type is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1." }),
  notes: z.string().optional(),
}).refine(data => {
  const start = parseInt(data.startTime.replace(":", ""), 10);
  const end = parseInt(data.endTime.replace(":", ""), 10);
  return end > start;
}, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;

export default function ShiftsPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isShiftFormDialogOpen, setIsShiftFormDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingShift, setEditingShift] = React.useState<Shift | null>(null);
  const [shiftToDelete, setShiftToDelete] = React.useState<Shift | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
  const [userBookings, setUserBookings] = React.useState<ShiftBooking[]>([]);
  const [managedShifts, setManagedShifts] = React.useState<Shift[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = React.useState(true);
  const [errorLoadingShifts, setErrorLoadingShifts] = React.useState<string | null>(null);
  const [instructorNames, setInstructorNames] = React.useState<Record<string, string>>({});
  const [encounterCounts, setEncounterCounts] = React.useState<Record<string, number>>({});
  const [pendingReviewCounts, setPendingReviewCounts] = React.useState<Record<string, number>>({});

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      title: "",
      date: startOfDay(new Date()),
      startTime: "08:00",
      endTime: "16:00",
      type: "N/A",
      location: "",
      capacity: 1,
      notes: "",
    },
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = form;

  const fetchInstructorNames = React.useCallback(async (shifts: Shift[]) => {
    const names: Record<string, string> = {};
    const uniqueInstructorIds = [...new Set(shifts
      .filter(shift => shift.instructorId)
      .map(shift => shift.instructorId))];

    for (const instructorId of uniqueInstructorIds) {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', instructorId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          names[instructorId] = userData.fullName;
        }
      } catch (error) {
        console.error(`Error fetching instructor name for ${instructorId}:`, error);
      }
    }
    setInstructorNames(names);
  }, []);

  const fetchEncounterCounts = React.useCallback(async (shiftIds: string[], studentId: string) => {
    const counts: Record<string, number> = {};
    
    for (const shiftId of shiftIds) {
      try {
        // Pass studentId to filter encounters (required for students due to security rules)
        const result = await getEncountersForShift(shiftId, studentId);
        if (result.success && result.data) {
          counts[shiftId] = result.data.length;
        } else {
          counts[shiftId] = 0;
        }
      } catch (error) {
        console.error(`Error fetching encounters for shift ${shiftId}:`, error);
        counts[shiftId] = 0;
      }
    }
    setEncounterCounts(counts);
  }, []);

  const fetchPendingReviewCounts = React.useCallback(async (shiftIds: string[]) => {
    const counts: Record<string, number> = {};
    
    for (const shiftId of shiftIds) {
      try {
        const count = await getShiftPendingReviewCount(shiftId);
        counts[shiftId] = count;
      } catch (error) {
        console.error(`Error fetching pending review count for shift ${shiftId}:`, error);
        counts[shiftId] = 0;
      }
    }
    setPendingReviewCounts(counts);
  }, []);

  const fetchData = React.useCallback(async () => {
    setIsLoadingShifts(true);
    setErrorLoadingShifts(null);
    try {
      const [shiftsData, bookingsData, instructorShiftsData] = await Promise.all([
        getAllAvailableShifts(),
        // Only fetch bookings if user is a Student
        (currentUser?.role === 'Student' && currentUser?.id) 
          ? getShiftBookingsForStudent(currentUser.id) 
          : Promise.resolve([]),
        // Fetch instructor shifts if user is Instructor or Admin
        (currentUser?.role === 'Instructor' || currentUser?.role === 'Administrator') && currentUser?.id 
          ? getShiftsForInstructor(currentUser.id) 
          : Promise.resolve([])
      ]);
      setAllShifts(shiftsData);
      setUserBookings(bookingsData);
      setManagedShifts(instructorShiftsData);
      await fetchInstructorNames([...shiftsData, ...instructorShiftsData]);
      
      // Fetch encounter counts for student bookings
      if (currentUser?.role === 'Student' && currentUser?.id && bookingsData.length > 0) {
        const bookedShiftIds = bookingsData.map(b => b.shiftId);
        await fetchEncounterCounts(bookedShiftIds, currentUser.id);
      }

      // Fetch pending review counts for instructor shifts
      if ((currentUser?.role === 'Instructor' || currentUser?.role === 'Administrator') && instructorShiftsData.length > 0) {
        const instructorShiftIds = instructorShiftsData.map(s => s.id);
        await fetchPendingReviewCounts(instructorShiftIds);
      }
    } catch (err: any) {
      setErrorLoadingShifts(err.message || "Failed to load shift data.");
      toast({ title: "Error Loading Shifts", description: err.message || "Could not fetch shifts.", variant: "destructive" });
    } finally {
      setIsLoadingShifts(false);
    }
  }, [currentUser?.id, currentUser?.role, toast, fetchInstructorNames, fetchEncounterCounts, fetchPendingReviewCounts]);

  React.useEffect(() => {
    // Layout ensures currentUser exists, so we can fetch immediately
    if (currentUser) {
      fetchData();
    } else {
      // If somehow no user, stop loading
      setIsLoadingShifts(false);
    }
  }, [currentUser, fetchData]);

  const handleShiftFormSubmit: SubmitHandler<ShiftFormValues> = async (values) => {
    if (!currentUser?.id) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    try {
      let result;
      if (editingShift) {
        const shiftDataForUpdate: UpdateShiftInput = {
           ...values,
           date: format(values.date, "yyyy-MM-dd"), 
        };
        result = await updateShift(editingShift.id, shiftDataForUpdate, currentUser.id);
        if (result.success) {
          toast({ title: "Shift Updated!", description: `Shift "${values.title}" has been successfully updated.` });
        }
      } else {
        const shiftDataToCreate: Omit<Shift, 'id' | 'createdAt' | 'updatedAt' | 'instructorId' | 'bookedCount'> = {
          ...values,
          date: format(values.date, "yyyy-MM-dd"),
        };
        result = await createShift(shiftDataToCreate, currentUser.id);
        if (result.success) {
          toast({ title: "Shift Created!", description: `Shift "${values.title}" has been successfully created.` });
        }
      }

      if (result.success) {
        setIsShiftFormDialogOpen(false);
        resetFormAndState();
        fetchData(); 
      } else {
        toast({ title: `Error ${editingShift ? 'Updating' : 'Creating'} Shift`, description: result.error || "An unexpected error occurred.", variant: "destructive" });
      }
    } catch (error) {
      console.error(`${editingShift ? 'Update' : 'Create'} shift error:`, error);
      toast({ title: "Error", description: `Failed to ${editingShift ? 'update' : 'create'} shift. Please try again.`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShift = async () => {
    if (!shiftToDelete || !currentUser?.id) {
      toast({ title: "Error", description: "No shift selected for deletion or not authorized.", variant: "destructive" });
      return;
    }
    setIsDeleting(true);
    try {
      const result = await deleteShift(shiftToDelete.id);
      if (result.success) {
        toast({ title: "Shift Deleted", description: `Shift "${shiftToDelete.title}" has been deleted.` });
        fetchData(); // Re-fetch data
      } else {
        toast({ title: "Error Deleting Shift", description: result.error || "Could not delete shift.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error Deleting Shift", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setShiftToDelete(null); // Close dialog
    }
  };

  const openCreateShiftDialog = () => {
    setEditingShift(null);
    reset({ 
      title: "",
      date: startOfDay(new Date()),
      startTime: "08:00",
      endTime: "16:00",
      type: "N/A",
      location: "",
      capacity: 1,
      notes: "",
    });
    setIsShiftFormDialogOpen(true);
  };

  const openEditShiftDialog = (shift: Shift) => {
    setEditingShift(shift);
    let parsedDate = startOfDay(new Date()); // Default to today if date is invalid
    if (shift.date && typeof shift.date === 'string' && isValid(parseISO(shift.date))) {
      parsedDate = parseISO(shift.date);
    }
    
    reset({
      ...shift,
      date: parsedDate,
      capacity: Number(shift.capacity), 
    });
    setIsShiftFormDialogOpen(true);
  };
  
  const resetFormAndState = () => {
    reset();
    setEditingShift(null);
  };
  
  const canManageShifts = currentUser?.role === 'Instructor' || currentUser?.role === 'Administrator';

  const isShiftBooked = (shiftId: string) => {
    return userBookings.some(booking => booking.shiftId === shiftId);
  };

  const handleBookShift = async (shift: Shift) => {
    if (!currentUser?.id) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    try {
      const result = await bookShift(shift.id, currentUser.id);
      if (result.success) {
        toast({ title: "Success", description: "Shift booked successfully!" });
        fetchData(); // Refresh the data
      } else {
        toast({ 
          title: "Error Booking Shift", 
          description: result.error || "Could not book shift. Please try again.", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Error Booking Shift", 
        description: error.message || "An unexpected error occurred.", 
        variant: "destructive" 
      });
    }
  };

  const handleSubmitForReview = async (shiftId: string) => {
    if (!currentUser?.id) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    try {
      const result = await submitShiftForReview(shiftId, currentUser.id);
      if (result.success) {
        toast({ 
          title: "Shift Submitted", 
          description: "Your shift has been submitted for instructor review!" 
        });
        fetchData(); // Refresh the data to show updated status
      } else {
        toast({ 
          title: "Error Submitting Shift", 
          description: result.error || "Could not submit shift for review. Please try again.", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Error Submitting Shift",
        description: error.message || "An unexpected error occurred.", 
        variant: "destructive" 
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!currentUser?.id) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    try {
      const result = await cancelShiftBooking(bookingId, currentUser.id);
      if (result.success) {
        toast({ title: "Success", description: "Booking cancelled successfully!" });
        fetchData(); // Refresh the data
      } else {
        toast({ 
          title: "Error Cancelling Booking", 
          description: result.error || "Could not cancel booking. Please try again.", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Error Cancelling Booking", 
        description: error.message || "An unexpected error occurred.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 sm:mb-0">Shift Management</h1>
        {canManageShifts && (
          <Dialog open={isShiftFormDialogOpen} onOpenChange={(isOpen) => {
            setIsShiftFormDialogOpen(isOpen);
            if (!isOpen) resetFormAndState();
          }}>
            <DialogTrigger asChild>
              <Button onClick={openCreateShiftDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingShift ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleShiftFormSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Shift Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="date">Date</Label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value && isValid(field.value) ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => field.onChange(date ? startOfDay(date) : undefined)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="type">Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? "N/A"} defaultValue={field.value ?? "N/A"}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shiftTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="startTime">Start Time (HH:MM)</Label>
                    <Input id="startTime" {...register("startTime")} placeholder="e.g., 08:00" />
                    {errors.startTime && <p className="text-sm text-destructive">{errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endTime">End Time (HH:MM)</Label>
                    <Input id="endTime" {...register("endTime")} placeholder="e.g., 16:00" />
                    {errors.endTime && <p className="text-sm text-destructive">{errors.endTime.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register("location")} />
                    {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" {...register("capacity")} />
                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" {...register("notes")} />
                  {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={resetFormAndState}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingShift ? 'Update Shift' : 'Create Shift'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <p className="text-muted-foreground">
        View available clinical, field, and lab shifts. Book your sessions and manage your schedule.
      </p>

      {isLoadingShifts ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading shifts...</span>
        </div>
      ) : errorLoadingShifts ? (
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          <p>{errorLoadingShifts}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Available Shifts Section (for students only) */}
          {currentUser?.role === 'Student' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Shifts</h2>
              {allShifts.length === 0 ? (
                <p className="text-muted-foreground">No available shifts at the moment.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{shift.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {format(parseISO(shift.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </p>
                        <p className="text-muted-foreground">
                          Location: {shift.location}
                        </p>
                        <p className="text-muted-foreground">
                          Type: {shift.type}
                        </p>
                        <p className="text-muted-foreground">
                          Instructor: {instructorNames[shift.instructorId] || 'Unknown'}
                        </p>
                        <p className="text-muted-foreground">
                          Spots: {shift.capacity - shift.bookedCount} remaining
                        </p>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleBookShift(shift)}
                        disabled={isShiftBooked(shift.id)}
                      >
                        {isShiftBooked(shift.id) ? 'Already Booked' : 'Book Shift'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Bookings Section (for students) */}
          {currentUser?.role === 'Student' && userBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userBookings.map((booking) => {
                  const shift = allShifts.find(s => s.id === booking.shiftId);
                  if (!shift) return null;
                  
                  return (
                    <div
                      key={booking.id}
                      className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{shift.title}</h3>
                          {booking.status === 'Attended' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          )}
                          {booking.status === 'Reviewed' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          )}
                          {booking.status === 'Booked' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(parseISO(shift.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </p>
                        <p className="text-muted-foreground">
                          Location: {shift.location}
                        </p>
                        <p className="text-muted-foreground">
                          Type: {shift.type}
                        </p>
                        <p className="text-muted-foreground">
                          Instructor: {instructorNames[shift.instructorId] || 'Unknown'}
                        </p>
                        <p className="text-muted-foreground flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {encounterCounts[shift.id] || 0} encounter{encounterCounts[shift.id] !== 1 ? 's' : ''} logged
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        {booking.status === 'Booked' && (
                          <>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                asChild
                              >
                                <Link href={`/patient-care-form?shiftId=${shift.id}`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Log Encounter
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            </div>
                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={() => handleSubmitForReview(shift.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Submit Shift for Review
                            </Button>
                          </>
                        )}
                        {booking.status === 'Attended' && (
                          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                            <p className="font-medium">Awaiting Instructor Feedback</p>
                            <p className="text-xs mt-1">Your instructor will review this shift soon.</p>
                          </div>
                        )}
                        {booking.status === 'Reviewed' && (
                          <Button
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <Link href={`/encounters`}>
                              View Feedback
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instructor Shift Management - Priority-Based Layout */}
          {canManageShifts && managedShifts.length > 0 && (
            <>
              {/* Section 1: Shifts Awaiting Review (Priority) */}
              {(() => {
                const shiftsNeedingReview = managedShifts.filter(shift => (pendingReviewCounts[shift.id] || 0) > 0);
                return shiftsNeedingReview.length > 0 && (
                  <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h2 className="text-xl font-semibold text-yellow-900">
                          Shifts Awaiting Review ({shiftsNeedingReview.length})
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-yellow-800 mb-4">
                      Students have submitted these shifts for review. Provide feedback to complete the review process.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {shiftsNeedingReview.map((shift) => (
                        <div
                          key={shift.id}
                          className="rounded-lg border-2 border-yellow-400 bg-white p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-base">{shift.title}</h3>
                            <Badge className="bg-yellow-600 hover:bg-yellow-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {pendingReviewCounts[shift.id]} Pending
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1.5" />
                              {format(parseISO(shift.date), 'EEEE, MMM d, yyyy')}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <Clock className="h-4 w-4 mr-1.5" />
                              {shift.startTime} - {shift.endTime}
                            </p>
                            <p className="text-muted-foreground">
                              {shift.location} • {shift.type}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <Users className="h-4 w-4 mr-1.5" />
                              {shift.bookedCount} student{shift.bookedCount !== 1 ? 's' : ''} booked
                            </p>
                          </div>
                          <Button
                            className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700"
                            asChild
                          >
                            <Link href={`/instructor/shifts/${shift.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review Now
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 2: Upcoming Shifts with Students */}
              {(() => {
                const upcomingShifts = managedShifts
                  .filter(shift => {
                    const shiftDate = parseISO(shift.date);
                    const isUpcoming = shiftDate >= new Date();
                    const hasNoReviews = (pendingReviewCounts[shift.id] || 0) === 0;
                    const hasStudents = shift.bookedCount > 0;
                    return isUpcoming && hasNoReviews && hasStudents;
                  })
                  .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
                
                return upcomingShifts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-xl font-semibold">Upcoming Shifts ({upcomingShifts.length})</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Future shifts with active student bookings
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {upcomingShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{shift.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(shift.date), 'MMM d')}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              {shift.startTime} - {shift.endTime}
                            </p>
                            <p className="text-muted-foreground">
                              {shift.location} • {shift.type}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {shift.bookedCount} / {shift.capacity} students
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            asChild
                          >
                            <Link href={`/instructor/shifts/${shift.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 3: All Managed Shifts (Collapsible) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">All My Shifts ({managedShifts.length})</h2>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <div className="grid gap-3">
                    {managedShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{shift.title}</h3>
                            {(pendingReviewCounts[shift.id] || 0) > 0 && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-400 text-xs">
                                {pendingReviewCounts[shift.id]} pending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{format(parseISO(shift.date), 'MMM d, yyyy')}</span>
                            <span>{shift.startTime} - {shift.endTime}</span>
                            <span>{shift.location}</span>
                            <span>{shift.bookedCount} / {shift.capacity} booked</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditShiftDialog(shift)}
                            title="Edit shift"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShiftToDelete(shift)}
                            title="Delete shift"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/instructor/shifts/${shift.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!shiftToDelete} onOpenChange={(open) => !open && setShiftToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shift "{shiftToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteShift}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
