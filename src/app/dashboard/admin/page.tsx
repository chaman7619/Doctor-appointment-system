
"use client";
import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Appointment, Doctor, Patient } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/doctors'),
                    fetch('/api/appointments')
                ]);
                const patientsData = await patientsRes.json();
                const doctorsData = await doctorsRes.json();
                const appointmentsData = await appointmentsRes.json();

                setPatients(patientsData);
                setDoctors(doctorsData);
                setAppointments(appointmentsData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    const sortedAppointments = useMemo(() => 
        [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    [appointments]);

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-96 w-full" />
        </div>
    }

    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{doctors.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="appointments">
                <TabsList>
                    <TabsTrigger value="appointments">All Appointments</TabsTrigger>
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                    <TabsTrigger value="doctors">Doctors</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Appointments</CardTitle>
                            <CardDescription>A complete list of all appointments in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedAppointments.map(apt => (
                                        <TableRow key={apt.id}>
                                            <TableCell>{apt.patientName}</TableCell>
                                            <TableCell>{apt.doctorName}</TableCell>
                                            <TableCell>{apt.date}</TableCell>
                                            <TableCell>{apt.time}</TableCell>
                                            <TableCell className="capitalize">{apt.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="patients">
                     <Card>
                        <CardHeader>
                            <CardTitle>All Patients</CardTitle>
                            <CardDescription>A list of all registered patients.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patients.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.fullName}</TableCell>
                                            <TableCell>{p.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="doctors">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Doctors</CardTitle>
                            <CardDescription>A list of all registered doctors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Specialization</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctors.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.fullName}</TableCell>
                                            <TableCell>{d.username}</TableCell>
                                            <TableCell>{d.specialization}</TableCell>
                                            <TableCell>{d.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
