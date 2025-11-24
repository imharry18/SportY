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

    // --- LOGIC FOR SETUP & EDIT ---
    if (role === 'SETUP' || role === 'EDIT') {
      if (auction.passcode !== passcode) {
        return NextResponse.json({ success: false, message: "Invalid Admin Passcode." }, { status: 401 });
      }
      const targetPage = role === 'EDIT' ? '/modify-auction' : '/setup-auction';
      return NextResponse.json({ 
        success: true, 
        redirect: `${targetPage}?id=${leagueId}&key=${passcode}` 
      });
    }

    // --- LOGIC FOR ADMIN ---
    if (role === 'ADMIN') {
        if (auction.status === 'PENDING') {
            return NextResponse.json({ success: false, message: "Lobby not set up yet." }, { status: 403 });
        }
        if (auction.passcode !== passcode) {
            return NextResponse.json({ success: false, message: "Invalid Admin Passcode." }, { status: 401 });
        }
        return NextResponse.json({ success: true, redirect: `/admin/dashboard` });
    }

    // --- LOGIC FOR TEAMS ---
    if (role === 'TEAM') {
      if (auction.status === 'PENDING') {
        return NextResponse.json({ success: false, message: "Auction has not started yet." }, { status: 403 });
      }
      
      const team = auction.teams.find(t => t.accessCode === passcode);
      
      if (!team) {
        return NextResponse.json({ success: false, message: "Invalid Team Code." }, { status: 401 });
      }

      // SEND TEAM DATA BACK
      return NextResponse.json({ 
          success: true, 
          redirect: `/team/dashboard`,
          teamData: {
              id: team.id,
              name: team.name,
              auctionId: auction.id,
              auctionName: auction.name,
              purse: team.purseBalance,
              logoUrl: team.logoUrl,
              themeColor: team.themeColor || '#E62E2E' // NEW: Send Color
          }
      });
    }

    // --- LOGIC FOR SPECTATORS ---
    if (role === 'SPECTATOR') {
        if (auction.status === 'PENDING') {
            return NextResponse.json({ success: false, message: "Lobby is not live yet." }, { status: 403 });
        }
        return NextResponse.json({ success: true, redirect: `/spectator/view` });
    }

    return NextResponse.json({ success: false, message: "Invalid Role" }, { status: 400 });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}