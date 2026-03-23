import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// otp generate
var otp;
function otpnumber() {
    let otp1 = Math.random().toFixed(6).replace('0.', '')
    otp = otp1;
    console.log(otp);
}

// Mail sending code
const transporter = nodemailer.createTransport(
    {
        // loacl smtp data
        secure: true,
        // host: 'smtp.gmail.com',
        // post: 465,
        // auth: {
        //     user: 'process.env.google_smtp_user',             // remove with Company mail
        //     pass: 'process.env.google_smtp_pass'              // Create in hosting mashine

        // }

        // parmanet turbo smtp server data
        host: process.env.fix_smtp_host,
        post: 25,
        secure: true,
        auth: {
            user: 'process.env.fix_smtp_user',
            pass: 'process.env.fix_smtp_pass'

        },
        family: 4
    }
);

// function sendmail(to, sub, msg) {
//     try {
//         transporter.sendMail({
//             to: to,
//             subject: sub,
//             html: msg
//         });
//         res.json({ message: 'Mail send Successfully' })
//     } catch (error) {
//         res.status(500).json({ message: 'Mail sending error occurred' })
//     }
// }

