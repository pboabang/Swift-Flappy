# SafeConnect Website

Marketing site and quote-request API for **SafeConnect** — Alarms, Smart Security &amp; Video, Caledon ON.

- **Phone:** 647.281.1454
- **Address:** 12234 McLaughlin Rd, Caledon, ON

## Stack

- Static frontend (`public/`) — HTML, CSS, vanilla JS, no build step.
- Node.js + Express backend (`server.js`) — serves the frontend and exposes `POST /api/quote`
  for the "Request Free Quote" form.
- Quote requests are always saved to `data/leads.jsonl`. If SMTP env vars are set, an email
  notification is also sent via Nodemailer.

## Getting started

```bash
npm install
cp .env.example .env   # optional: fill in SMTP settings to enable email notifications
npm start
```

Visit `http://localhost:3000`.

## Project structure

```
website/
├── public/            # static frontend
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── assets/        # logo, favicon
├── routes/quote.js     # POST /api/quote — validates + stores lead, sends email
├── utils/mailer.js     # optional SMTP notification
├── data/leads.jsonl    # stored quote requests (gitignored)
└── server.js
```

## Environment variables

See `.env.example`. All are optional — without SMTP configured, quote requests are still
captured in `data/leads.jsonl`.
