import express from 'express';
import { createPost, getPost, getAllPosts, getPostByUser } from '../controllers/post.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// 1. Create a Post with S3 Presigned URL
router.post('/', auth(), createPost);

// 2. Feed Route
router.get('/', auth(), getAllPosts);

// 3. Current User Profile Posts
router.get('/user/me', auth(), getPostByUser);

// 4. Fetch a Post and Populate the Multi-size images
router.get('/:id', getPost);

export default router;

