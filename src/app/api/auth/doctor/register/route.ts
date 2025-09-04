
import { NextResponse } from 'next/server';
import { db, type Doctor } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { fullName, email, username, password, specialization, bio } = await request.json();

    if (!fullName || !email || !username || !password || !specialization || !bio) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = await db.read();

    const existingByEmail = data.doctors.find((d) => d.email === email) || data.patients.find((p) => p.email === email);
    if (existingByEmail) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    const existingByUsername = data.doctors.find((d) => d.username === username);
    if (existingByUsername) {
      return NextResponse.json({ message: 'This username is already taken' }, { status: 409 });
    }

    const newDoctor: Doctor = {
      id: randomUUID(),
      fullName,
      email,
      username,
      password, // In a real app, hash this password
      specialization,
      bio,
      role: 'doctor',
    };

    data.doctors.push(newDoctor);
    await db.write(data);

    return NextResponse.json({ message: 'Doctor registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
