const express = require("express");
const router = express.Router();
const Plans = require("../Models/plans");
const { authMiddleware } = require("../middleware/authMiddleware");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post("/plan", authMiddleware, async (req, res) => {
    try {
        const { planStatus, planCategory, paymentIntentId } = req.body;

        if (!planStatus || !planCategory) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment required"
            });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

        const plan = await Plans.findOneAndUpdate(
            { createdBy: req.user._id },
            {
                planStatus,
                planCategory,
                email: req.user.email,
                paymentStatus: "paid",
                stripePaymentIntentId: paymentIntentId,
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Plan saved successfully",
            data: plan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

router.put("/plan", authMiddleware, async (req, res) => {
    try {
        const { planStatus, planCategory, paymentIntentId } = req.body;

        if (!planStatus || !planCategory) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment required"
            });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

        const plan = await Plans.findOneAndUpdate(
            { createdBy: req.user._id },
            {
                planStatus,
                planCategory,
                email: req.user.email,
                paymentStatus: "paid",
                stripePaymentIntentId: paymentIntentId,
            },
            { new: true }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: plan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

router.get("/plan", authMiddleware, async (req, res) => {
    try {
        const plan = await Plans.findOne({ createdBy: req.user._id });

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Plan fetched successfully",
            data: plan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;