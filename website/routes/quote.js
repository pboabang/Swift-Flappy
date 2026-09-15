const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { sendQuoteNotification } = require('../utils/mailer');

const router = express.Router();
const LEADS_FILE = path.join(__dirname, '..', 'data', 'leads.jsonl');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9()+\-.\s]{7,20}$/;
const ALLOWED_SERVICES = new Set([
  'Alarm Systems',
  'Smart Security',
  'Video Surveillance',
  'Network Installation',
  'Multiple / Not Sure'
]);

function clean(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen);
}

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};

    const lead = {
      name: clean(body.name, 100),
      phone: clean(body.phone, 30),
      email: clean(body.email, 150),
      service: clean(body.service, 60),
      address: clean(body.address, 200),
      message: clean(body.message, 1000),
      createdAt: new Date().toISOString(),
      ip: req.ip
    };

    if (!lead.name || lead.name.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!PHONE_RE.test(lead.phone)) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }
    if (!EMAIL_RE.test(lead.email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!ALLOWED_SERVICES.has(lead.service)) {
      return res.status(400).json({ error: 'Please select a service.' });
    }

    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await fs.appendFile(LEADS_FILE, JSON.stringify(lead) + '\n', 'utf8');

    const mailResult = await sendQuoteNotification(lead).catch((err) => {
      console.error('Failed to send quote notification email:', err.message);
      return { sent: false };
    });

    res.status(201).json({ ok: true, emailSent: mailResult.sent });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
