import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, message: "ID Missing" }, { status: 400 });

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { teams: true, players: true }
    });

    if (!auction) return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });

    // Resolve Active Player
    const activePlayer = auction.activePlayerId 
        ? auction.players.find(p => p.id === auction.activePlayerId) 
        : null;

    // Resolve Current Bidder
    const currentBidder = auction.currentBidderId 
        ? auction.teams.find(t => t.id === auction.currentBidderId) 
        : null;

    const formattedData = {
        name: auction.name,
        logoUrl: auction.logoUrl, 
        purse: auction.budget,
        // --- LIVE STATE ---
        currentBid: auction.currentBid,
        currentBidder: currentBidder ? { id: currentBidder.id, name: currentBidder.name, color: currentBidder.themeColor || '#E62E2E' } : null,
        activePlayer: activePlayer ? {
            id: activePlayer.id,
            name: activePlayer.name,
            role: activePlayer.category,
            price: activePlayer.basePrice,
            image: activePlayer.image || ''
        } : null,
        // ------------------
        
        fluxData: auction.fluxData ? JSON.parse(auction.fluxData) : { state: 'IDLE' },
        
        teams: auction.teams.map(t => ({
            id: t.id,
            name: t.name,
            purse: t.purseBalance,
            themeColor: t.themeColor || '#E62E2E',
            logoUrl: t.logoUrl
        })),
        
        players: auction.players.sort((a, b) => a.order - b.order).map(p => ({
            id: p.id,
            name: p.name,
            role: p.category, 
            price: p.basePrice,
            isSold: p.isSold,
            soldPrice: p.soldPrice,
            teamId: p.teamId,
            // Add team name for ticker
            teamName: p.teamId ? auction.teams.find(t => t.id === p.teamId)?.name : null, 
            image: '' 
        }))
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}