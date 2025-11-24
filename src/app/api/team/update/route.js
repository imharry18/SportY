import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { teamId, name, logoUrl, themeColor } = await request.json();

    if (!teamId) {
        return NextResponse.json({ success: false, message: "Team ID missing" }, { status: 400 });
    }

    const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
            name,
            logoUrl,
            themeColor
        }
    });

    return NextResponse.json({ success: true, team: updatedTeam });

  } catch (error) {
    console.error("Team Update Error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}