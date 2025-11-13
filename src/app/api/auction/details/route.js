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

    const formattedData = {
        name: auction.name,
        tagline: auction.theme || "Tournament", 
        // NEW: Send the real logoUrl from the database
        logoUrl: auction.logoUrl, 
        purse: auction.budget,
        bidIncrement: 'Dynamic',
        ground: 'Main Ground',
        teams: auction.teams.map(t => ({
            id: t.id,
            name: t.name,
            purse: t.purseBalance,
            accessCode: t.accessCode
        })),
        players: auction.players.map(p => ({
            id: p.id,
            name: p.name,
            role: p.category,
            price: p.basePrice,
            image: '' 
        }))
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}