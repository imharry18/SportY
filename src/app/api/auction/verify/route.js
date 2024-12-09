import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    // Note: The frontend sends 'leagueId' but database column is 'id'
    const { leagueId, passcode, role } = await request.json();

    // 1. Find Auction
    const auction = await prisma.auction.findUnique({
      where: { id: leagueId }, // Search by your custom ID
      include: { teams: true } 
    });

    if (!auction) {
      return NextResponse.json({ success: false, message: "League ID not found." }, { status: 404 });
    }

    // --- LOGIC FOR SETUP (The only role allowed when PENDING) ---
    if (role === 'SETUP' || role === 'EDIT') {
      if (auction.passcode !== passcode) {
        return NextResponse.json({ success: false, message: "Invalid Admin Passcode." }, { status: 401 });
      }
      // Setup is always allowed, redirects to setup page
      return NextResponse.json({ success: true, redirect: `/setup-auction?id=${leagueId}&key=${passcode}` });
    }

    // --- LOGIC FOR ADMIN (Must be setup first) ---
    if (role === 'ADMIN') {
        if (auction.status === 'PENDING') {
            return NextResponse.json({ success: false, message: "Lobby not set up yet. Use 'Setup Auction' first." }, { status: 403 });
        }
        if (auction.passcode !== passcode) {
            return NextResponse.json({ success: false, message: "Invalid Admin Passcode." }, { status: 401 });
        }
        return NextResponse.json({ success: true, redirect: `/admin/dashboard` });
    }

    // --- LOGIC FOR TEAMS (Must be setup first) ---
    if (role === 'TEAM') {
      if (auction.status === 'PENDING') {
        return NextResponse.json({ success: false, message: "Auction has not started yet." }, { status: 403 });
      }
      
      // For teams, the "passcode" input is treated as their Team Access Code
      const team = auction.teams.find(t => t.accessCode === passcode);
      
      if (!team) {
        return NextResponse.json({ success: false, message: "Invalid Team Code." }, { status: 401 });
      }

      return NextResponse.json({ success: true, redirect: `/team/dashboard` });
    }

    // --- LOGIC FOR SPECTATORS ---
    if (role === 'SPECTATOR') {
        if (auction.status === 'PENDING') {
            return NextResponse.json({ success: false, message: "Lobby is not live yet." }, { status: 403 });
        }
        // Logic for spectator password if you have one, or just allow
        return NextResponse.json({ success: true, redirect: `/spectator/view` });
    }

    return NextResponse.json({ success: false, message: "Invalid Role" }, { status: 400 });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}