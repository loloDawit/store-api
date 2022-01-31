const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  const state = {
    host: process.env.NODE_ENV === 'production' ? process.env.AWS_SMTP_HOST : process.env.SMTP_HOST,
    port: process.env.NODE_ENV === 'production' ? process.env.AWS_SMTP_PORT : process.env.SMTP_PORT,
    auth: {
      user: process.env.NODE_ENV === 'production' ? process.env.AWS_SMTP_USERNAME : process.env.SMTP_USERNAME,
      pass: process.env.NODE_ENV === 'production' ? process.env.AWS_SMTP_PASSWORD : process.env.SMTP_PASSWORD
    }
  };

  const transporter = nodemailer.createTransport(state);
  // send email with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: 'Hey there, per your request, here is the link to reset your password.',
    html: options.message
  };
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};
