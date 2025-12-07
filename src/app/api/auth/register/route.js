import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    // Destructure all the new fields
    const { email, password, fullName, age, playerRole, battingStyle, bowlingStyle } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        fullName,
        age: parseInt(age),
        role: "PLAYER", // Defaulting to PLAYER now
        playerRole,
        battingStyle,
        bowlingStyle,
        matches: 0,
        runs: 0,
        wickets: 0
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}