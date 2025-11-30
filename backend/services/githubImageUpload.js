import fetch from 'node-fetch';

/**
 * Upload image to GitHub repository
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} fileName - Name for the file (e.g., 'product-123.jpg')
 * @returns {Promise<string>} - URL of uploaded image
 */
export async function uploadToGitHub(imageBuffer, fileName) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME; // Your GitHub username
  const GITHUB_REPO = process.env.GITHUB_REPO; // Repository name (e.g., 'tsum-product-images')
  
  if (!GITHUB_TOKEN || !GITHUB_USERNAME || !GITHUB_REPO) {
    throw new Error('GitHub configuration missing. Please set GITHUB_TOKEN, GITHUB_USERNAME, and GITHUB_REPO in .env file');
  }

  // Convert buffer to base64
  const base64Content = imageBuffer.toString('base64');

  // GitHub API endpoint
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

  try {
    // Check if file already exists
    let sha = null;
    try {
      const checkResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        sha = data.sha; // Get SHA for updating existing file
      }
    } catch (err) {
      // File doesn't exist, will create new
    }

    // Upload or update file
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload product image: ${fileName}`,
        content: base64Content,
        ...(sha && { sha }) // Include SHA if updating existing file
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub upload failed: ${error}`);
    }

    const data = await response.json();
    
    // Return the raw content URL (direct image link)
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${fileName}`;
    return imageUrl;

  } catch (error) {
    console.error('GitHub upload error:', error);
    throw error;
  }
}

/**
 * Delete image from GitHub repository
 * @param {string} fileName - Name of the file to delete
 */
export async function deleteFromGitHub(fileName) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_USERNAME || !GITHUB_REPO) {
    throw new Error('GitHub configuration missing');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

  try {
    // Get file SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getResponse.ok) {
      throw new Error('File not found on GitHub');
    }

    const fileData = await getResponse.json();

    // Delete file
    const deleteResponse = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Delete product image: ${fileName}`,
        sha: fileData.sha
      })
    });

    if (!deleteResponse.ok) {
      throw new Error('Failed to delete file from GitHub');
    }

    return true;
  } catch (error) {
    console.error('GitHub delete error:', error);
    throw error;
  }
}
