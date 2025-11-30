# Email Setup Instructions

## Step 1: Get Your Gmail App Password

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Scroll to "How you sign in to Google"
   - Click "2-Step Verification"
   - Follow the steps to enable it

3. **Generate App Password**
   - After enabling 2FA, go back to Security page
   - Scroll to "2-Step Verification" section
   - Click "App passwords" (or visit: https://myaccount.google.com/apppasswords)
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Type name: "Tsum Product Website"
   - Click "Generate"
   - **COPY THE 16-CHARACTER PASSWORD** (it will look like: `abcd efgh ijkl mnop`)
   - You won't see it again!

## Step 2: Update Your .env File

Open `backend/.env` and update these lines:

```env
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:** 
- Remove spaces from the 16-character password
- Don't use your regular Gmail password - ONLY use the app password

## Step 3: Restart Backend Server

```bash
cd backend
npm start
```

## How It Works

### When customers click "Email Inquiry":
1. ✅ Email sent to YOUR email (the one you configured)
2. ✅ Includes product name, category, and size
3. ✅ Product image embedded in the email
4. ✅ Clickable link to view product on your website
5. ✅ Beautiful HTML formatted email

### Email Features:
- **Product Image**: Automatically fetched and attached
- **Professional Layout**: HTML formatted with your brand colors
- **Product Details**: Name, category, size selection
- **Direct Link**: Takes you straight to the product page
- **Timestamp**: Shows when inquiry was received

### For Multiple Products (Cart):
- Sends all selected products in one email
- Each product includes its image
- Shows quantities requested
- Links to each individual product

## Testing

1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Go to any product page
4. Click "Email Inquiry" button
5. Check your Gmail inbox!

## Troubleshooting

### Error: "Invalid login credentials"
- Make sure you're using the 16-digit app password, not your regular Gmail password
- Remove any spaces from the password in .env

### Error: "Less secure app access"
- This shouldn't happen with app passwords
- Make sure 2-Step Verification is enabled

### Email not arriving?
- Check spam/junk folder
- Verify EMAIL_USER is correct in .env
- Check backend console for error messages

### Images not showing in email?
- Make sure your image URLs are accessible
- Check backend logs for "Failed to fetch product image"

## Example Email Preview

```
┌─────────────────────────────────────┐
│  🔔 New Product Inquiry             │
├─────────────────────────────────────┤
│                                     │
│  Product Details:                   │
│  • Product Name: Singing Bowl       │
│  • Category: Bells                  │
│  • Size: Medium (9-12 inches)       │
│                                     │
│  [Product Image Embedded]           │
│                                     │
│  [View Product on Website] Button   │
│                                     │
│  ⚠️ Action Required:                │
│  Customer is requesting pricing     │
│  and availability information.      │
│                                     │
│  Received on: Nov 25, 2025 10:30 AM │
└─────────────────────────────────────┘
```

## Security Notes

- ✅ App password is safer than your main Gmail password
- ✅ Can be revoked anytime from Google Account settings
- ✅ Only works for this specific app
- ✅ Doesn't give access to your Google Account

## Need Help?

If you have issues:
1. Double-check the app password (no spaces, 16 characters)
2. Verify 2FA is enabled on your Google Account
3. Check backend console logs for detailed error messages
4. Make sure backend/.env file is saved correctly
