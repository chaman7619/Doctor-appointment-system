
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = await db.read();
    const doctor = data.doctors.find((d) => d.username === username && d.password === password);

    if (!doctor) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Return doctor data without the password
    const { password: _, ...doctorData } = doctor;

    return NextResponse.json(doctorData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
