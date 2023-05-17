import './globals.css'
import {Roboto_Flex as Roboto, Bai_Jamjuree as BaiJamJuree, Inter} from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], variable: "--font-roboto" })
const baiJamJuree = BaiJamJuree({ subsets: ['latin'],weight:"700", variable: "--font-baiJamJuree"  })

export const metadata = {
  title: 'NLW Spacetime',
  description: 'Uma capsula do tempo construida com Next, ts e tailwind',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamJuree.variable} font-sans text-gray-100 bg-gray-900`}>{children}</body>
    </html>
  )
}
