import express from "express";
import { auth } from "../middleware/auth.js";
import * as paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", auth(), paymentController.createOrder);
router.post("/verify-payment", auth(), paymentController.verifyPayment);

export default router;
