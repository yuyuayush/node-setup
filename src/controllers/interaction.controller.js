import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/responseHandler.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

export const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return successResponse(res, { liked: false }, "Post unliked successfully");
    } else {
        await Like.create({ postId, userId });
        return successResponse(res, { liked: true }, "Post liked successfully");
    }
});

export const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment) {
        throw new ApiError(400, "Comment content is required");
    }

    const newComment = await Comment.create({
        postId,
        userId,
        comment
    });

    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name avatar');

    return successResponse(res, populatedComment, "Comment added successfully");
});

export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 });

    return successResponse(res, comments, "Comments fetched successfully");
});
