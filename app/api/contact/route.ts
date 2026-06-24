import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Check env vars are set
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_TO   = process.env.SMTP_TO || SMTP_USER

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP_USER or SMTP_PASS not set in environment variables')
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS, // Gmail App Password (not your regular password)
      },
    })

    // Email to YOU (the portfolio owner)
    await transporter.sendMail({
      from: `"${name}" <${SMTP_USER}>`,
      to: SMTP_TO,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background: #020408; font-family: 'Courier New', monospace; }
            .wrap { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
            .header { border-bottom: 1px solid #0d2035; padding-bottom: 20px; margin-bottom: 28px; }
            .badge { display: inline-block; padding: 3px 10px; background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.2); color: #00ff88; font-size: 11px; letter-spacing: 2px; margin-bottom: 14px; }
            .title { color: #c8dce8; font-size: 22px; font-weight: bold; letter-spacing: 1px; margin: 0; }
            .title span { color: #00ff88; }
            .field-label { color: #5a7a8a; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; margin-top: 20px; }
            .field-value { color: #c8dce8; font-size: 14px; padding: 10px 14px; background: #060d14; border: 1px solid #0d2035; border-left: 2px solid #00ff88; }
            .message-value { color: #c8dce8; font-size: 14px; padding: 14px; background: #060d14; border: 1px solid #0d2035; border-left: 2px solid #00ff88; line-height: 1.7; white-space: pre-wrap; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #0d2035; color: #3a5a7a; font-size: 10px; letter-spacing: 1px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div style="background:#020408;padding:40px 0;">
            <div class="wrap">
              <div class="header">
                <div class="badge">NEW MESSAGE</div>
                <p class="title">PORTFOLIO<span>//</span>CONTACT</p>
              </div>

              <div class="field-label">FROM</div>
              <div class="field-value">${name}</div>

              <div class="field-label">REPLY TO</div>
              <div class="field-value"><a href="mailto:${email}" style="color:#00aaff;text-decoration:none;">${email}</a></div>

              <div class="field-label">MESSAGE</div>
              <div class="message-value">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

              <table style="margin-top:32px;padding-top:16px;border-top:1px solid #0d2035;width:100%;">
                <tr>
                  <td style="color:#3a5a7a;font-size:10px;letter-spacing:1px;">ahamedbazil.com</td>
                  <td style="color:#3a5a7a;font-size:10px;letter-spacing:1px;text-align:right;">PORTFOLIO CONTACT FORM</td>
                </tr>
              </table>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Auto-reply to the sender
    await transporter.sendMail({
      from: `"Ahamed Bazil" <${SMTP_USER}>`,
      to: email,
      subject: `Got your message, ${name.split(' ')[0]}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background: #020408; font-family: 'Courier New', monospace; }
            .wrap { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
          </style>
        </head>
        <body>
          <div style="background:#020408;padding:40px 0;">
            <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
              <div style="border-bottom:1px solid #0d2035;padding-bottom:20px;margin-bottom:28px;">
                <div style="display:inline-block;padding:3px 10px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);color:#00ff88;font-size:11px;letter-spacing:2px;margin-bottom:14px;">MESSAGE RECEIVED</div>
                <p style="color:#c8dce8;font-size:20px;font-weight:bold;letter-spacing:1px;margin:0;">Hey ${name.split(' ')[0]},</p>
              </div>

              <p style="color:#5a7a8a;font-size:14px;line-height:1.8;margin-bottom:20px;">
                Thanks for reaching out! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.
              </p>

              <div style="padding:16px;background:#060d14;border:1px solid #0d2035;border-left:2px solid #00ff88;margin-bottom:28px;">
                <div style="color:#5a7a8a;font-size:10px;letter-spacing:2px;margin-bottom:8px;">YOUR MESSAGE</div>
                <div style="color:#c8dce8;font-size:13px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>

              <p style="color:#5a7a8a;font-size:13px;line-height:1.7;">
                In the meantime, feel free to connect with me on 
                <a href="https://www.linkedin.com/in/ahamed-bazil-mn" style="color:#00aaff;text-decoration:none;">LinkedIn</a>.
              </p>

              <table style="margin-top:32px;padding-top:16px;border-top:1px solid #0d2035;width:100%;">
                <tr>
                  <td style="color:#3a5a7a;font-size:10px;letter-spacing:1px;">Ahamed Bazil · ahamedbazil.com</td>
                  <td style="color:#3a5a7a;font-size:10px;letter-spacing:1px;text-align:right;">CYBERSECURITY</td>
                </tr>
              </table>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
