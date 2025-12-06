'use client';

// Section Imports
import LandingHero from "@/components/sections/LandingHero";
import EventManagementSection from "@/components/sections/EventManagement";
import AuctionShowcase from "@/components/sections/AuctionShowcase";
import SportsSection from "@/components/sections/Sports";
import Footer from "@/components/layout/Footer";

export default function Lobby() {
  return (
    <div className="flex flex-col">
      
      {/* 1. HERO SECTION (What is SportY?) */}
      <LandingHero />

      <main className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-24">
        
        {/* 2. EVENT SECTION (Creation + My Tournaments) */}
        <EventManagementSection />

        {/* 3. AUCTION SECTION (The Bidding Engine) */}
        <AuctionShowcase />

        {/* 4. ARENAS SECTION (Sports Grid) */}
        <SportsSection />

      </main>

      {/* 5. FOOTER */}
      <Footer />

    </div>
  );
}