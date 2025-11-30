# GitHub Image Storage Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in (or create account)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `tsum-product-images`
4. Description: `Product images for Tsum e-commerce site`
5. Make it **Public** ✅
6. Click **"Create repository"**

## Step 2: Upload Your Existing Images

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop all images from `D:\Tsum\project\public\`
3. All your existing images (01-front.jpg, Bell-1.jpg, etc.)
4. Click **"Commit changes"**

## Step 3: Create Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Tsum Image Upload`
4. Check the **"repo"** permission (full control of private repositories)
5. Scroll down and click **"Generate token"**
6. **COPY THE TOKEN** (you'll only see it once!)

## Step 4: Configure Your Backend

1. Open `backend/.env` file
2. Replace these values:
   ```
   GITHUB_TOKEN=paste_your_token_here
   GITHUB_USERNAME=your_github_username
   GITHUB_REPO=tsum-product-images
   ```

## Step 5: Restart Backend Server

```bash
cd backend
npm start
```

## ✅ Done!

Now when admin uploads images through the dashboard:
- Images automatically upload to GitHub
- Returns public URL: `https://raw.githubusercontent.com/YOUR-USERNAME/tsum-product-images/main/filename.jpg`
- No more localhost URLs!
- Unlimited free storage
- Images work from anywhere

## Your Image URLs Will Look Like:
```
https://raw.githubusercontent.com/YOUR-USERNAME/tsum-product-images/main/01-front.jpg
https://raw.githubusercontent.com/YOUR-USERNAME/tsum-product-images/main/Singing-Bowl-1.jpg
```

## Test It:
1. Login to admin dashboard
2. Upload a new product with image
3. Check the product - image URL should be the GitHub URL!
