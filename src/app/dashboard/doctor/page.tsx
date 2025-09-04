
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays } from 'lucide-react';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            async function fetchAppointments() {
                try {
                    const res = await fetch(`/api/appointments/doctor/${user.id}`);
                    const data = await res.json();
                    setAppointments(data);
                } catch (error) {
                    console.error("Failed to fetch appointments", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchAppointments();
        }
    }, [user?.id]);
    
    const sortedAppointments = useMemo(() => 
        [...appointments].sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()), 
    [appointments]);

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-80 w-full" />
        </div>
    }

    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <CalendarDays className="h-8 w-8 text-primary"/>
                        <div>
                            <CardTitle>Your Appointments</CardTitle>
                            <CardDescription>Here are all the appointments scheduled with you.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedAppointments.map(apt => (
                                    <TableRow key={apt.id}>
                                        <TableCell>{apt.patientName}</TableCell>
                                        <TableCell>{apt.date}</TableCell>
                                        <TableCell>{apt.time}</TableCell>
                                        <TableCell className="capitalize">{apt.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You have no appointments scheduled.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
