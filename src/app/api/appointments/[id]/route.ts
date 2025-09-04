
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// PATCH to update an appointment (e.g., cancel)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const { status } = await request.json();

    if (status !== 'canceled') {
      return NextResponse.json({ message: 'Invalid status update' }, { status: 400 });
    }

    const data = await db.read();
    const appointmentIndex = data.appointments.findIndex((apt) => apt.id === appointmentId);

    if (appointmentIndex === -1) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    data.appointments[appointmentIndex].status = 'canceled';
    await db.write(data);

    return NextResponse.json(data.appointments[appointmentIndex], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
