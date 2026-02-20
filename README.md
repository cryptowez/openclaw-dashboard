# OpenClaw Dashboard

A Next.js-based dashboard for managing OpenClaw projects and AI interactions.

## Features

- Project management with status tracking
- AI command interface for project modifications
- GitHub repository import
- Code preview with syntax highlighting
- Real-time deployment status
- Master log view

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons
- Vercel (deployment)

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

## Deployment

The application is designed to be deployed on Vercel. You can deploy it using:

1. Vercel Web Interface:
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Follow the deployment steps

2. Vercel CLI:
   ```bash
   vercel login
   vercel deploy --prod
   ```

## Environment Variables

```env
OPENROUTER_API_KEY=your_api_key_here
```

## Project Structure

```
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
├── lib/              # Utility functions
├── public/           # Static assets
└── types/            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License