import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
