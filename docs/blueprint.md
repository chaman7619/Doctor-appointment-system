# **App Name**: MediTrack Pro

## Core Features:

- Role-Based Authentication: Secure authentication flows for Admin, Doctors, and Patients with distinct dashboards. Sessions persisted via localStorage.
- Patient Registration & Management: New patients can register with their information stored in the local JSON database.
- Doctor Registration & Management: Doctors can register, providing specialization and bio details, with all info saved in the local JSON database.
- Appointment Booking: Patients can book appointments with available doctors via the selection tool, specifying date and time.
- Appointment Management: Doctors and patients can view and manage their respective appointments, fetched dynamically from the JSON server.
- Admin Dashboard: A comprehensive dashboard displaying all patients, doctors, and appointments.
- User Notifications: Toast notifications confirm successful actions, providing feedback to users.

## Style Guidelines:

- Primary color: Calming Blue (#64B5F6) to evoke trust and serenity.
- Background color: Light Blue (#E3F2FD) to provide a clean, non-intrusive backdrop.
- Accent color: Soft Green (#81C784) for positive actions like booking confirmations.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a modern yet welcoming feel.
- Use professional and easily recognizable icons from a library like FontAwesome for actions and categories.
- Mobile-first responsive design, ensuring consistent experience across devices. Use Tailwind CSS grid system for optimal content arrangement.
- Subtle transitions and loading animations to improve user experience. React Transition Group can be used for implementing animations.