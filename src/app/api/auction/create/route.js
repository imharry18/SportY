import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, passcode } = body; // We now accept 'id' from frontend

    if (!id || !name || !passcode) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Save to PostgreSQL with your Custom ID
    const newAuction = await prisma.auction.create({
      data: {
        id: id, // Explicitly set the ID (ABC-DEF...)
        name,
        budget: 50000000, // Default budget, can be changed in setup
        passcode,
        status: "PENDING" // Starts as pending
      }
    });

    return NextResponse.json({ success: true, auction: newAuction }, { status: 201 });
  } catch (error) {
    console.error("Auction Create Error:", error);
    // Handle duplicate ID error specifically
    if (error.code === 'P2002') {
        return NextResponse.json({ success: false, message: "League ID collision. Please try again." }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Failed to create auction" }, { status: 500 });
  }
}