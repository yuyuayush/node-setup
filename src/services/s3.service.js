import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';
import { config } from '../config/index.js';

// 1. Initialize S3 Client
const s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    }
});

export const deleteImageFromS3 = async (key) => {

    if (!key) return;
    const command = new DeleteObjectCommand({
        Bucket: config.aws.s3BucketName,
        Key: key,
    })
    await s3Client.send(command);

}

export const generatePresignedUrl = async (fileName, contentType) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(fileName).toLowerCase();
    const key = `uploads/${uniqueSuffix}${ext}`;

    const command = new PutObjectCommand({
        Bucket: config.aws.s3BucketName,
        Key: key,
        ContentType: contentType,
    });

    // URL expires in 5 minutes (300 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return {
        uploadUrl: url,
        s3Key: key,
        s3Url: `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/${key}`
    };
};