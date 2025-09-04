
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment, Doctor } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, PlusCircle, XCircle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

export default function PatientDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchAppointments = useCallback(async () => {
        if (user?.id) {
            try {
                const res = await fetch(`/api/appointments/patient/${user.id}`);
                const data = await res.json();
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
                toast({ variant: "destructive", title: "Error", description: "Could not fetch appointments." });
            }
        }
    }, [user?.id, toast]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await fetchAppointments();
            try {
                const doctorsRes = await fetch('/api/doctors');
                const doctorsData = await doctorsRes.json();
                setDoctors(doctorsData);
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [fetchAppointments]);
    
    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'canceled' })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Appointment canceled successfully." });
                fetchAppointments();
            } else {
                throw new Error('Failed to cancel appointment');
            }
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
        return <div className="space-y-4">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-80 w-full" />
        </div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-headline text-3xl font-bold">Patient Dashboard</h1>
                <BookAppointmentDialog doctors={doctors} onAppointmentBooked={fetchAppointments} />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays /> Upcoming Appointments</CardTitle>
                    <CardDescription>Here are your scheduled appointments. You can cancel if needed.</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingAppointments.map(apt => (
                                    <TableRow key={apt.id}>
                                        <TableCell>{apt.doctorName}</TableCell>
                                        <TableCell>{apt.date}</TableCell>
                                        <TableCell>{apt.time}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm"><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
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
                        <div className="text-center py-12 text-muted-foreground">
                            <p>You have no upcoming appointments.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appointment History</CardTitle>
                    <CardDescription>A record of your past and canceled appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                     {pastAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastAppointments.map(apt => (
                                    <TableRow key={apt.id}>
                                        <TableCell>{apt.doctorName}</TableCell>
                                        <TableCell>{apt.date}</TableCell>
                                        <TableCell>{apt.time}</TableCell>
                                        <TableCell className="capitalize">{apt.status}</TableCell>
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
