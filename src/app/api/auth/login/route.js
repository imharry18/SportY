import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Check if user exists in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 2. Check Password (In a real app, you would compare hashed passwords here)
    // For now, we compare directly since we haven't built the register hashing yet.
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Success! Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      message: "Login successful" 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}