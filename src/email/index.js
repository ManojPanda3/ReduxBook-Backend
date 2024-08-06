import { createTransport } from "nodemailer"

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailSender = async function (userEmail, msg = {
  subject: "Hello ✔",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
}) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"ReduxBook" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: msg["subject"],
      text: msg["text"],
      html: msg["html"],
    });
    return info;
  } catch (error) {
    console.error("error while sending msg to user: ", userEmail, "\nError: ", error);
    return false;
  }
}

export default emailSender;
