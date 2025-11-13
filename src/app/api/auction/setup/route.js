import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { leagueId, theme, date, budget, teams, players } = await request.json();

    // 1. Prepare Team Data
    const teamCreates = teams.map(teamName => ({
      name: teamName,
      accessCode: Math.random().toString(36).slice(-6).toUpperCase(),
      purseBalance: parseFloat(budget) // Use the purse from setup
    }));

    // 2. Prepare Player Data (if any)
    const playerCreates = players ? players.map(p => ({
      name: p.name,
      category: p.category,
      basePrice: p.basePrice,
      isSold: false
    })) : [];

    // 3. Update Auction in Transaction
    const updatedAuction = await prisma.auction.update({
      where: { id: leagueId },
      data: {
        theme,
        eventDate: new Date(date),
        budget: parseFloat(budget),
        status: "SETUP", 
        teams: {
          create: teamCreates
        },
        players: {
          create: playerCreates // Create players linked to this auction
        }
      },
      include: { teams: true } 
    });

    return NextResponse.json({ success: true, teams: updatedAuction.teams });

  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ success: false, message: "Setup failed: " + error.message }, { status: 500 });
  }
}