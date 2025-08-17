const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../config/emailConfig');
const { adminEmails } = require('../config/constants');

// Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        console.log('Received request to send OTP');
        const { email } = req.body;
        console.log('Email received:', email);

        // Check if email is in allowed admin emails
        console.log('Checking email against allowed list...');
        console.log('Received email:', email);
        console.log('Allowed emails:', adminEmails);
        console.log('Type of email:', typeof email);
        console.log('Includes check result:', adminEmails.includes(email));
        
        // Strict comparison check
        const isAllowed = adminEmails.some(allowedEmail => 
            allowedEmail.toLowerCase().trim() === email.toLowerCase().trim()
        );
        console.log('Strict comparison result:', isAllowed);

        if (!isAllowed) {
            console.log('Email not in allowed list');
            return res.status(403).json({
                status: 'error',
                message: 'Email not authorized'
            });
        }

        console.log('Email authorized, attempting to send OTP to:', email);
        // Send OTP
        const result = await sendOTP(email);
        console.log('OTP sending result:', result);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Detailed error in route handler:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to send OTP'
        });
    }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = verifyOTP(email, otp);

        if (!result.valid) {
            return res.status(400).json({
                status: 'error',
                message: result.message
            });
        }

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to verify OTP'
        });
    }
});

module.exports = router;
