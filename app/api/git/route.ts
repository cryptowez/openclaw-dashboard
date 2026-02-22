import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

function githubHeaders(token?: string) {
  const resolvedToken = token || process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
  } as Record<string, string>;
}

// GET /api/git?action=list&owner=...&repo=...&branch=...
// GET /api/git?action=file&owner=...&repo=...&path=...&branch=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const token = request.headers.get('X-GitHub-Token') ?? undefined;

  if (!owner || !repo) {
    return NextResponse.json({ error: 'owner and repo are required' }, { status: 400 });
  }

  try {
    if (action === 'list') {
      const branch = searchParams.get('branch') ?? 'HEAD';
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: githubHeaders(token) }
      );
      if (!res.ok) {
        const err = await res.json();
        return NextResponse.json({ error: err.message ?? 'GitHub API error' }, { status: res.status });
      }
      const data = await res.json();
      const files = (data.tree as { path: string; type: string; sha: string; size?: number }[])
        .filter((item) => item.type === 'blob')
        .map(({ path, sha, size }) => ({ path, sha, size }));
      return NextResponse.json({ files, truncated: data.truncated ?? false });
    }

    if (action === 'file') {
      const path = searchParams.get('path');
      const branch = searchParams.get('branch') ?? '';
      if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 });

      const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}${branch ? `?ref=${branch}` : ''}`;
      const res = await fetch(url, { headers: githubHeaders(token) });
      if (!res.ok) {
        const err = await res.json();
        return NextResponse.json({ error: err.message ?? 'GitHub API error' }, { status: res.status });
      }
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return NextResponse.json({ path, content, sha: data.sha, encoding: 'utf-8' });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}

interface PushBody {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
  sha?: string; // required when updating an existing file
  githubToken?: string;
}

// POST /api/git  { action: 'push', ...PushBody }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action !== 'push') {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const { owner, repo, path, content, message, branch, sha, githubToken } = body as PushBody;
    if (!owner || !repo || !path || content == null || !message) {
      return NextResponse.json(
        { error: 'owner, repo, path, content, and message are required' },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      message,
      content: Buffer.from(content).toString('base64'),
      ...(branch ? { branch } : {}),
      ...(sha ? { sha } : {}),
    };

    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { ...githubHeaders(githubToken), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message ?? 'GitHub API error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      path,
      sha: data.content.sha,
      commit: data.commit.sha,
      message: data.commit.message,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
