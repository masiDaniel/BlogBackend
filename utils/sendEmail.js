const nodemailer = require("nodemailer");
const {senderEmal, emaiPassword} = require("../config/kyes")

const sendEmail = async (emailTo, subject, code, content) => {
  // Debugging step — check if emailTo is valid
  if (!emailTo) {
    console.error("❌ No recipient email provided. emailTo:", emailTo);
    return; // stop execution
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: senderEmal,
      pass: emaiPassword
    }
  });

  const message = {
    from: "danm06339@gmail.com",
    to: emailTo,
    subject,
    html: `
      <div>
        <h3>Use the code below to ${content}</h3>
        <p><strong>Code:</strong> ${code}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`✅ Email sent to ${emailTo}: ${info.response}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};

module.exports = sendEmail;
