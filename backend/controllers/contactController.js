const contactModel = require("../models/contactModel");

async function sendMessage(req, res) {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;
        const cleanName = name?.trim();
        const cleanEmail = email?.trim();
        const cleanSubject = subject?.trim();
        const cleanMessage = message?.trim();

        // BASIC VALIDATION
        if (!name || !email || !message) {
            return res.status(400).json({
                error: "Name, email and message are required"
            });
        }

        const result = await contactModel.createMessage({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage
        });

        res.status(201).json({
            success: true,
            message: "Message received successfully",
            receivedAt: new Date(),
            id: result.id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to send message"
        });
    }
}

module.exports = {
    sendMessage
};