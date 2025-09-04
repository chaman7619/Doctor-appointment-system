
import fs from 'fs/promises';
import path from 'path';

// Since API routes run on the server, we can use 'fs' to persist data to a local JSON file.
const dbPath = path.join(process.cwd(), 'db.json');

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Not sent to client
  role: 'patient';
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password?: string; // Not sent to client
  specialization: string;
  bio: string;
  role: 'doctor';
}

export interface Appointment {
  id:string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'upcoming' | 'completed' | 'canceled';
}

interface Db {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
}

async function readDb(): Promise<Db> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const initialDb: Db = { patients: [], doctors: [], appointments: [] };
      await writeDb(initialDb);
      return initialDb;
    }
    console.error('Failed to read database:', error);
    throw new Error('Could not read from database.');
  }
}

async function writeDb(data: Db): Promise<void> {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write to database:', error);
        throw new Error('Could not write to database.');
    }
}

export const db = {
  read: readDb,
  write: writeDb,
};
