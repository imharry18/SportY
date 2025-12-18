import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { leagueId, theme, date, teams } = await request.json();

    // 1. Generate Teams with Unique Codes
    // We do this in a transaction or sequential creates
    const teamCreates = teams.map(teamName => ({
      name: teamName,
      accessCode: Math.random().toString(36).slice(-6).toUpperCase(), // Random 6 char code
      purseBalance: 50000000 // Default, you can make this dynamic later
    }));

    // 2. Update Auction & Create Teams
    const updatedAuction = await prisma.auction.update({
      where: { id: leagueId },
      data: {
        theme,
        eventDate: new Date(date),
        status: "SETUP", // Mark as ready
        teams: {
          create: teamCreates
        }
      },
      include: { teams: true } // Return created teams so we can show codes
    });

    return NextResponse.json({ success: true, teams: updatedAuction.teams });

  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ success: false, message: "Setup failed: " + error.message }, { status: 500 });
  }
}