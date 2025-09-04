
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = await db.read();
    const patient = data.patients.find((p) => p.email === email && p.password === password);

    if (!patient) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    
    // In a real app, you'd generate a JWT here.
    // For this demo, we return the user object without the password.
    const { password: _, ...patientData } = patient;

    return NextResponse.json(patientData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
