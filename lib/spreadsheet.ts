
import { Schema } from "mongoose";
import mongoose from "mongoose";

const SpreadsheetScheme=new Schema(
    {
    userID:{
        type:Schema.Types.ObjectId,
        ref:"User",
        // required:true,  
    },
    name:{
        type:String,
        required:true,  
    },

    data:{
        type:Schema.Types.Mixed,
        required:true,

    }
},
   {
    timestamps:true,    
    collection:"spreadsheet",
   }
);
const Spreadsheet = mongoose.models.Spreadsheet || mongoose.model("Spreadsheet",SpreadsheetScheme); 

export default Spreadsheet;