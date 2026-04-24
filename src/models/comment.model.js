import { Schema } from "mongoose";

const commentSchema = new Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Instagram",
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
commentSchema.index({ postId: 1, createdAt: -1 });

const Comment = model("Comment",commentSchema)
export default Comment
