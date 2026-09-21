const contactModel = require("../models/contactModel");

exports.sendMessage = async (req, res)=> {

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
        if (!cleanName || !cleanEmail || !cleanMessage || !cleanSubject) {
            return res.status(400).json({
                error: "Name, email, subject and message are required"
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

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await contactModel.toggleStatus(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json({ message: "Status updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await contactModel.getAllMessages();

        res.json({
            data: messages
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};