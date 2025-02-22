import './globals.css';
import './wonderstyles/fonts.css';
import './wonderstyles/images.css';
import './wonderstyles/mobile.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TabAsCoin',
  description: 'Convert your handmade art into digital currency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
