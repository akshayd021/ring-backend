const nodemailer = require("nodemailer");
const fs = require("fs");

const sendEmail = async (email, subject, message, attachmentPath = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Basic styled HTML template
    const htmlContent = `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333;">${subject}</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">${message}</p>
        <p style="margin-top: 30px; color: #999; font-size: 13px;">This message was sent automatically from our system.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Vasoya Brother Info" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message, // plain text fallback
      html: htmlContent,
    };

    // Attach file (e.g., invoice)
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      mailOptions.attachments = [
        {
          filename: "invoice.pdf",
          path: attachmentPath,
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", email);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
