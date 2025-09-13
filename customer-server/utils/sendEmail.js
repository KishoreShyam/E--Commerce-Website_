const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: {
    subject: 'Welcome to LuxeCommerce - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ LuxeCommerce</h1>
            <h2>Welcome to Premium Shopping!</h2>
          </div>
          <div class="content">
            <h3>Hello {{name}}!</h3>
            <p>Thank you for joining LuxeCommerce, your gateway to premium shopping experiences.</p>
            <p>To complete your registration and start exploring our exclusive collection, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">{{verificationUrl}}</p>
            <p>This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 LuxeCommerce. All rights reserved.</p>
            <p>Premium Shopping Experience</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  passwordReset: {
    subject: 'Password Reset Request - LuxeCommerce',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <h2>LuxeCommerce</h2>
          </div>
          <div class="content">
            <h3>Hello {{name}}!</h3>
            <p>We received a request to reset your password for your LuxeCommerce account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="{{resetUrl}}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">{{resetUrl}}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong> This password reset link will expire in {{expiryTime}}. If you don't reset your password within this time, you'll need to request a new reset link.
            </div>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security reasons, never share this link with anyone.</p>
          </div>
          <div class="footer">
            <p>© 2024 LuxeCommerce. All rights reserved.</p>
            <p>If you have any questions, contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  orderConfirmation: {
    subject: 'Order Confirmation - LuxeCommerce',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .item { border-bottom: 1px solid #eee; padding: 15px 0; }
          .total { font-weight: bold; font-size: 18px; color: #667eea; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <h2>Thank you for your purchase</h2>
          </div>
          <div class="content">
            <h3>Hello {{customerName}}!</h3>
            <p>Your order has been confirmed and is being processed. Here are your order details:</p>
            
            <div class="order-details">
              <h4>Order #{{orderNumber}}</h4>
              <p><strong>Order Date:</strong> {{orderDate}}</p>
              <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              
              <h4>Items Ordered:</h4>
              {{#each items}}
              <div class="item">
                <strong>{{name}}</strong><br>
                Quantity: {{quantity}} × ${{price}} = ${{subtotal}}
              </div>
              {{/each}}
              
              <div style="margin-top: 20px;">
                <p>Subtotal: ${{subtotal}}</p>
                <p>Shipping: ${{shipping}}</p>
                <p>Tax: ${{tax}}</p>
                <p class="total">Total: ${{total}}</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="{{trackingUrl}}" class="button">Track Your Order</a>
            </div>
            
            <p>We'll send you another email when your order ships with tracking information.</p>
          </div>
          <div class="footer">
            <p>© 2024 LuxeCommerce. All rights reserved.</p>
            <p>Questions? Contact our support team anytime.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Main send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    // Get template if specified
    let html = options.html;
    let subject = options.subject;

    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template];
      html = template.html;
      subject = subject || template.subject;

      // Replace template variables
      if (options.context) {
        Object.keys(options.context).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          html = html.replace(regex, options.context[key]);
          subject = subject.replace(regex, options.context[key]);
        });
      }
    }

    const mailOptions = {
      from: `"LuxeCommerce" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: subject,
      html: html,
      text: options.text
    };

    // Add CC and BCC if provided
    if (options.cc) mailOptions.cc = options.cc;
    if (options.bcc) mailOptions.bcc = options.bcc;

    // Add attachments if provided
    if (options.attachments) mailOptions.attachments = options.attachments;

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, options) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        ...options,
        to: recipient.email,
        context: {
          ...options.context,
          ...recipient.context
        }
      });
      results.push({
        email: recipient.email,
        success: true,
        messageId: result.messageId
      });
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

module.exports = sendEmail;
module.exports.sendBulkEmail = sendBulkEmail;
