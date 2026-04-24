import { required, string } from "joi";
import  mongoose  from "mongoose";

const instagramSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true
    },
    author:{
        authorId:String,
        authorName:String,
        authorAvatar:String
    },
    likes:{
        type:Number,
        default:0
    },
    comments:{
        type:Number,
        default:0
    },
    shares:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

instagramSchema.index({createdAt:-1})

const Instagram = mongoose.model("Instagram",instagramSchema)
export default Instagram