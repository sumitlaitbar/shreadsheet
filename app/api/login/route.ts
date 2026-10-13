import { connectDB } from "@/lib/mongodb";
import User from "@/lib/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    
    try{
        await connectDB();

        const {email,password}=await request.json();

        const user = await User.findOne({
            username:email,
        });

        if(!user){
            return NextResponse.json(
                {message:"User Not found"},
                {status:404},
            )
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.passwordHash)
        if(!isPasswordCorrect)
        {
            return NextResponse.json(
                {message:"Invalid Password"},
                {status:401},
            )
        }

        return NextResponse.json(
            {message:"Login successfully"},
            {status:200}
        )
    }
    catch(error)
    {
        console.log(error)
       
    }
    return NextResponse.json(
        {message:"Serer Error"},
        {
            status:500
        }
    )

}