import { connectDB } from "@/lib/mongodb";
import Spreadsheet from "@/lib/spreadsheet";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
   
    const { data, name } = await request.json();
     console.log("Received data:", data, "with name:", name);

     if(
        typeof name!== "string" ||
        !name.trim() ||
         data === null || data===undefined
     ){
     return NextResponse.json(
        {message:"Invalid data or name"},
        {status:400}
     )
    }

    await connectDB();    


     const spreadsheet = await Spreadsheet.create({
         data,
         name:name.trim(),
     });
     return NextResponse.json(
        {message:"Spreadsheet saved successfully",spreadsheet},
        {status:201}

     )

  } catch (error) {
    console.error("Error connecting to the database:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );

  }
}