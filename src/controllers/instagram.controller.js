import Instagram from "../models/instagram.model.js";
import Like from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createInstagram = asyncHandler(async (req, res) => {

    const { title, image } = req.body;

    const post = await Instagram.create({
        userId: req.user._id,
        title,
        image,
        author: {
            authorId: req.user._id,
            authorName: req.user.username,
            authorAvatar: req.user.avatar
        },
    });




    return successResponse(res, post, "Post created successfully", 200);

})



export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Instagram.find().sort({ createdAt: -1 });
    return successResponse(res, posts, "Posts fetched successfully", 200);
})

export const createLike = asyncHandler(async (req, res) => {

    const { postId } = req.body;

    const like = await Like.create({
        postId,
        userId: req.user._id
    });



    const post = await Instagram.updateOne({
        _id: postId
    }, {
        $inc: {
            likes: 1
        }
    })

    return successResponse(res, like, "Like created successfully", 200);

})

export const createComment = asyncHandler(async (req, res) => {
    const { postId, text } = req.body;

    await Comment.create({
        postId,
        userId: req.user._id,
        text
    });
    await Instagram.updateOne({
        _id: postId
    }, {
        $inc: {
            comments: 1
        }
    })
    return successResponse(res, comment, "Comment created successfully", 200);
})

export const getComments = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comment = await Comment.find({postId}).sort({createdAt:-1}).skip(skip).limit(limit);
   
    return successResponse(res,comment,"Comments fetched successfully",200);
})

export const getLikesPost = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const like = await Like.find({postId}).sort({createdAt:-1}).skip(skip).limit(limit);
   
    return successResponse(res,like,"Likes fetched successfully",200);
})
