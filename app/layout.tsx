import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'لپ‌تاپ‌گزین | راهنمای هوشمند خرید لپ‌تاپ',
  description: 'راهنمای هوشمند و شخصی‌سازی شده خرید لپ‌تاپ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="text-gray-800 pb-24">
        {children}
      </body>
    </html>
  )
}
