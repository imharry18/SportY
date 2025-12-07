import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // 1. Check existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // 2. Create User (Minimal Data)
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        role: "PLAYER", // Default role
        // All other fields are null/0 by default from schema
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    // This logs the real error to your VS Code terminal so you can see it
    return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
  }
}