import {Schema,model} from "mongoose";

const likeSchema = new Schema({

    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
})

likeSchema.index({postId:1,userId:1},{unique:true})
const Like = model("Like",likeSchema)
export default Like;