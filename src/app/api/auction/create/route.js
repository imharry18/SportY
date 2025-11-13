import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    // NEW: Destructure logoUrl from the request body
    const { id, name, passcode, logoUrl } = body; 

    if (!id || !name || !passcode) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newAuction = await prisma.auction.create({
      data: {
        id: id,
        name,
        // NEW: Save the logo URL. If none is provided, it will be null.
        logoUrl: logoUrl || null, 
        budget: 50000000,
        passcode,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, auction: newAuction }, { status: 201 });
  } catch (error) {
    console.error("Auction Create Error:", error);
    if (error.code === 'P2002') {
        return NextResponse.json({ success: false, message: "League ID collision. Please try again." }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Failed to create auction" }, { status: 500 });
  }
}