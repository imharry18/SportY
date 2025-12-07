import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // 2. Create the new user
    // Note: In a production app, you MUST hash the password here (using bcrypt).
    // For now, we store it directly as requested for simplicity.
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        role: "TEAM_OWNER", // Default role for new signups
      }
    });

    // 3. Return success (exclude password from response)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      message: "Account created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}