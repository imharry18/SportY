import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body; // Added fullName support if you want it

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing email or password" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // 2. Hash the password (Security Fix)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Store the HASH, not the plain text
        fullName: fullName || null,
        role: "PLAYER", // Default role
      }
    });

    // 4. Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}