import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with real DB later
const projects = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    status: 'active',
    lastAction: 'Deploy to production',
    updated: new Date(),
  },
  {
    id: 'beta',
    name: 'Project Beta',
    status: 'pending',
    lastAction: 'Code review',
    updated: new Date(),
  },
];

export async function GET() {
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, owner, repo } = body;

    if (!name || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields: name, owner, repo' },
        { status: 400 }
      );
    }

    const newProject = {
      id: repo.toLowerCase(),
      name,
      status: 'pending',
      lastAction: `Imported from ${owner}/${repo}`,
      updated: new Date(),
      github: { owner, repo },
    };

    projects.push(newProject);
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}