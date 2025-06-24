import { loadResumeData } from '../../../lib/resumeLoader';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resumeData = await loadResumeData();
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Error loading resume data:', error);
    return NextResponse.json(
      { error: 'Failed to load resume data' },
      { status: 500 }
    );
  }
}
