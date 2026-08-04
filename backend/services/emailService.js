// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);
const { Resend } = require("resend");

console.log("RESEND CHECK:", process.env.RESEND_API_KEY ? "FOUND" : "MISSING");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationEmail = async (email, token) => {
    //const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    await resend.emails.send({
        from: "D-BookShop <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Welcome to BookShop</h2>
            <p>Please verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
        `
    });

    console.log("Verification email sent to:", email);
    console.log("Verification link:", verificationLink);

};