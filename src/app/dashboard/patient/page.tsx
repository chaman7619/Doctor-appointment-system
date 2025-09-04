
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment, Doctor } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, PlusCircle, XCircle, History, Info } from 'lucide-react';
import { BookAppointmentDialog } from '@/components/BookAppointmentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PatientDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchAppointments = useCallback(() => {
        if (user?.id) {
            const q = query(collection(db, "appointments"), where("patientId", "==", user.id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const appointmentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
                setAppointments(appointmentsData);
            }, (error) => {
                console.error("Failed to fetch appointments in real-time", error);
                toast({ variant: "destructive", title: "Error", description: "Could not fetch appointments." });
            });
            return unsubscribe;
        }
    }, [user?.id, toast]);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = fetchAppointments();
        
        async function fetchDoctors() {
            try {
                const doctorsQuery = query(collection(db, "users"), where("role", "==", "doctor"));
                const doctorsSnapshot = await getDocs(doctorsQuery);
                const doctorsData = doctorsSnapshot.docs.map(doc => doc.data() as Doctor);
                setDoctors(doctorsData);
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchDoctors();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [fetchAppointments]);
    
    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            const appointmentRef = doc(db, "appointments", appointmentId);
            await updateDoc(appointmentRef, { status: 'canceled' });
            toast({ title: "Success", description: "Appointment canceled successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not cancel the appointment." });
        }
    };
    
    const upcomingAppointments = useMemo(() => 
        appointments
            .filter(apt => apt.status === 'upcoming')
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()), 
    [appointments]);
    
    const pastAppointments = useMemo(() => 
        appointments
            .filter(apt => apt.status !== 'upcoming')
            .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()),
    [appointments]);

    if (loading) {
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, {user?.fullName}!</h1>
                    <p className="text-muted-foreground">Here's your personal health dashboard.</p>
                </div>
                <BookAppointmentDialog doctors={doctors} onAppointmentBooked={fetchAppointments as () => void} />
            </div>
            
            <Card className="border-primary/50 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CalendarDays className="text-primary"/> Upcoming Appointments</CardTitle>
                    <CardDescription>Here are your scheduled appointments. You can cancel up to 24 hours before.</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="hidden sm:table-cell">Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingAppointments.map(apt => (
                                    <TableRow key={apt.id}>
                                        <TableCell>
                                            <div className="font-medium">{apt.doctorName}</div>
                                            <div className="text-muted-foreground text-sm md:hidden">{apt.date} at {apt.time}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{apt.date}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{apt.time}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm"><XCircle className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Cancel</span></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently cancel your appointment.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleCancelAppointment(apt.id)}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
                            <Info className="w-10 h-10"/>
                            <p className="font-semibold">You have no upcoming appointments.</p>
                            <p className="text-sm max-w-sm">Ready to see a doctor? Click the button below to schedule your next visit.</p>
                             <BookAppointmentDialog doctors={doctors} onAppointmentBooked={fetchAppointments as () => void}>
                                 <Button>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Book an Appointment
                                 </Button>
                             </BookAppointmentDialog>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><History /> Appointment History</CardTitle>
                    <CardDescription>A record of your past and canceled appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                     {pastAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="hidden sm:table-cell">Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastAppointments.map(apt => (
                                    <TableRow key={apt.id} className="text-muted-foreground">
                                        <TableCell>
                                            <div className="font-medium text-foreground">{apt.doctorName}</div>
                                            <div className="text-sm md:hidden">{apt.date}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{apt.date}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{apt.time}</TableCell>
                                        <TableCell>
                                            <Badge variant={apt.status === 'canceled' ? 'destructive' : 'secondary'} className="capitalize">{apt.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>You have no appointment history.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
