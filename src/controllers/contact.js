const express = require("express");
const router = express.Router();
const Contact = require("../Models/contact");
const {authMiddleware} = require("../middleware/authMiddleware");

router.post("/contact", authMiddleware, async(req,res)=>{
    try{
        const {name, email, subject, message} = req.body;

        if(!name || !email || !subject || !message){
            return res.status(401).json({success: false, message: "Please fil all fields"});
        }

        const newContact = await new Contact({
            createdBy: req.user._id,
            name,
            email,
            subject,
            message
        });
        await newContact.save();
        return res.status(200).json({success: true, message: "We'll Contact You Soon"});
    } catch(err){
        return res.status(500).json({success: false, message: err.message});
    }
});

module.exports = router;