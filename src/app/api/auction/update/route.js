// src/app/api/auction/update/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, adminKey, name, tagline, logoUrl, purse, bidIncrement, ground, teams, players } = body;

    // 1. Verify credentials
    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction || auction.passcode !== adminKey) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    // 2. Transaction update
    await prisma.$transaction(async (tx) => {
      
      // A. Update Auction Metadata (Including new fields)
      await tx.auction.update({
        where: { id },
        data: {
          name,
          theme: tagline,
          logoUrl: logoUrl || auction.logoUrl,
          budget: parseFloat(purse),
          ground: ground,           // Now saving Ground
          bidIncrement: bidIncrement // Now saving Bid Type
        }
      });

      // B. Handle Teams (Create, Update, DELETE)
      const payloadTeamIds = teams
        .filter(t => typeof t.id === 'string' && t.id.length > 15)
        .map(t => t.id);

      // Delete removed teams
      await tx.team.deleteMany({
        where: {
          auctionId: id,
          id: { notIn: payloadTeamIds }
        }
      });

      // Upsert Teams
      for (const team of teams) {
        const isNewTeam = String(team.id).length < 15; 

        if (isNewTeam) {
          await tx.team.create({
            data: {
              name: team.name,
              purseBalance: parseFloat(team.purse),
              accessCode: team.accessCode || Math.random().toString(36).slice(-6).toUpperCase(),
              auctionId: id
            }
          });
        } else {
          await tx.team.update({
            where: { id: team.id },
            data: { 
                name: team.name,
                purseBalance: parseFloat(team.purse),
                accessCode: team.accessCode
            }
          });
        }
      }

      // C. Handle Players (Create, Update, DELETE)
      
      // 1. Identify IDs of players currently in the payload
      const payloadPlayerIds = players
        .filter(p => typeof p.id === 'string' && p.id.length > 15)
        .map(p => p.id);

      // 2. Delete players from DB that are NOT in the payload
      await tx.player.deleteMany({
        where: {
          auctionId: id,
          id: { notIn: payloadPlayerIds }
        }
      });

      // 3. Upsert Players
      for (const player of players) {
        const isNewPlayer = String(player.id).length < 15;

        if (isNewPlayer) {
          await tx.player.create({
            data: {
              name: player.name,
              category: player.role || 'Player',
              basePrice: parseFloat(player.price || 0),
              isSold: false,
              auctionId: id,
              // image: player.image // Uncomment if added to schema
            }
          });
        } else {
          await tx.player.update({
            where: { id: player.id },
            data: {
              name: player.name,
              category: player.role,
              basePrice: parseFloat(player.price),
              // image: player.image // Uncomment if added to schema
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "Tournament saved successfully" });

  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ success: false, message: "Database update failed: " + error.message }, { status: 500 });
  }
}