import './globals.css'

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
      <body
        className="h-screen overflow-hidden m-0 p-0"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  )
}