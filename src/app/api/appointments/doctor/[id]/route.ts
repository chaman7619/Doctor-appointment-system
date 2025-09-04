
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id;
    const data = await db.read();
    const appointments = data.appointments.filter(apt => apt.doctorId === doctorId);
    
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
