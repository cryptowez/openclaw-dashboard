# OpenClaw Dashboard

A personal AI coding assistant dashboard — a self-hosted alternative to Emergent / Bolt.

## Features

- **AI Command Interface** — send prompts to any model via OpenRouter; see responses inline
- **Model Selection** — choose from fast (Haiku, GPT-4o-mini, Gemini Flash), balanced (Claude 3.5 Sonnet, GPT-4o), or powerful (Claude 3 Opus, o3-mini, DeepSeek R1) models per task
- **Git Pull / Push** — fetch a GitHub repo's file tree and push single-file commits directly via the GitHub API, no local git required
- **Project management** — create, import, and track projects with status and priority labels
- **Code preview** — browse and copy project files in a modal code viewer

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- OpenRouter (multi-model AI)
- GitHub REST API (git operations)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with:

```env
# Required — get a free key at https://openrouter.ai
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Required for git pull/push operations
# Create a Personal Access Token at https://github.com/settings/tokens
# Scopes needed: repo (or public_repo for public repos)
GITHUB_TOKEN=your_github_personal_access_token_here

NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment

The application can be deployed to any Node.js-capable host.

### Vercel (recommended)
1. Visit https://vercel.com/new and import your GitHub repository
2. Add the environment variables above in the Vercel project settings
3. Deploy

### Other hosts (Railway, Render, Fly.io, VPS, etc.)
```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai-command/route.ts   # OpenRouter AI proxy
│   │   └── git/route.ts          # GitHub API pull/push
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AICommandBox.tsx          # AI chat with model selector
│   ├── GitOpsPanel.tsx           # Pull/push UI
│   ├── ModelSelector.tsx         # Model dropdown
│   └── …
├── lib/
│   ├── openrouter.ts             # OpenRouter client + model list
│   └── …
└── types/
```

## License

MIT License