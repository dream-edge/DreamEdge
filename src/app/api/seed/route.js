import { NextResponse } from 'next/server';
import runSeed from '../../../lib/seed-data'; // Adjust path as necessary

export async function GET(request) {
  // Protect this route to only run in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'Seeding is only allowed in development mode.' },
      { status: 403 }
    );
  }

  try {
    console.log('Attempting to run database seed...');
    const result = await runSeed();
    
    if (result.success) {
      console.log('Database seeding successful via API route.');
      return NextResponse.json(
        { success: true, message: result.message || 'Database seeded successfully.' },
        { status: 200 }
      );
    } else {
      console.error('Database seeding failed via API route:', result.message);
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to seed database.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in /api/seed route:', error);
    return NextResponse.json(
      { success: false, message: `An error occurred during seeding: ${error.message}` },
      { status: 500 }
    );
  }
} 