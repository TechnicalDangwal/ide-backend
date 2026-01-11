import nodemailer from 'nodemailer';


const smtpUser = process.env.SMTP_EMAIL;
console.log('SMTP User:',process.env.RABBITMQ_URL);
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Brevo SMTP host
    port: Number(process.env.SMTP_PORT), // or 465
    secure: false, // true for port 465
    auth: {
        user: '9bed37001@smtp-brevo.com',       // the email r>
        pass: process.env.BREVO_API_KEY         // SMTP key
    }
});

const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: `"OnlineIDE" <${smtpUser}>`,
        to,
        subject,
        html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending email:', error);
        }
        console.log('Email sent successfully:', info.response);
    });
}
export default sendEmail;