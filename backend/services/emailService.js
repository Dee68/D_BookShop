const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationEmail = async (email, token) => {
    const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    // Destructure both data and error from the response
    const { data, error } = await resend.emails.send({
        from: "D-BookShop <noreply@dbookshop.com>",
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Welcome to BookShop</h2>
            <p>Please verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
        `
    });

    // Check if Resend returned an error
    if (error) {
        console.error("Resend API Error:", JSON.stringify(error, null, 2));
        // Throw the error so your existing catch block can handle it
        throw new Error(error.message || "Failed to send verification email");
    }

    // Log success only when we actually have data
    console.log("Verification email sent successfully. Message ID:", data.id);
    console.log("Verification link:", verificationLink);
};