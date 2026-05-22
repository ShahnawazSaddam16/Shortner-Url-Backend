const express = require("express");
const router = express.Router();
const Plans = require("../Models/plans");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/plan", authMiddleware, async (req, res) => {
    try {
        const { planStatus, planCategory } = req.body;

        if (!planStatus || !planCategory) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const existingPlan = await Plans.findOne({
            user: req.user._id,
            email: req.user.email
        });

        if (existingPlan) {
            existingPlan.planStatus = planStatus;
            existingPlan.planCategory = planCategory;
            await existingPlan.save();

            return res.status(200).json({
                success: true,
                message: "Plan updated successfully",
                data: existingPlan
            });
        }

        const newPlan = await Plans.create({
            user: req.user._id,
            email: req.user.email,
            planStatus,
            planCategory
        });

        return res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: newPlan
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
        const { planStatus, planCategory } = req.body;

        if (!planStatus || !planCategory) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const existingPlan = await Plans.findOne({
            user: req.user._id,
            email: req.user.email
        });

        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        existingPlan.planStatus = planStatus;
        existingPlan.planCategory = planCategory;

        await existingPlan.save();

        return res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: existingPlan
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