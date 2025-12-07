import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, budget, passcode } = body;

    // Save to PostgreSQL
    const newAuction = await prisma.auction.create({
      data: {
        name,
        budget: parseFloat(budget),
        passcode,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, auction: newAuction }, { status: 201 });
  } catch (error) {
    console.error("Auction Create Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create auction" }, { status: 500 });
  }
}