const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
             port: process.env.MAIL_PORT,
             auth: {
                 user: process.env.EMAIL_USER,
                 pass: process.env.EMAIL_PASS
             }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'info@snmgroup.com.np - App',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;