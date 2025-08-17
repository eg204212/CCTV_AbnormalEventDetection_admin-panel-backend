'use strict';

const nodemailer = require('nodemailer');
const otpStorage = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email) {
    console.log('Starting sendOTP function for email:', email);
    
    console.log('Creating transporter with Gmail service...');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chithramalisewwandi20@gmail.com',
            pass: 'oppb ipau nssf qmua'
        }
    });

    console.log('Generating OTP...');
    const otp = generateOTP();
    console.log('OTP generated successfully');
    
    console.log('Storing OTP in storage with expiry...');
    otpStorage.set(email, {
        otp,
        expiry: Date.now() + 5 * 60 * 1000
    });
    console.log('OTP stored successfully');

    console.log('Preparing mail options...');
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
    console.log('Mail options prepared:', { ...mailOptions, html: '[HTML content]' });

    try {
        console.log('Attempting to verify transporter...');
        await transporter.verify();
        console.log('Transporter verified successfully');

        console.log('Sending email to:', email);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully. Full response:', JSON.stringify(info, null, 2));
        return info;
    } catch (error) {
        console.error('Email sending failed. Error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });
        throw error;
    }
}

function verifyOTP(email, userOtp) {
    const storedData = otpStorage.get(email);
    
    if (!storedData) {
        return { valid: false, message: 'No OTP found for this email' };
    }

    if (Date.now() > storedData.expiry) {
        otpStorage.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    if (storedData.otp !== userOtp) {
        return { valid: false, message: 'Invalid OTP' };
    }

    otpStorage.delete(email);
    return { valid: true, message: 'OTP verified successfully' };
}

module.exports = {
    sendOTP,
    verifyOTP
};