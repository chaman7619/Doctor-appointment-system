
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, UserCircle, Phone } from "lucide-react";
import type { Doctor } from "@/lib/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function getDoctors(): Promise<Doctor[]> {
    const doctorsQuery = query(collection(db, "users"), where("role", "==", "doctor"));
    const querySnapshot = await getDocs(doctorsQuery);
    const doctors = querySnapshot.docs.map(doc => doc.data() as Doctor);
    return doctors;
}

export default async function DoctorsPage() {
    const doctors: Doctor[] = await getDoctors();

    return (
        <div className="bg-background min-h-screen">
            <Header />
            <header className="bg-card border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="font-headline text-4xl font-bold text-foreground">Meet Our Professionals</h1>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">Our dedicated team of experienced doctors is here to provide you with the best care.</p>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {doctors.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-xl">No doctors have registered yet. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {doctors.map(doctor => (
                            <Card key={doctor.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col group overflow-hidden">
                                <CardHeader className="items-center text-center p-6 bg-card">
                                    <div className="relative w-24 h-24 mb-4">
                                      <Image src={`https://i.pravatar.cc/150?u=${doctor.id}`} alt={doctor.fullName} layout="fill" className="rounded-full object-cover border-4 border-primary/20" />
                                    </div>
                                    <CardTitle className="font-headline text-xl">{doctor.fullName}</CardTitle>
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Stethoscope className="w-5 h-5" />
                                        <p className="text-primary">{doctor.specialization}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-6">
                                    <p className="text-muted-foreground text-sm text-center">{doctor.bio}</p>
                                </CardContent>
                                <CardFooter className="p-4 bg-muted/50">
                                    <Button asChild className="w-full">
                                        <Link href="/dashboard/patient">
                                            <Phone className="mr-2 h-4 w-4"/> Book Now
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export const dynamic = 'force-dynamic';
