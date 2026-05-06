const RESEND_ENDPOINT = "https://api.resend.com/emails";

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL || "wally@executivehome.com.au";
  const fromEmail =
    process.env.QUOTE_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "Executive Home Website <wally@executivehome.com.au>";

  if (!apiKey) {
    return res.status(503).json({
      error: "Email backend is not configured yet. Add RESEND_API_KEY in Vercel."
    });
  }

  let data = {};

  try {
    data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch (error) {
    return res.status(400).json({ error: "Invalid form submission." });
  }

  if (clean(data.honey)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(data.name);
  const phone = clean(data.phone);
  const email = clean(data.email);
  const suburb = clean(data.suburb);
  const service = clean(data.service);
  const message = clean(data.message);

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  const subject = `New website quote enquiry - ${service}`;
  const html = `
    <h2>New Executive Home website quote enquiry</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Suburb</strong></td><td>${escapeHtml(suburb || "Not provided")}</td></tr>
      <tr><td><strong>Service</strong></td><td>${escapeHtml(service)}</td></tr>
    </table>
    <h3>Details</h3>
    <p style="white-space:pre-line;font-family:Arial,sans-serif;">${escapeHtml(message)}</p>
  `;

  const text = [
    "New Executive Home website quote enquiry",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Suburb: ${suburb || "Not provided"}`,
    `Service: ${service}`,
    "",
    "Details:",
    message
  ].join("\n");

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      html,
      text
    })
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    return res.status(502).json({ error: "Email failed to send.", details });
  }

  return res.status(200).json({ ok: true });
};
