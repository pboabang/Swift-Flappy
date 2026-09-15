const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
}

async function sendQuoteNotification(lead) {
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'SMTP not configured' };

  const to = process.env.QUOTE_NOTIFY_TO || process.env.SMTP_USER;
  const from = process.env.QUOTE_NOTIFY_FROM || process.env.SMTP_USER;

  const text = [
    `New quote request from the SafeConnect website`,
    ``,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Service: ${lead.service}`,
    `Address: ${lead.address || '—'}`,
    `Message: ${lead.message || '—'}`,
    `Submitted: ${lead.createdAt}`
  ].join('\n');

  await t.sendMail({
    to,
    from,
    replyTo: lead.email,
    subject: `New Quote Request — ${lead.name} (${lead.service})`,
    text
  });

  return { sent: true };
}

module.exports = { sendQuoteNotification };
