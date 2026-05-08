import razorpay from "../config/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/responseHandler.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import logger from "../config/logger.js";

/**
 * Create a new Razorpay order and save a pending order in DB
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { productId, amount, currency = "INR" } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    if (!amount) {
        throw new ApiError(400, "Amount is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const options = {
        amount: Math.round(amount * 100), // razorpay expects amount in paise
        currency,
        receipt: `rcpt_${Date.now()}`,
    };


    try {
        const razorpayOrder = await razorpay.orders.create(options);

        if (!razorpayOrder) {
            throw new ApiError(500, "Failed to create razorpay order");
        }

        // Initialize order record in database
        await Order.create({
            user: req.user._id,
            product: productId,
            amount,
            currency,
            razorpayOrderId: razorpayOrder.id,
            status: "PENDING"
        });

        return successResponse(res, razorpayOrder, "Order initiated successfully");
    } catch (error) {
        logger.error(`Razorpay Order Creation Error: ${JSON.stringify(error)}`);
        console.error("Full Razorpay Error:", error);
        throw new ApiError(500, "Payment provider error: " + (error.description || error.message || "Unknown error"));
    }

});

/**
 * Verify Razorpay payment signature and update order status
 */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Payment verification details are missing");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { 
                status: "COMPLETED",
                razorpayPaymentId: razorpay_payment_id
            },
            { new: true }
        );

        if (!order) {
            logger.error(`Order not found for verification: ${razorpay_order_id}`);
            throw new ApiError(404, "Order record not found");
        }

        return successResponse(res, { order }, "Payment verified successfully");
    } else {
        await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: "FAILED" }
        );
        throw new ApiError(400, "Invalid payment signature verification failed");
    }
});


