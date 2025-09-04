
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, UserCircle } from "lucide-react";
import type { Doctor } from "@/lib/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getDoctors() {
    // In a real app, you'd fetch from your API. For this component, we can call the function directly or use fetch.
    // Using fetch to demonstrate full-stack flow. The URL must be absolute for server-side fetching.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/doctors`, { cache: 'no-store' });
    
    if (!res.ok) {
        throw new Error('Failed to fetch doctors');
    }
    return res.json();
}


export default async function DoctorsPage() {
    const doctors: Doctor[] = await getDoctors();

    return (
        <div className="bg-background min-h-screen">
            <header className="bg-card shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
                    <h1 className="font-headline text-4xl font-bold text-foreground">Our Doctors</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Meet our team of dedicated and experienced medical professionals.</p>
                     <Button asChild variant="outline" className="mt-4">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {doctors.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-xl">No doctors have registered yet. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map(doctor => (
                            <Card key={doctor.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                <CardHeader className="items-center text-center">
                                    <UserCircle className="w-20 h-20 text-primary mb-4" />
                                    <CardTitle className="font-headline text-2xl">{doctor.fullName}</CardTitle>
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Stethoscope className="w-5 h-5" />
                                        <CardDescription className="text-primary">{doctor.specialization}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-center">{doctor.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export const dynamic = 'force-dynamic';
