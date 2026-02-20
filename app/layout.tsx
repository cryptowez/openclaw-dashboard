import './globals.css'
import { Inter } from 'next/font/google'
import AppShell from '../components/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IoniqAI Dashboard',
  description: 'Command & Control UI for IoniqAI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}