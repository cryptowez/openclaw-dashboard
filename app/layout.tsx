import './globals.css'
import AppShell from '../components/AppShell'

export const metadata = {
  title: 'OpenClaw Dashboard',
  description: 'Personal AI coding assistant — self-hosted Emergent alternative',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}