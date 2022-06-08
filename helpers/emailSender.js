const nodemailer = require("nodemailer");
const APP_PASSWORD =
  process.env.APP_PASSWORD || require("../secrets").APP_PASSWORD;
module.exports = async function main(token, userEmail) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: "recruitsanjay2771@gmail.com",
      pass: APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" ', // sender address
    to: userEmail, // list of receivers
    subject: "Token for reset", // Subject line
    text: "Hello world?", // plain text body
    html: `<b></b> 
            <p>your reset token is
        <br>${token}</br>
        </p>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
};
