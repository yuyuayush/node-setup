import express from "express";
import { deleteImage, getPresignedUrlController, updateAvatarMetadata } from "../controllers/upload.controller.js";

const router = express.Router();

// Presigned URL flow
router.post("/presigned-url", getPresignedUrlController);
router.post("/update-metadata", updateAvatarMetadata);

router.delete("/avatar", deleteImage);

export default router;