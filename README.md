
# MediTrack

This is a complete, demo-ready hospital management web application built with Next.js. The application features three distinct user roles: Admin, Doctors, and Patients.

## Core Features

- **Role-Based Authentication**: Secure authentication for Admins, Doctors, and Patients with role-specific dashboards.
- **Data Persistence**: All user accounts and appointments are stored in a local `db.json` file, acting as a mock database, so data persists between sessions.
- **Patient Portal**: Patients can register, log in, browse doctors, book new appointments, view their appointment history, and cancel upcoming appointments.
- **Doctor Portal**: Doctors can register, log in, and view all appointments scheduled for them.
- **Admin Dashboard**: A comprehensive overview panel for the admin to view master lists of all patients, doctors, and appointments in the system.

## Getting Started

### 1. Install Dependencies

First, install the necessary npm packages:

```bash
npm install
```

### 2. Run the Development Server

Next, run the development server. This single command starts the entire Next.js application, including the mock backend API.

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### 3. Using the Application

#### Admin Access

The system has a single, fixed admin account. No registration is needed for the admin.

- **Username**: `admin`
- **Password**: `admin@123`

#### Doctor and Patient Accounts

To test the Doctor and Patient functionalities, you will need to create new accounts.

- Navigate to the **Doctor Login** or **Patient Login** portals from the homepage.
- Click the "Sign Up" link to access the registration form.
- Create as many patient and doctor accounts as you need to test the application features.

