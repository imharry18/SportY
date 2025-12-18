import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { leagueId, passcode, role } = await request.json();

    // 1. Find Auction
    const auction = await prisma.auction.findUnique({
      where: { id: leagueId },
      include: { teams: true } 
    });

    if (!auction) {
      return NextResponse.json({ success: false, message: "League ID not found." }, { status: 404 });
    }

    // 2. Logic for ADMIN / SETUP / EDIT
    if (role === 'ADMIN' || role === 'SETUP') {
      if (auction.passcode !== passcode) {
        return NextResponse.json({ success: false, message: "Invalid Admin Passcode." }, { status: 401 });
      }

      // Special Check for Admin: Must be SETUP first
      if (role === 'ADMIN' && auction.status === 'PENDING') {
        return NextResponse.json({ success: false, message: "Auction not initialized. Please Run Setup first." }, { status: 403 });
      }

      return NextResponse.json({ success: true, redirect: role === 'SETUP' ? `/setup-auction?id=${leagueId}` : `/admin/dashboard` });
    }

    // 3. Logic for TEAM
    if (role === 'TEAM') {
      // For teams, the "passcode" input is treated as their Team Access Code
      const team = auction.teams.find(t => t.accessCode === passcode);
      
      if (!team) {
        return NextResponse.json({ success: false, message: "Invalid Team Code." }, { status: 401 });
      }

      if (auction.status === 'PENDING') {
        return NextResponse.json({ success: false, message: "Auction has not started yet." }, { status: 403 });
      }

      return NextResponse.json({ success: true, redirect: `/team/dashboard` });
    }

    return NextResponse.json({ success: false, message: "Invalid Role" }, { status: 400 });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}