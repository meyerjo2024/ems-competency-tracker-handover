"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { DayProps } from "react-day-picker";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { MapPin, User, Clock, Loader2 } from "lucide-react";
import type { Shift, ShiftBooking } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { bookShift, cancelShiftBooking } from '@/actions/bookingActions';
import { useToast } from '@/hooks/use-toast';

interface ShiftCalendarProps {
  shifts: Shift[];
  userBookings: ShiftBooking[];
  isLoading: boolean;
  error: string | null;
  onBookOrCancel: () => void;
}

export function ShiftCalendar({ shifts, userBookings, isLoading, error, onBookOrCancel }: ShiftCalendarProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedShift, setSelectedShift] = React.useState<Shift | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isBooking, setIsBooking] = React.useState(false);

  const today = new Date();
  
  const CustomDay: React.FC<DayProps> = (props) => {
    const dayShifts = shifts.filter(shift => isSameDay(parseISO(shift.date), props.date));
    const isDisabled = props.date < today || props.date.getMonth() !== props.date.getMonth();
    
    return (
      <div className="relative flex flex-col items-center justify-center h-full">
        <span className={isDisabled ? "text-muted-foreground opacity-50" : ""}>
          {format(props.date, "d")}
        </span>
        {dayShifts.length > 0 && (
          <div className="absolute bottom-0.5 flex space-x-0.5">
            {dayShifts.slice(0,3).map(shift => (
              <Badge 
                key={shift.id} 
                variant={shift.type === "Clinical" ? "default" : shift.type === "Field" ? "secondary" : "outline"}
                className={`h-1.5 w-1.5 p-0 rounded-full ${
                  shift.type === "Clinical" ? "bg-primary" : 
                  shift.type === "Field" ? "bg-green-500" :
                  "bg-yellow-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (selectedDate?: Date) => {
    setDate(selectedDate);
    if (selectedDate) {
      const shiftOnDate = shifts.find(shift => isSameDay(parseISO(shift.date), selectedDate));
      if (shiftOnDate) {
        setSelectedShift(shiftOnDate);
        setIsDialogOpen(true);
      }
    }
  };

  const handleBookShift = async () => {
    if (!selectedShift || !currentUser?.id) return;
    
    setIsBooking(true);
    try {
      const result = await bookShift(selectedShift.id, currentUser.id);
      if (result.success) {
        toast({ title: "Success", description: "Shift booked successfully!" });
        onBookOrCancel();
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Failed to book shift", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsBooking(false);
      setIsDialogOpen(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedShift || !currentUser?.id) return;
    
    const booking = userBookings.find(b => b.shiftId === selectedShift.id);
    if (!booking) return;

    setIsBooking(true);
    try {
      const result = await cancelShiftBooking(booking.id, currentUser.id);
      if (result.success) {
        toast({ title: "Success", description: "Booking cancelled successfully!" });
        onBookOrCancel();
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Failed to cancel booking", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsBooking(false);
      setIsDialogOpen(false);
    }
  };

  const isShiftBooked = (shiftId: string) => {
    return userBookings.some(booking => 
      booking.shiftId === shiftId && 
      booking.status === 'Booked'
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border p-0"
          components={{ Day: CustomDay as any }}
          modifiers={{ 
            hasShift: shifts.map(s => parseISO(s.date)),
            booked: shifts.filter(s => isShiftBooked(s.id)).map(s => parseISO(s.date)),
          }}
          modifiersClassNames={{
            hasShift: "font-bold",
            booked: "text-primary-foreground bg-primary/30 rounded-md",
          }}
        />
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Shift Details</CardTitle>
            <CardDescription>
              {date ? format(date, "PPP") : "Select a date to see shifts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p className="text-muted-foreground">Loading shifts...</p>
              </div>
            ) : error ? (
              <p className="text-destructive text-center">{error}</p>
            ) : date && shifts.filter(shift => isSameDay(parseISO(shift.date), date)).length > 0 ? (
              shifts.filter(shift => isSameDay(parseISO(shift.date), date)).map(shift => (
                <div key={shift.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedShift(shift); setIsDialogOpen(true); }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-foreground">{shift.title}</h4>
                    <Badge variant={shift.type === "Clinical" ? "default" : shift.type === "Field" ? "secondary" : "outline"} className={
                      shift.type === "Clinical" ? "bg-primary hover:bg-primary/90" : 
                      shift.type === "Field" ? "bg-green-500 hover:bg-green-600 text-white" :
                      "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }>
                      {shift.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-1" /> {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" /> {shift.location}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {shift.bookedCount}/{shift.capacity} spots filled
                  </div>
                  {isShiftBooked(shift.id) && <Badge variant="outline" className="mt-2 border-green-500 text-green-500">Booked by you</Badge>}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No shifts scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedShift && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedShift.title}</DialogTitle>
              <DialogDescription>
                {isShiftBooked(selectedShift.id) ? "Cancel your booking" : "Confirm details and book your shift"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p><strong className="text-foreground">Date:</strong> {format(parseISO(selectedShift.date), "PPP")}</p>
              <p><strong className="text-foreground">Time:</strong> {selectedShift.startTime} - {selectedShift.endTime}</p>
              <p><strong className="text-foreground">Type:</strong> {selectedShift.type}</p>
              <p><strong className="text-foreground">Location:</strong> {selectedShift.location}</p>
              <p><strong className="text-foreground">Availability:</strong> {selectedShift.bookedCount}/{selectedShift.capacity} spots filled</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              {isShiftBooked(selectedShift.id) ? (
                <Button 
                  onClick={handleCancelBooking}
                  disabled={isBooking}
                  variant="destructive"
                >
                  {isBooking ? "Cancelling..." : "Cancel Booking"}
                </Button>
              ) : (
                <Button 
                  onClick={handleBookShift}
                  disabled={isBooking || selectedShift.bookedCount >= selectedShift.capacity}
                >
                  {isBooking ? "Booking..." : (selectedShift.bookedCount >= selectedShift.capacity ? "Shift Full" : "Book Shift")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
