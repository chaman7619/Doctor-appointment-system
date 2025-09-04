
"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login/patient');
      return;
    }

    const currentRole = user?.role;
    const requiredRole = pathname.split('/')[2];

    if (currentRole && requiredRole && currentRole !== requiredRole) {
      router.replace(`/dashboard/${currentRole}`);
    }

  }, [user, isAuthenticated, loading, router, pathname]);

  if (loading || !isAuthenticated || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <div className="container mx-auto p-8">
                <Skeleton className="h-12 w-1/4 mb-4" />
                <Skeleton className="h-64 w-full" />
            </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
