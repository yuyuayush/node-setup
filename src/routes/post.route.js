import express from 'express';
import { createPost, getPost, getAllPosts, getPostByUser, getPostsByUserId } from '../controllers/post.controller.js';
import { toggleLike, addComment, getComments } from '../controllers/interaction.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// 1. Create a Post with S3 Presigned URL
router.post('/', auth(), createPost);

// 2. Feed Route
router.get('/', auth(), getAllPosts);

// 3. Current User Profile Posts
router.get('/user/me', auth(), getPostByUser);

// Fetch a Specific User's Posts
router.get('/user/:userId', auth(), getPostsByUserId);

// 4. Interaction Routes
router.post('/:postId/like', auth(), toggleLike);
router.post('/:postId/comment', auth(), addComment);
router.get('/:postId/comments', getComments);

// 5. Fetch a Post and Populate the Multi-size images
router.get('/:id', getPost);

export default router;

