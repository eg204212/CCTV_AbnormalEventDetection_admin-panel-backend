const nodemailer = require('nodemailer');

// Store OTPs temporarily
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTP(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chithramalisewwandi20@gmail.com',
            pass: 'oppb ipau nssf qmua'
        }
    });

    const otp = generateOTP();
    
    otpStore.set(email, {
        otp,
        expiry: Date.now() + 5 * 60 * 1000
    });

    const mailOptions = {
        from: '"Admin Panel" <chithramalisewwandi20@gmail.com>',
        to: email,
        subject: 'Password Reset OTP',
        html: `
            <h1>Password Reset OTP</h1>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
        `
    };

    try {
        console.log('Sending email to:', email);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}

// Verify OTP
function verifyOTP(email, userOtp) {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
        return { valid: false, message: 'No OTP found for this email' };
    }

    if (Date.now() > storedData.expiry) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    if (storedData.otp !== userOtp) {
        return { valid: false, message: 'Invalid OTP' };
    }

    otpStore.delete(email);
    return { valid: true, message: 'OTP verified successfully' };
}

module.exports = {
    sendOTP,
    verifyOTP
};
