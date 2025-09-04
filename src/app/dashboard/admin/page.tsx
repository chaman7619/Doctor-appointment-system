
"use client";
import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Appointment, Doctor, Patient } from '@/lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, CalendarDays, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
                const doctorsQuery = query(collection(db, "users"), where("role", "==", "doctor"));
                const appointmentsQuery = collection(db, "appointments");

                const [patientsSnapshot, doctorsSnapshot, appointmentsSnapshot] = await Promise.all([
                    getDocs(patientsQuery),
                    getDocs(doctorsQuery),
                    getDocs(appointmentsQuery)
                ]);

                const patientsData = patientsSnapshot.docs.map(doc => doc.data() as Patient);
                const doctorsData = doctorsSnapshot.docs.map(doc => doc.data() as Doctor);
                const appointmentsData = appointmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));

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

    const upcomingAppointmentsCount = useMemo(() => 
        appointments.filter(apt => apt.status === 'upcoming').length,
    [appointments]);

    if (loading) {
        return (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="font-headline text-3xl font-bold">Admin Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">registered in the system</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{doctors.length}</div>
                        <p className="text-xs text-muted-foreground">available for consultation</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                        <p className="text-xs text-muted-foreground">booked all-time</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointmentsCount}</div>
                        <p className="text-xs text-muted-foreground">currently scheduled</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="appointments">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
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
                                        <TableHead className="hidden md:table-cell">Doctor</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="hidden sm:table-cell">Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedAppointments.length > 0 ? sortedAppointments.map(apt => (
                                        <TableRow key={apt.id}>
                                            <TableCell>{apt.patientName}</TableCell>
                                            <TableCell className="hidden md:table-cell">{apt.doctorName}</TableCell>
                                            <TableCell>{apt.date}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{apt.time}</TableCell>
                                            <TableCell className="capitalize">{apt.status}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">No appointments found.</TableCell>
                                        </TableRow>
                                    )}
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
                                    {patients.length > 0 ? patients.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.fullName}</TableCell>
                                            <TableCell>{p.email}</TableCell>
                                        </TableRow>
                                    )) : (
                                      <TableRow>
                                          <TableCell colSpan={2} className="text-center h-24">No patients found.</TableCell>
                                      </TableRow>
                                    )}
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
                                        <TableHead className="hidden sm:table-cell">Username</TableHead>
                                        <TableHead>Specialization</TableHead>
                                        <TableHead className="hidden md:table-cell">Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctors.length > 0 ? doctors.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.fullName}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{d.username}</TableCell>
                                            <TableCell>{d.specialization}</TableCell>
                                            <TableCell className="hidden md:table-cell">{d.email}</TableCell>
                                        </TableRow>
                                    )) : (
                                       <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">No doctors found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
