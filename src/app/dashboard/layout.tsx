
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Users,
  Stethoscope,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Hospital,
  User,
  BookUser
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading, logout } = useAuth();
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
        <div className="container mx-auto p-8">
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-96 w-64" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
        </div>
      </div>
    );
  }

  const getNavLinks = (role: 'admin' | 'patient' | 'doctor') => {
    switch (role) {
      case 'admin':
        return [
          { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Overview' },
          { href: '#', icon: Users, label: 'Patients' },
          { href: '#', icon: Stethoscope, label: 'Doctors' },
          { href: '#', icon: CalendarDays, label: 'Appointments' },
        ];
      case 'doctor':
        return [
          { href: '/dashboard/doctor', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '#', icon: CalendarDays, label: 'My Schedule' },
        ];
      case 'patient':
        return [
          { href: '/dashboard/patient', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/doctors', icon: Stethoscope, label: 'Browse Doctors' },
          { href: '#', icon: BookUser, label: 'My Records' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks(user.role);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Hospital className="h-8 w-8 text-sidebar-primary" />
            <span className="font-headline text-xl font-bold text-sidebar-foreground">
              MediTrack
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={pathname === link.href} tooltip={link.label}>
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 m-2">
              <User className="w-8 h-8 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{user?.fullName || user?.username}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
               <Button variant="ghost" size="icon" onClick={logout} className="ml-auto">
                  <LogOut className="h-5 w-5" />
              </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="flex items-center justify-between p-4 border-b md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <div className="hidden md:flex items-center gap-4">
                 <span className="text-sm text-muted-foreground hidden sm:inline">
                    Welcome, <span className="font-semibold text-foreground">{user?.fullName || user?.username}</span>
                 </span>
            </div>
         </header>
         <main className="p-4 sm:p-6 lg:p-8 flex-grow">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
