
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const data = await db.read();
    const publicDoctors = data.doctors.map(({ password, ...doctor }) => doctor);
    return NextResponse.json(publicDoctors, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
