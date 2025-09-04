
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardRedirector() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user?.role) {
      router.replace(`/dashboard/${user.role}`);
    } else {
      router.replace('/login/patient');
    }
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-lg">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
  );
}
