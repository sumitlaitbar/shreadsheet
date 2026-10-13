import { connectDB } from "@/lib/mongodb";
import User from "@/lib/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    
  try {
    await connectDB();
  
    const { email, password } = await request.json();

    const isAlreadyExist = await User.findOne({
      username: email,
    });

    if (isAlreadyExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log("4. Password hashed");

    await User.create({
      username: email,
      passwordHash,
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

