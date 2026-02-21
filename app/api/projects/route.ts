import { NextResponse } from 'next/server';
import { Project } from '@/types';

// Mock getProjects function - replace with actual database call
async function getProjects(): Promise<Project[]> {
  return []; // Replace with actual implementation
}

export async function GET() {
  const projects = await getProjects();
  // Return only necessary fields
  return NextResponse.json(
    projects.map(({ id, name, status, lastAction }) => ({
      id,
      name,
      status,
      lastAction,
    }))
  );
}