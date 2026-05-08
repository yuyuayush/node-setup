import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Post from '../models/post.model.js';
import Image from "../models/image.model.js";
import { successResponse } from "../utils/responseHandler.js";
import mongoose from 'mongoose';


export const createPost = asyncHandler(async (req, res) => {
    const { title, content, s3Key, s3Url } = req.body;
    const user = req.user;

    let imageDocs;

    if (s3Key && s3Url) {
        // Handle S3 upload metadata saving
        imageDocs = await Image.create({
            mobileUrl: s3Url,
            mobileKey: s3Key,
            laptopUrl: s3Url,
            laptopKey: s3Key,
            desktopUrl: s3Url,
            desktopKey: s3Key,
            owner: user._id
        });
    } else {
        throw new ApiError(400, "S3 image info is required");
    }

    const post = await Post.create({
        title,
        content,
        image: imageDocs._id,
        author: user._id,
    });

    return successResponse(res, post, "Post created successfully", 200);
});


export const getPostByUser = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
        {
            $match: {
                author: req.user._id
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "images",
                localField: "image",
                foreignField: "_id",
                as: "image"
            }
        },
        { $unwind: "$image" },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                title: 1,
                content: 1,
                createdAt: 1,
                "image.desktopUrl": 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "author.avatar": 1
            }
        }
    ]);

    return successResponse(res, posts, "User posts fetched successfully", 200);
});


export const getPostsByUserId = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { userId } = req.params;

    const posts = await Post.aggregate([
        {
            $match: {
                author: new mongoose.Types.ObjectId(userId)
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "images",
                localField: "image",
                foreignField: "_id",
                as: "image"
            }
        },
        { $unwind: "$image" },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                title: 1,
                content: 1,
                createdAt: 1,
                "image.desktopUrl": 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "author.avatar": 1
            }
        }
    ]);

    return successResponse(res, posts, "User posts fetched successfully", 200);
});

export const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("image");
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    return successResponse(res, post, "Post fetched successfully", 200);
});

export const getAllPosts = asyncHandler(async (req, res) => {

    console.log("testing")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "images",
                localField: "image",
                foreignField: "_id",
                as: "image"
            }
        },
        { $unwind: { path: "$image", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "postId",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "postId",
                as: "comments"
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                commentCount: { $size: "$comments" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$likes.userId"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                createdAt: 1,
                "image.desktopUrl": 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "author.avatar": 1,
                likeCount: 1,
                commentCount: 1,
                isLiked: 1
            }
        }
    ]);

    console.log(`Fetched ${posts.length} posts for user ${req.user._id}`);

    return successResponse(res, posts, "Posts fetched successfully", 200);
});