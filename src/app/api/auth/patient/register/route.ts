
import { NextResponse } from 'next/server';
import { db, type Patient } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = await db.read();

    const existingPatient = data.patients.find((p) => p.email === email);
    if (existingPatient) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }
    
    const existingDoctor = data.doctors.find((d) => d.email === email);
    if (existingDoctor) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    const newPatient: Patient = {
      id: randomUUID(),
      fullName,
      email,
      password, // In a real app, hash this password
      role: 'patient',
    };

    data.patients.push(newPatient);
    await db.write(data);

    return NextResponse.json({ message: 'Patient registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
