import { deleteImageFromS3, generatePresignedUrl } from "../services/s3.service.js";
import { successResponse } from "../utils/responseHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPresignedUrlController = asyncHandler(async (req, res) => {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
        throw new ApiError(400, "fileName and contentType are required");
    }

    const { uploadUrl, s3Key, s3Url } = await generatePresignedUrl(fileName, contentType);

    return successResponse(res, { uploadUrl, s3Key, s3Url }, "Presigned URL generated successfully", 200);
});

export const updateAvatarMetadata = asyncHandler(async (req, res) => {
    const { s3Key, s3Url } = req.body;
    const user = req.user;

    if (!s3Key || !s3Url) {
        throw new ApiError(400, "s3Key and s3Url are required");
    }

    if (user.avatarKey) {
        await deleteImageFromS3(user.avatarKey);
    }

    user.avatarKey = s3Key;
    user.avatarUrl = s3Url;
    await user.save();

    return successResponse(res, { s3Url, s3Key }, "Avatar updated successfully", 200);
});

export const deleteImage = asyncHandler(async (req, res) => {

    const user = req.user;
    if (user.avatarKey) await deleteImageFromS3(user.avatarKey);
    user.avatarKey = null;
    user.avatarUrl = null;
    await user.save();
    return successResponse(res, {}, "File deleted successfully", 200);

})