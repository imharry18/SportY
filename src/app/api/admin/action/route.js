import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { action, auctionId, playerId, teamId, amount, playerData } = await request.json();

    // Helper: Move sold player to bottom of the list
    const moveToEnd = async (pId, aId) => {
        const lastPlayer = await prisma.player.findFirst({
            where: { auctionId: aId },
            orderBy: { order: 'desc' }
        });
        const newOrder = (lastPlayer?.order || 0) + 1;
        await prisma.player.update({ where: { id: pId }, data: { order: newOrder } });
    };

    // Helper: Set NEXT unsold player as active
    const setNextActive = async (aId) => {
        const nextPlayer = await prisma.player.findFirst({
            where: { auctionId: aId, isSold: false },
            orderBy: { order: 'asc' }
        });
        
        // If a player is found, set them active. If none, clear active state.
        await prisma.auction.update({
            where: { id: aId },
            data: { 
                activePlayerId: nextPlayer ? nextPlayer.id : null,
                currentBid: 0,
                currentBidderId: null,
                fluxData: JSON.stringify({ state: 'IDLE' }) // Ensure flux is cleared
            }
        });
    };

    // 1. SET ACTIVE PLAYER
    if (action === 'SET_ACTIVE') {
        await prisma.auction.update({
            where: { id: auctionId },
            data: { 
                activePlayerId: playerId, 
                currentBid: 0, 
                currentBidderId: null,
                fluxData: JSON.stringify({ state: 'IDLE' }) 
            }
        });
        return NextResponse.json({ success: true });
    }

    // 2. PLACE BID
    if (action === 'PLACE_BID') {
        await prisma.auction.update({
            where: { id: auctionId },
            data: { currentBid: parseFloat(amount), currentBidderId: teamId }
        });
        return NextResponse.json({ success: true });
    }

    // 3. SELL PLAYER (Auto-Advance Added)
    if (action === 'SELL') {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (team.purseBalance < amount) return NextResponse.json({ success: false, message: "Insufficient Purse!" }, { status: 400 });

      // 1. Mark Sold
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

      // 2. Move to bottom
      await moveToEnd(playerId, auctionId);

      // 3. Auto-Advance to next unsold player
      await setNextActive(auctionId);

      return NextResponse.json({ success: true });
    }

    // 4. UNDO SELL
    if (action === 'UNDO_SELL') {
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        if (!player || !player.isSold) return NextResponse.json({ success: false }, { status: 400 });

        await prisma.$transaction([
            prisma.team.update({ where: { id: player.teamId }, data: { purseBalance: { increment: player.soldPrice } } }),
            prisma.player.update({ where: { id: playerId }, data: { isSold: false, soldPrice: null, teamId: null } })
        ]);
        return NextResponse.json({ success: true });
    }

    // 5. ADD PLAYER
    if (action === 'ADD_PLAYER') {
      const last = await prisma.player.findFirst({ where: { auctionId }, orderBy: { order: 'desc' } });
      const newPlayer = await prisma.player.create({
        data: {
          auctionId,
          name: playerData.name,
          category: playerData.role,
          basePrice: parseFloat(playerData.price),
          order: (last?.order || 0) + 1,
          isSold: false
        }
      });
      return NextResponse.json({ success: true, player: newPlayer });
    }

    // 6. EDIT/DELETE (Standard)
    if (action === 'EDIT_PLAYER') {
        await prisma.player.update({ where: { id: playerId }, data: { name: playerData.name, category: playerData.role, basePrice: parseFloat(playerData.price) } });
        return NextResponse.json({ success: true });
    }
    if (action === 'DELETE_PLAYER') {
      await prisma.player.delete({ where: { id: playerId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}