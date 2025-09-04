
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-background">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          Welcome to MediTrack Pro
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner in modern healthcare management. Access your portal to get started.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="items-center">
            <User className="w-12 h-12 mb-4 text-primary" />
            <CardTitle className="font-headline text-2xl">Patient Portal</CardTitle>
            <CardDescription>Access your health records and appointments.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/login/patient">Patient Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="items-center">
            <Stethoscope className="w-12 h-12 mb-4 text-primary" />
            <CardTitle className="font-headline text-2xl">Doctor Portal</CardTitle>
            <CardDescription>Manage your schedule and patient care.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/login/doctor">Doctor Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="items-center">
            <ShieldCheck className="w-12 h-12 mb-4 text-primary" />
            <CardTitle className="font-headline text-2xl">Admin Portal</CardTitle>
            <CardDescription>Oversee hospital operations and data.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/login/admin">Admin Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="link" asChild className="text-lg">
          <Link href="/doctors">
            Browse Our Doctors <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      <footer className="absolute bottom-4 text-center text-muted-foreground text-sm">
        <p>MediTrack Pro &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
