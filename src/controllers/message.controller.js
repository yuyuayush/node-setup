import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from '../models/message.model.js';
import User from '../models/userModel.js';
import { successResponse } from "../utils/responseHandler.js";

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    if (!message) {
        throw new ApiError(400, "Message content is required");
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
    });

    return successResponse(res, newMessage, "Message sent successfully", 201);
});

export const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userId },
            { senderId: userId, receiverId: myId },
        ],
    }).sort({ createdAt: 1 });

    return successResponse(res, messages, "Messages fetched successfully", 200);
});

// Get list of recent contacts/conversations
export const getConversations = asyncHandler(async (req, res) => {
    const myId = req.user._id;

    // Find all messages involving the current user
    const messages = await Message.find({
        $or: [{ senderId: myId }, { receiverId: myId }],
    }).sort({ createdAt: -1 });

    // Extract unique user IDs from those messages
    const contactIds = new Set();
    messages.forEach((msg) => {
        if (msg.senderId.toString() !== myId.toString()) {
            contactIds.add(msg.senderId.toString());
        }
        if (msg.receiverId.toString() !== myId.toString()) {
            contactIds.add(msg.receiverId.toString());
        }
    });

    // Fetch the user profiles for those contacts
    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('name email avatar');

    return successResponse(res, contacts, "Conversations fetched successfully", 200);
});
