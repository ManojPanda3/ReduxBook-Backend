import { createTransport } from "nodemailer"

const emailSender = async function (userEmail, msg = {
  subject: "Hello ✔",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
}) {
  try {
    const transporter = createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      secure: true,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
    console.log(transporter);
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

export const verifyEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (email.match(emailRegex)) return true;
  return false;
}
export default emailSender;
