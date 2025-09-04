
"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import type { Doctor } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Loader2 } from "lucide-react";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const formSchema = z.object({
  doctorId: z.string({ required_error: "Please select a doctor." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time." }),
});

interface BookAppointmentDialogProps {
  doctors: Doctor[];
  onAppointmentBooked: () => void;
  children?: ReactNode;
}

export function BookAppointmentDialog({ doctors, onAppointmentBooked, children }: BookAppointmentDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || user.role !== 'patient') return;
    
    setIsSubmitting(true);
    const formattedDate = format(values.date, 'yyyy-MM-dd');

    try {
        // Check for existing appointment
        const q = query(collection(db, "appointments"), 
            where("doctorId", "==", values.doctorId),
            where("date", "==", formattedDate),
            where("time", "==", values.time),
            where("status", "==", "upcoming")
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            throw new Error("This time slot is already booked.");
        }

        const doctor = doctors.find(d => d.id === values.doctorId);
        if (!doctor) {
            throw new Error("Selected doctor not found.");
        }

        await addDoc(collection(db, 'appointments'), {
            patientId: user.id,
            patientName: user.fullName,
            doctorId: values.doctorId,
            doctorName: doctor.fullName,
            date: formattedDate,
            time: values.time,
            status: 'upcoming',
        });
        
        toast({ title: "Appointment Booked!", description: "Your appointment has been successfully scheduled." });
        if (onAppointmentBooked) onAppointmentBooked();
        setOpen(false);
        form.reset();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Booking Failed", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
        }
    }}>
      <DialogTrigger asChild>
        {children || <Button><PlusCircle className="mr-2 h-4 w-4"/> Book New Appointment</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>Select a doctor, date, and time for your visit.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Doctor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {doctors.map(doctor => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                        {doctor.fullName} - {doctor.specialization}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Confirm Appointment
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
