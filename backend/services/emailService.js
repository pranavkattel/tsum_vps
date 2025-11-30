import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // 16-digit app password
    },
  });
};

/**
 * Send product inquiry email with image attachment
 * @param {Object} productDetails - Product information
 * @param {string} productDetails.name - Product name
 * @param {string} productDetails.category - Product category
 * @param {string} productDetails.size - Selected size (optional)
 * @param {string} productDetails.productUrl - Product page URL
 * @param {string} productDetails.imageUrl - Product image URL
 * @param {string} customerEmail - Customer's email (REQUIRED)
 * @param {string} customerName - Customer's name (optional)
 */
export const sendProductInquiry = async (productDetails) => {
  try {
    const transporter = createTransporter();

    const { name, category, size, productUrl, imageUrl, customerEmail, customerName } = productDetails;

    if (!customerEmail) {
      throw new Error('Customer email is required');
    }

    // Fetch image from URL and convert to buffer
    let imageBuffer = null;
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(imageUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.error('Failed to fetch product image:', error.message);
    }

    // 1. Send inquiry email TO BUSINESS (with product details)
    const businessHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d97706; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .product-info { margin: 20px 0; }
          .product-info h2 { color: #d97706; }
          .product-info p { margin: 10px 0; }
          .product-image { text-align: center; margin: 20px 0; }
          .product-image img { max-width: 400px; width: 100%; height: auto; border: 2px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Product Inquiry</h1>
          </div>
          <div class="content">
            <div class="product-info">
              <h2>Customer Information:</h2>
              ${customerName ? `<p><strong>Name:</strong> ${customerName}</p>` : ''}
              <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              
              <h2 style="margin-top: 30px;">Product Details:</h2>
              <p><strong>Product Name:</strong> ${name}</p>
              <p><strong>Category:</strong> ${category}</p>
              ${size ? `<p><strong>Size:</strong> ${size}</p>` : ''}
              
              <p style="margin-top: 20px;"><strong>Customer's Question:</strong></p>
              <p style="padding: 15px; background-color: white; border-left: 4px solid #d97706;">
                "What is the price and availability of this product?"
              </p>
            </div>
            
            <div class="product-image">
              <h3>Product Image:</h3>
              <img src="cid:productImage" alt="${name}" />
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${productUrl}" class="button">View Product on Website</a>
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #d97706;">
              <strong>Action Required:</strong> Customer is requesting pricing and availability information. Please respond to ${customerEmail}
            </p>
          </div>
          <div class="footer">
            <p>This is an automated inquiry from Tsum Product Website</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const businessMailOptions = {
      from: `"Tsum Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your business email
      replyTo: customerEmail, // Customer can reply directly
      subject: `🔔 Product Inquiry: ${name} - from ${customerEmail}`,
      html: businessHtml,
      attachments: imageBuffer ? [
        {
          filename: `${name.replace(/[^a-z0-9]/gi, '_')}.jpg`,
          content: imageBuffer,
          cid: 'productImage',
        }
      ] : [],
    };

    await transporter.sendMail(businessMailOptions);
    console.log('Inquiry email sent to business');

    // 2. Send confirmation email TO CUSTOMER
    const whatsappNumber = '9779820229166';
    const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${name}. What is the price and availability?`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d97706; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
          .whatsapp-section { background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Thank You for Your Inquiry!</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName || 'Customer'},</p>
            
            <p>Thank you for your interest in <strong>${name}</strong>!</p>
            
            <p>We have received your inquiry and will get back to you soon with pricing and availability details.</p>
            
            <div class="whatsapp-section">
              <h3 style="color: #25D366; margin-top: 0;">💬 Need a Faster Response?</h3>
              <p>Message us directly on WhatsApp for instant assistance!</p>
              <a href="${whatsappLink}" class="button">
                📱 Chat on WhatsApp
              </a>
              <p style="margin-top: 15px; font-size: 14px; color: #666;">
                WhatsApp: +977 9820229166
              </p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: white; border-left: 4px solid #d97706;">
              <h4 style="margin-top: 0;">Your Inquiry:</h4>
              <p><strong>Product:</strong> ${name}</p>
              <p><strong>Category:</strong> ${category}</p>
              ${size ? `<p><strong>Size:</strong> ${size}</p>` : ''}
              <p><strong>Question:</strong> Price and availability</p>
            </div>
            
            <p style="margin-top: 30px;">We look forward to serving you!</p>
            
            <p style="margin-top: 20px;">
              Best regards,<br>
              <strong>Tsum Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Tsum - Authentic Nepali Crafts</p>
            <p>This is an automated confirmation email</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const customerMailOptions = {
      from: `"Tsum - Nepali Crafts" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Thank You for Your Inquiry - ${name}`,
      html: customerHtml,
    };

    await transporter.sendMail(customerMailOptions);
    console.log('Confirmation email sent to customer');

    return { success: true, message: 'Inquiry sent successfully' };

  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send bulk inquiry email for multiple products
 * @param {Array} products - Array of product details
 */
export const sendBulkInquiry = async (products) => {
  try {
    const transporter = createTransporter();

    let productsHtml = '';
    let productsText = '';
    const attachments = [];

    // Build product list and collect images
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      productsHtml += `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; background-color: white;">
          <h3>${i + 1}. ${product.name}</h3>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Quantity:</strong> ${product.quantity}</p>
          <p><a href="${product.productUrl}">View Product</a></p>
          <div style="text-align: center; margin: 10px 0;">
            <img src="cid:productImage${i}" alt="${product.name}" style="max-width: 300px; width: 100%; border: 1px solid #ddd;" />
          </div>
        </div>
      `;

      productsText += `
${i + 1}. ${product.name}
   Category: ${product.category}
   Quantity: ${product.quantity}
   View: ${product.productUrl}
\n`;

      // Fetch and attach image
      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(product.imageUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const imageBuffer = Buffer.from(arrayBuffer);
          attachments.push({
            filename: `${product.name.replace(/[^a-z0-9]/gi, '_')}.jpg`,
            content: imageBuffer,
            cid: `productImage${i}`,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch image for ${product.name}:`, error.message);
      }
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d97706; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Bulk Product Inquiry</h1>
          </div>
          <div class="content">
            <p><strong>Customer is interested in ${products.length} products:</strong></p>
            ${productsHtml}
            <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #d97706;">
              <strong>Action Required:</strong> Customer is requesting pricing and availability information for these products.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated inquiry from Tsum Product Website</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Bulk Product Inquiry

Customer is interested in ${products.length} products:
${productsText}

Customer is requesting pricing and availability information.

Received on: ${new Date().toLocaleString()}
    `;

    const mailOptions = {
      from: `"Tsum Product Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Bulk Product Inquiry (${products.length} items)`,
      text: textContent,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Bulk inquiry email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Failed to send bulk inquiry email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
