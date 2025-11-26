import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { action, auctionId, playerId, teamId, amount, playerData } = await request.json();

    // 1. SELL PLAYER
    if (action === 'SELL') {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      
      if (team.purseBalance < amount) {
        return NextResponse.json({ success: false, message: "Insufficient Purse Balance!" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.player.update({
          where: { id: playerId },
          data: { isSold: true, soldPrice: parseFloat(amount), teamId: teamId }
        }),
        prisma.team.update({
          where: { id: teamId },
          data: { purseBalance: { decrement: parseFloat(amount) } }
        })
      ]);

      return NextResponse.json({ success: true, message: "Player Sold" });
    }

    // --- NEW: UNDO SELL (Revert Transaction) ---
    if (action === 'UNDO_SELL') {
        // 1. Get current player state
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        
        if (!player || !player.isSold || !player.teamId) {
            return NextResponse.json({ success: false, message: "Player is not sold, cannot undo." }, { status: 400 });
        }

        // 2. Revert: Refund Team & Reset Player
        await prisma.$transaction([
            prisma.team.update({
                where: { id: player.teamId },
                data: { purseBalance: { increment: player.soldPrice } } // Refund money
            }),
            prisma.player.update({
                where: { id: playerId },
                data: { isSold: false, soldPrice: null, teamId: null } // Reset status
            })
        ]);

        return NextResponse.json({ success: true, message: "Sale Undone! Money Refunded." });
    }
    // -------------------------------------------

    // 3. UNSOLD
    if (action === 'UNSOLD') {
      // Logic for unsold (can be expanded later)
      return NextResponse.json({ success: true });
    }

    // 4. ADD PLAYER
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

    // 5. DELETE PLAYER
    if (action === 'DELETE_PLAYER') {
      await prisma.player.delete({ where: { id: playerId } });
      return NextResponse.json({ success: true });
    }

    // 6. EDIT PLAYER
    if (action === 'EDIT_PLAYER') {
        await prisma.player.update({
            where: { id: playerId },
            data: {
                name: playerData.name,
                category: playerData.role,
                basePrice: parseFloat(playerData.price),
            }
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    console.error("Admin Action Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}