import mongoose,{ Schema } from "mongoose";

const Userschema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
         passwordHash:{
          type:String,
          required:true,
         },
    },
    {
        timestamps:true,
        collection:"user",
    }
);

const User = mongoose.models.User || mongoose.model("User",Userschema);

export default User;

