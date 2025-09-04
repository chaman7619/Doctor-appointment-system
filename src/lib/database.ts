
export interface Patient {
  id: string; // This will be the Firebase Auth UID
  fullName: string;
  email: string;
  role: 'patient';
}

export interface Doctor {
  id: string; // This will be the Firebase Auth UID
  fullName: string;
  email: string;
  username: string;
  specialization: string;
  bio: string;
  role: 'doctor';
}

// This represents the structure of the user document in Firestore
export type UserProfile = Patient | (Doctor & { isApproved: boolean });

export interface Appointment {
  id: string; // Firestore document ID
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'upcoming' | 'completed' | 'canceled';
}
