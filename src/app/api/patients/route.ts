
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const data = await db.read();
    const publicPatients = data.patients.map(({ password, ...patient }) => patient);
    return NextResponse.json(publicPatients, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
