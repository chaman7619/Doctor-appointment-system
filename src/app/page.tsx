
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, ShieldCheck, ArrowRight, Hospital } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2">
              <Hospital className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold text-foreground">
                MediTrack
              </span>
            </Link>
            <Button asChild variant="outline">
              <Link href="/login/patient">Login / Sign Up</Link>
            </Button>
          </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
                  Modern Healthcare, <span className="text-primary">Simplified.</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                  Your trusted partner in healthcare management. Access your portal to seamlessly book appointments, view records, and connect with your doctor.
                </p>
                <div className="mt-8 flex gap-4 justify-start">
                   <Button asChild size="lg">
                      <Link href="/dashboard">Access Your Portal</Link>
                    </Button>
                    <Button asChild size="lg" variant="ghost">
                      <Link href="/doctors">
                        Meet Our Doctors <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-full w-full rounded-xl overflow-hidden shadow-2xl">
                 <Image src="https://picsum.photos/800/600" alt="Doctor and patient" layout="fill" objectFit="cover" data-ai-hint="doctor patient" />
              </div>
            </div>
        </section>

        <section className="bg-card py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">Your Health, Your Control</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                We provide dedicated portals for everyone in our healthcare ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">For Patients</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                   <CardDescription>Access your health records, book appointments with ease, and manage your medical history securely.</CardDescription>
                </CardContent>
                <CardFooter>
                   <Button asChild className="w-full" variant="secondary">
                    <Link href="/login/patient">Patient Portal <ArrowRight className="ml-2 h-4 w-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <CardHeader className="items-center text-center">
                   <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Stethoscope className="w-10 h-10 text-primary" />
                    </div>
                  <CardTitle className="font-headline text-2xl">For Doctors</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                   <CardDescription>Manage your schedule, view patient appointments, and streamline your patient care process.</CardDescription>
                </CardContent>
                 <CardFooter>
                   <Button asChild className="w-full" variant="secondary">
                    <Link href="/login/doctor">Doctor Portal <ArrowRight className="ml-2 h-4 w-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">For Admins</CardTitle>
                </CardHeader>
                 <CardContent className="flex-grow text-center">
                   <CardDescription>Oversee all hospital operations, manage user data, and view comprehensive system analytics.</CardDescription>
                </CardContent>
                 <CardFooter>
                   <Button asChild className="w-full" variant="secondary">
                    <Link href="/login/admin">Admin Portal <ArrowRight className="ml-2 h-4 w-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card mt-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>MediTrack &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
