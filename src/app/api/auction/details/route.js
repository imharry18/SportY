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
        // Include players if you connect them in schema later. 
        // For now, players might be fetched via Mongo or separate relation.
      }
    });

    if (!auction) return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });

    // Transform data to match frontend structure
    const formattedData = {
        name: auction.name,
        tagline: "Official Tournament", // Add tagline to DB Schema if needed
        purse: auction.budget,
        teams: auction.teams,
        players: [] // Fetch players here if stored in Postgres/Mongo
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}