
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  role: 'admin' | 'patient' | 'doctor';
  [key: string]: any;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any, role: 'admin' | 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  register: (details: any, role: 'patient' | 'doctor') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: any, role: 'admin' | 'patient' | 'doctor') => {
    if (role === 'admin') {
      if (credentials.username === 'admin' && credentials.password === 'admin@123') {
        const adminUser: User = { id: 'admin', role: 'admin', username: 'admin' };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        toast({ title: "Login Successful", description: "Welcome, Admin!" });
        router.push('/dashboard/admin');
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid admin credentials." });
      }
      return;
    }

    try {
      const response = await fetch(`/api/auth/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        toast({ title: "Login Successful", description: `Welcome back!` });
        router.push(`/dashboard/${role}`);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  }, [router, toast]);

  const register = useCallback(async (details: any, role: 'patient' | 'doctor') => {
    try {
        const response = await fetch(`/api/auth/${role}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
        });
        const data = await response.json();
        if(response.ok) {
            toast({ title: "Registration Successful", description: "You can now log in." });
            router.push(`/login/${role}`);
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error: any) {
        toast({ variant: "destructive", title: "Registration Failed", description: error.message });
    }
  }, [router, toast]);
  
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/');
  }, [router, toast]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
