import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";

export const metadata = {
  title: "SportY | Enterprise League OS",
  description: "The next-gen platform for college sports management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts Loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=Rajdhani:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-dark-bg text-white font-sans antialiased selection:bg-brand/30 min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* 1. Global Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-gradient"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        {/* 2. Layout Structure */}
        <Navbar />
        <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 pb-24">
            {children}
        </main>
      </body>
    </html>
  );
}