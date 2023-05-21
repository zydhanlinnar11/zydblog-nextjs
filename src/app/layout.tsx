import { Metadata } from 'next'
import './globals.scss'
import { Roboto_Flex } from 'next/font/google'
import Navigation from '@/components/Navigation'

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--md-ref-typeface-plain',
})

export const metadata: Metadata = {
  title: 'Zydhan Linnar Putra',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={robotoFlex.variable}>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
