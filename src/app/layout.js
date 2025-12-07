import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar'; // Import the new component
import './globals.css';

// Load fonts globally if you prefer
import { Inter, Rajdhani } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const rajdhani = Rajdhani({ 
  weight: ['500', '600', '700'], 
  subsets: ['latin'], 
  variable: '--font-tech' 
});

export const metadata = {
  title: 'SportY - CPL Season 3',
  description: 'Campus Premier League Auction Console',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="font-sans bg-[#050505] text-white">
        <AuthProvider>
           {/* The Navbar sits here, available on every page */}
           <Navbar /> 
           
           <main className="relative z-10 w-full mx-auto">
              {children}
           </main>
        </AuthProvider>
      </body>
    </html>
  );
}