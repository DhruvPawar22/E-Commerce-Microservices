const express = require('express');
const router = express.Router();
const sendMail = require('../utils/mailer');

// POST /api/notify/email
router.post('/email', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendMail(to, subject, text);
        res.status(200).json({ message: 'Email sent!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send email', error: err.message });
    }
});

module.exports = router;