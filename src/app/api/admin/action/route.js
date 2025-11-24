import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { action, auctionId, playerId, teamId, amount, playerData } = await request.json();

    // 1. SELL PLAYER (Assign Team & Deduct Purse)
    if (action === 'SELL') {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      
      if (team.purseBalance < amount) {
        return NextResponse.json({ success: false, message: "Insufficient Purse Balance!" });
      }

      await prisma.$transaction([
        // Update Player
        prisma.player.update({
          where: { id: playerId },
          data: { isSold: true, soldPrice: parseFloat(amount), teamId: teamId }
        }),
        // Deduct Team Purse
        prisma.team.update({
          where: { id: teamId },
          data: { purseBalance: { decrement: parseFloat(amount) } }
        })
      ]);

      return NextResponse.json({ success: true, message: "Player Sold Successfully" });
    }

    // 2. UNSOLD (Mark as skipped/unsold)
    if (action === 'UNSOLD') {
      // You might want a specific flag for 'UNSOLD', for now we just skip
      // If you want to track unsold, add 'isUnsold' to schema or just leave isSold=false
      return NextResponse.json({ success: true, message: "Player marked Unsold" });
    }

    // 3. ADD PLAYER (Live Injection)
    if (action === 'ADD_PLAYER') {
      const newPlayer = await prisma.player.create({
        data: {
          auctionId,
          name: playerData.name,
          category: playerData.role,
          basePrice: parseFloat(playerData.price),
          isSold: false
        }
      });
      return NextResponse.json({ success: true, player: newPlayer });
    }

    // 4. DELETE PLAYER
    if (action === 'DELETE_PLAYER') {
      await prisma.player.delete({ where: { id: playerId } });
      return NextResponse.json({ success: true });
    }

    // 5. EDIT PLAYER
    if (action === 'EDIT_PLAYER') {
        await prisma.player.update({
            where: { id: playerId },
            data: {
                name: playerData.name,
                category: playerData.role,
                basePrice: parseFloat(playerData.price),
                // image: playerData.image // Uncomment if using images
            }
        });
        return NextResponse.json({ success: true });
    }

    // 6. MANUAL ASSIGN (Force Sell without bid logic)
    if (action === 'MANUAL_ASSIGN') {
        // Just link them, assume purse logic handled manually or strict override
        await prisma.player.update({
            where: { id: playerId },
            data: { isSold: true, teamId: teamId, soldPrice: parseFloat(amount || 0) }
        });
        // Also update purse
        await prisma.team.update({
            where: { id: teamId },
            data: { purseBalance: { decrement: parseFloat(amount || 0) } }
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    console.error("Admin Action Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}