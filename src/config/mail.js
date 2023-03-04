const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMail(token, email) {
    // Config
    const configMail = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SENDER, // generated ethereal user
            pass: process.env.EMAIL_SENDER_PASSWORD, // generated ethereal password
        },
    });

    // Content
    configMail.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Markisak Activation Link", // Subject line
        html: `<b>https://markisak-fe.vercel.app/user/verif?token=${token}</b>`, // html body
    });
    return;
}

module.exports = {
    sendMail,
};
