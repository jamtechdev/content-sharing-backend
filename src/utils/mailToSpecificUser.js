// utils/mailToSpecificUser.js
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  
  
  function mailToSpecificUser(to, subject, content) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "host@gmail.com", // Replace with your email address
      to,
      subject,
      html: content,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          reject(new Error("Failed to send email: " + error.message));  // Improved error handling
        } else {
          console.log("Email sent: ", info.messageId)
          resolve("Email sent: " + info.response);  // Return success message
        }
      });
    });
  }
  
  module.exports = mailToSpecificUser;
  