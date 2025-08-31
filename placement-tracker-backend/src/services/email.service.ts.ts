import nodemailer from 'nodemailer';

export const sendVerificationOtp = async (userEmail: string) => {
    // 1. Configure the email transporter using your .env variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Define the email options
    const mailOptions = {
        from: `"Placement Tracker" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Your Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2 style="color: #0056b3;">Verification Code</h2>
                <p>Please use the following code to complete your verification process.</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0056b3; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
                    ${otp}
                </p>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `,
    };

    // 4. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', userEmail);
        // 5. Return the OTP so the frontend can use it
        return otp;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Could not send verification email.');
    }
};