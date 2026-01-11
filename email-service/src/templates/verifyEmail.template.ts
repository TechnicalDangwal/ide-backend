const verifyEmailTemplate = (name: string, verificationLink: string) => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Action Required: Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">

<center class="wrapper" style="width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #0d1117;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">

    <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; max-width: 600px; border-radius: 8px;">

      <tr>
        <td style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #21262d;">
          <h1 style="color: #58a6ff; font-size: 24px; margin: 0;">OnlineIDE <span style="font-size: 14px; color: #8b949e;">[Pro]</span></h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 40px;">
          <h2 style="color: #c9d1d9; font-size: 22px; margin-top: 0; margin-bottom: 25px;">Hello ${name}, 👋</h2>

          <p style="color: #8b949e; font-size: 16px; line-height: 1.6;">
            Thank you for registering with **OnlineIDE**. We're excited for you to explore the future of cloud-based development.
            Please verify your email address to activate your account and access your new **online IDE environment**.
          </p>

          <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; margin: 30px 0;">
            <tr>
              <td align="center">
                <a href="${process.env.BASE_URL}/api/v1/auth/verify-email/${verificationLink}" style="display: inline-block; padding: 14px 30px; font-size: 16px; font-weight: bold; color: #ffffff !important; text-decoration: none; border-radius: 6px; background: linear-gradient(135deg, #58a6ff 0%, #3080c0 100%); box-shadow: 0 6px 15px rgba(88, 166, 255, 0.4); border: 1px solid #58a6ff;">
                  &nbsp; Activate Your Account &nbsp;
                </a>
              </td>
            </tr>
          </table>

          <p style="color: #8b949e; font-size: 16px; line-height: 1.6;">
            This is a critical step for security and to ensure full service access.
            The link will expire in **24 hours**.
          </p>

          <p style="color: #8b949e; font-size: 14px; margin-top: 30px;">
            If the button above does not work, please copy and paste the following URL into your browser:
          </p>
          <div style="background-color: #010409; padding: 10px; border-radius: 6px; border: 1px solid #30363d; font-family: 'Fira Code', 'Courier New', monospace; font-size: 13px; word-break: break-all;">
            <a href="${process.env.BASE_URL}/api/v1/auth/verify-email/${verificationLink}" style="color: #58a6ff; text-decoration: none;">${verificationLink}</a>
          </div>

        </td>
      </tr>

      <tr>
        <td style="padding: 20px 40px; border-top: 1px solid #21262d; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #484f58;">
            You received this email because you signed up for OnlineIDE.
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #484f58;">
            © ${currentYear} OnlineIDE. All Rights Reserved.
          </p>
        </td>
      </tr>

    </table>

  </div>
</center>

</body>
</html>
`;
};

export default verifyEmailTemplate;