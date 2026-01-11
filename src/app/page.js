'use client';

// Section Imports
import LandingHero from "@/components/sections/LandingHero";
import EventManagementSection from "@/components/sections/EventManagement";
import AuctionShowcase from "@/components/sections/AuctionShowcase";
import BlitzShowcase from "@/components/sections/BlitzShowcase"; // <--- Import New Component
import SportsSection from "@/components/sections/Sports";
import Footer from "@/components/layout/Footer";

export default function Lobby() {
  return (
    <div className="flex flex-col">
      
      <LandingHero />

      <main className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-24">
        
        <EventManagementSection />

        <AuctionShowcase />

        <BlitzShowcase /> 

        <SportsSection />

      </main>

      <Footer />

    </div>
  );
}