
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Users, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            async function fetchAppointments() {
                try {
                    setLoading(true);
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
    
    const upcomingAppointments = useMemo(() => 
        appointments
            .filter(apt => apt.status === 'upcoming')
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()), 
    [appointments]);
    
    const uniquePatientsCount = useMemo(() => {
        const patientIds = new Set(upcomingAppointments.map(apt => apt.patientId));
        return patientIds.size;
    }, [upcomingAppointments]);

    if (loading) {
        return (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
             <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
             </div>
            <Skeleton className="h-80 w-full" />
        </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Dr. {user?.fullName}.</p>
            </div>

             <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                         <p className="text-xs text-muted-foreground">scheduled for the future</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                         <p className="text-xs text-muted-foreground">in your history</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Patients Today</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniquePatientsCount}</div>
                        <p className="text-xs text-muted-foreground">in upcoming appointments</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                     <CardTitle>All Your Appointments</CardTitle>
                     <CardDescription>Here are all the appointments scheduled with you, past and present.</CardDescription>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                                    <TableHead className="hidden md:table-cell">Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map(apt => (
                                    <TableRow key={apt.id}>
                                        <TableCell>
                                            <div className="font-medium">{apt.patientName}</div>
                                            <div className="text-sm text-muted-foreground sm:hidden">{apt.date}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{apt.date}</TableCell>
                                        <TableCell className="hidden md:table-cell">{apt.time}</TableCell>
                                        <TableCell>
                                           <Badge variant={
                                               apt.status === 'upcoming' ? 'default' : apt.status === 'canceled' ? 'destructive' : 'secondary'
                                            } className="capitalize">{apt.status}</Badge>
                                        </TableCell>
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
