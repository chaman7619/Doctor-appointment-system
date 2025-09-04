
import { NextResponse } from 'next/server';
import { db, type Appointment } from '@/lib/database';
import { randomUUID } from 'crypto';

// GET all appointments (for Admin)
export async function GET() {
    try {
        const data = await db.read();
        return NextResponse.json(data.appointments, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// POST a new appointment (for Patients)
export async function POST(request: Request) {
  try {
    const { patientId, doctorId, date, time } = await request.json();

    if (!patientId || !doctorId || !date || !time) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = await db.read();

    const patient = data.patients.find(p => p.id === patientId);
    const doctor = data.doctors.find(d => d.id === doctorId);

    if (!patient || !doctor) {
        return NextResponse.json({ message: 'Invalid patient or doctor ID' }, { status: 404 });
    }

    const existingAppointment = data.appointments.find(
        apt => apt.doctorId === doctorId && apt.date === date && apt.time === time && apt.status === 'upcoming'
    );

    if (existingAppointment) {
        return NextResponse.json({ message: 'This time slot is already booked.' }, { status: 409 });
    }

    const newAppointment: Appointment = {
      id: randomUUID(),
      patientId,
      doctorId,
      patientName: patient.fullName,
      doctorName: doctor.fullName,
      date,
      time,
      status: 'upcoming',
    };

    data.appointments.push(newAppointment);
    await db.write(data);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
