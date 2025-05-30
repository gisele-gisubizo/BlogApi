import nodemailer from "nodemailer";

async function createTransporter() {
  return nodemailer.createTransport({
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export class EmailService {
  async sendVerificationEmail(email: string, link: string) {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome!</h2>
        <p>Click below to verify your email:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async sendResetPasswordEmail(email: string, resetLink: string) {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send reset password email. Please try again later.");
    }
  }
}