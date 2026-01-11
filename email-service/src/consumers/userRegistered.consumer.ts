import sendEmail from "../mailer/index.js";
import verifyEmailTemplate from "../templates/verifyEmail.template.js";

export default async (data: any) => {
    const { email, username , emailVerificationToken } = data;
    console.log(emailVerificationToken,'token');
    
    sendEmail(email, 'Welcome to OnlineIDE', verifyEmailTemplate(username, emailVerificationToken));

}