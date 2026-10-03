/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import NuramaClient from '../../dist/NuramaClient.js';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

// Configuration
const config = {
  // Authentication
  login: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
  
  // API endpoints
  apiBaseUrl: process.env.API_BASE_URL || 'https://orama-staging-api.23rdc.com',
  
  // Project & file settings
  projectId: process.env.PROJECT_ID, // Project ID to upload to
  uploadFileName: process.env.UPLOAD_FILENAME || 'test.png',
  uploadFilePath: process.env.UPLOAD_FILEPATH || 'test-media/test.png',
  downloadDir: process.env.DOWNLOAD_DIR || 'test-media/downloads',
  
  // Testing options
  testDownloads: process.env.TEST_DOWNLOADS !== 'false',
  testParamGeneration: process.env.TEST_PARAM_GENERATION !== 'false'
};

// Validate required environment variables
if (!config.login || !config.password || !config.projectId) {
  console.error('Error: Missing required environment variables in .env file or system environment.');
  console.error('Required environment variables:');
  console.error('  TEST_USER_EMAIL - Your test user email');
  console.error('  TEST_USER_PASSWORD - Your test user password');
  console.error('  PROJECT_ID - The project ID to upload to');
  console.error('\nOptional environment variables:');
  console.error('  API_BASE_URL - API endpoint (defaults to https://orama-staging-api.23rdc.com)');
  console.error('  UPLOAD_FILENAME - Name to use for the uploaded file (defaults to test.png)');
  console.error('  UPLOAD_FILEPATH - Path to the file to upload (defaults to test-media/test.png)');
  console.error('  DOWNLOAD_DIR - Directory to save downloaded files (defaults to test-media/downloads)');
  console.error('  TEST_DOWNLOADS - Set to "false" to skip download testing (defaults to true)');
  process.exit(1);
}

/**
 * Example showing how to use the Nurama SDK to perform multipart uploads
 */
async function runMultipartUploadExample() {
  try {
    console.log('Starting multipart upload example...');
    
    // Initialize the SDK client
    const client = new NuramaClient(config.apiBaseUrl, {
      mode: 'node', // Running in Node.js environment
      debug: true   // Enable debug logging
    });
    
    // Step 1: Authenticate
    console.log('Authenticating...');
    await client.auth.login({
      login: config.login,
      password: config.password
    });
    console.log('Login successful!');
    
    // Generate checksum for file identification (similar to original example)
    const dateString = Date.now().toString();
    const checksum = crypto.createHash('md5').update(dateString).digest('hex');
    
    // Get file size in MB for the API request
    const fileStats = fs.statSync(config.uploadFilePath);
    const fileSize = fileStats.size / (1024 * 1024);
    
    // Step 2: Create the asset (this initiates the multipart upload process)
    console.log(`Creating asset for file ${config.uploadFileName}...`);
    const files = { 
      files: [
        { id: 1, name: config.uploadFileName, sizeInMB: fileSize, checksum }
      ] 
    };
    
    const assetResult = await client.project.createAssets(config.projectId, files);
    
    console.log('Asset creation response:', assetResult);
    
    if (!assetResult.length || !assetResult[0].signedUrlData) {
      throw new Error('Failed to get signed URLs for upload');
    }
    
    // Extract information needed for multipart upload
    const signedUrls = assetResult[0].signedUrlData.urls;
    const key = assetResult[0].signedUrlData.key;
    const uploadId = assetResult[0].signedUrlData.uploadId;
    
    // Step 3: Perform the multipart upload using our SDK
    console.log(`Starting multipart upload with ${signedUrls.length} parts...`);
    
    // Read the file to upload
    const fileBuffer = fs.readFileSync(config.uploadFilePath);
    
    // Track upload progress
    let lastLoggedPercent = -1;
    
    // Use the SDK's multipartUpload function
    const uploadResult = await client.asset.multipartUpload(
      fileBuffer, // Pass the file buffer
      signedUrls,
      key,
      uploadId,
      {
        onProgress: (progress) => {
          // Only log when percentage changes significantly
          if (progress.percentComplete - lastLoggedPercent >= 5) {
            console.log(`Upload progress: ${progress.percentComplete}% (Part ${progress.partNumber}/${progress.totalParts})`);
            lastLoggedPercent = progress.percentComplete;
          }
        },
        maxRetries: 3
      }
    );
    
    console.log('Multipart upload complete!');
    console.log('Parts uploaded:', uploadResult.parts.length);
    
    // Step 4: Complete the multipart upload
    console.log('Completing multipart upload...');
    const completeResult = await client.asset.completeUpload(uploadResult);
    console.log('Upload completion result:', completeResult);
    
    // Step 5 (optional): Test downloading the uploaded file
    if (config.testDownloads) {
      console.log('Waiting before testing download...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 5 seconds
      
      const assetId = assetResult[0].asset.id;
      console.log(`Testing download for asset ID: ${assetId}`);
      
      const downloadResponse = await client.asset.downloadAssets([assetId]);
      console.log('Download links:', downloadResponse);
      
      // Download each file
      for (const downloadInfo of downloadResponse) {
        console.log(`Downloading ${downloadInfo.fileName}...`);
        
        // Using fetch to download the file
        const response = await fetch(downloadInfo.url);
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }
        
        const buffer = await response.arrayBuffer();
        const fileName = downloadInfo.fileName;
        
        // Ensure downloads directory exists
        const {downloadDir} = config;

        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }
        
        const filePath = path.join(downloadDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Downloaded ${fileName} to ${filePath}`);
      }
    }

    // Step 6 (optional): Test complex param generation
    if (config.testParamGeneration) {

      const assetId = assetResult[0].asset.id;

      const getAssetParams = {  
        chatVisibility: 'creator',
        chatMessageSort: {
          id: -1
        },
        chatReplySort: {
          id: -1
        },
      }

      const asset = await client.asset.getAsset(assetId,getAssetParams);
      console.log('Asset:', asset.data);

    }
    
    console.log('Example completed successfully!');
    
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Run the example
runMultipartUploadExample().catch(console.error); 