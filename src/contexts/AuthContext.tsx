
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/database';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any, role: 'admin' | 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  register: (details: any, role: 'patient' | 'doctor') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // This case might happen if user is deleted from firestore but not auth
          setUser(null); 
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (credentials: any, role: 'admin' | 'patient' | 'doctor') => {
    // Admin login remains a local, non-Firebase login
    if (role === 'admin') {
      if (credentials.username === 'admin' && credentials.password === 'admin@123') {
        const adminUser: UserProfile = { id: 'admin', role: 'admin', fullName: 'Admin', email: '' };
        setUser(adminUser);
        toast({ title: "Login Successful", description: "Welcome, Admin!" });
        router.push('/dashboard/admin');
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid admin credentials." });
      }
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const fbUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        if (userData.role !== role) {
           await signOut(auth);
           throw new Error(`You are not registered as a ${role}.`);
        }
        setUser(userData);
        toast({ title: "Login Successful", description: `Welcome back!` });
        router.push(`/dashboard/${role}`);
      } else {
         await signOut(auth);
         throw new Error("User data not found. Please contact support.");
      }
    } catch (error: any) {
       const errorMessage = error.code ? 
          (error.code.includes('auth/invalid-credential') ? 'Invalid email or password.' : error.message)
          : error.message;
      toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
    }
  }, [router, toast]);

  const register = useCallback(async (details: any, role: 'patient' | 'doctor') => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
        const fbUser = userCredential.user;

        const userDocRef = doc(db, "users", fbUser.uid);
        
        let newUserProfile: Omit<UserProfile, 'id'>;

        if (role === 'patient') {
             newUserProfile = {
                fullName: details.fullName,
                email: details.email,
                role: 'patient',
                createdAt: serverTimestamp()
             };
        } else { // Doctor
             newUserProfile = {
                fullName: details.fullName,
                email: details.email,
                username: details.username,
                specialization: details.specialization,
                bio: details.bio,
                role: 'doctor',
                isApproved: false, // Doctors may need admin approval
                createdAt: serverTimestamp()
             };
        }

        await setDoc(userDocRef, { ...newUserProfile, id: fbUser.uid });
        await signOut(auth); // Sign out after registration to force login
        
        toast({ title: "Registration Successful", description: "Your account has been created. Please log in." });
        router.push(`/login/${role}`);

    } catch (error: any) {
        const errorMessage = error.code === 'auth/email-already-in-use' 
            ? 'An account with this email already exists.'
            : error.message;
        toast({ variant: "destructive", title: "Registration Failed", description: errorMessage });
    }
  }, [router, toast]);
  
  const logout = useCallback(async () => {
    if (user?.role === 'admin') {
       setUser(null);
    } else {
       await signOut(auth);
    }
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/');
  }, [router, toast, user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
