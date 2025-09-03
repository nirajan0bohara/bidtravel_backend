const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
