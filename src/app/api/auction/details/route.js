import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, message: "ID Missing" }, { status: 400 });

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { 
        teams: true,
        players: true
      }
    });

    if (!auction) return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });

    // SORT PLAYERS BY ORDER
    const sortedPlayers = auction.players.sort((a, b) => a.order - b.order);

    const formattedData = {
        name: auction.name,
        tagline: auction.theme || "", 
        logoUrl: auction.logoUrl, 
        purse: auction.budget,
        bidIncrement: auction.bidIncrement || 'Dynamic',
        ground: auction.ground || '',
        
        // --- FIX: Send Flux Data to prevent crash ---
        fluxData: auction.fluxData ? JSON.parse(auction.fluxData) : { state: 'IDLE' },
        
        teams: auction.teams.map(t => ({
            id: t.id,
            name: t.name,
            purse: t.purseBalance,
            accessCode: t.accessCode,
            themeColor: t.themeColor || '#E62E2E',
            logoUrl: t.logoUrl
        })),
        players: sortedPlayers.map(p => ({
            id: p.id,
            name: p.name,
            role: p.category, 
            price: p.basePrice,
            isSold: p.isSold,
            soldPrice: p.soldPrice,
            teamId: p.teamId,
            order: p.order, 
            image: '' 
        }))
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}