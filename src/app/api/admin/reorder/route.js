import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { updates } = await request.json(); // Expects [{ id: 'p1', order: 1 }, ...]

    // Execute all updates in a transaction for safety
    await prisma.$transaction(
      updates.map(p => 
        prisma.player.update({
          where: { id: p.id },
          data: { order: p.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}