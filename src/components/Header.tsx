
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Hospital } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Hospital className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">
              MediTrack
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
                <>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                        Welcome, <span className="font-semibold text-foreground">{user?.fullName || user?.username}</span>
                    </span>
                    <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </>
            ) : (
                 <Button variant="outline" asChild>
                    <Link href="/login/patient">Login / Sign Up</Link>
                </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
