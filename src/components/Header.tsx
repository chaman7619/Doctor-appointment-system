
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Hospital } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-card shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Hospital className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">
              MediTrack Pro
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && user?.role !== 'admin' && (
                <Button variant="ghost" asChild>
                    <Link href="/doctors">Browse Doctors</Link>
                </Button>
            )}
            {isAuthenticated && (
                <>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                        Welcome, <span className="font-semibold text-foreground">{user?.fullName || user?.username}</span>
                    </span>
                    <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
