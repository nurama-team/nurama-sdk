import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const FileUpload = ({ client, addLog, logJson, isLoading, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedAssetId, setUploadedAssetId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProjectIdChange = (e) => {
    setProjectId(e.target.value);
  };

  const handleUpload = async () => {
    if (!client) {
      addLog('Client not initialized. Please login first.', 'error');
      return;
    }

    if (!projectId) {
      addLog('Please enter a Project ID.', 'error');
      return;
    }

    if (!file) {
      addLog('Please select a file to upload.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setIsLoading(true);

    try {
      addLog(`Starting upload for file: ${file.name}`);

      // Generate checksum for file identification
      const dateString = Date.now().toString();
      const checksum = CryptoJS.MD5(dateString).toString();
      addLog(`Generated checksum: ${checksum}`);

      // Prepare file metadata
      const fileSize = file.size / (1024 * 1024); // Convert to MB
      const files = {
        files: [
          { id: 1, name: file.name, sizeInMB: fileSize, checksum }
        ]
      };

      // Step 1: Create the asset (initiates the multipart upload)
      addLog(`Creating asset for file ${file.name}...`);
      console.log(client.project);
      const assetResult = await client.project.createAssets(projectId, files);
      logJson(assetResult, 'Asset creation response: ');

      if (!assetResult.length || !assetResult[0].signedUrlData) {
        throw new Error('Failed to get signed URLs for upload');
      }

      // Step 2: Extract information needed for multipart upload
      const signedUrls = assetResult[0].signedUrlData.urls;
      const key = assetResult[0].signedUrlData.key;
      const uploadId = assetResult[0].signedUrlData.uploadId;

      addLog(`Starting multipart upload with ${signedUrls.length} parts...`);

      // Step 3: Perform the multipart upload
      const uploadResult = await client.asset.multipartUpload(
        file, // Pass the File object directly
        signedUrls,
        key,
        uploadId,
        {
          onProgress: (progress) => {
            setUploadProgress(progress.percentComplete);
            if (progress.percentComplete % 10 === 0) {
              addLog(`Upload progress: ${progress.percentComplete}% (Part ${progress.partNumber}/${progress.totalParts})`);
            }
          },
          maxRetries: 3
        }
      );

      addLog('Multipart upload complete!', 'success');
      addLog(`Parts uploaded: ${uploadResult.parts.length}`);

      // Step 4: Complete the multipart upload
      addLog('Completing multipart upload...');
      const completeResult = await client.asset.completeUpload(uploadResult);
      addLog('Upload completion result:', 'success');
      logJson(completeResult);

      // Store the asset ID for potential download
      setUploadedAssetId(assetResult[0].asset.id);
      addLog(`File uploaded successfully. Asset ID: ${assetResult[0].asset.id}`, 'success');

    } catch (error) {
      addLog(`Upload failed: ${error.message || 'Unknown error'}`, 'error');
      if (error.data) {
        logJson(error.data, 'Error Data: ');
      } else {
        console.error('Full upload error:', error);
      }
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!client || !uploadedAssetId) {
      addLog('No uploaded file available for download.', 'error');
      return;
    }
    
    setIsDownloading(true);
    setIsLoading(true);
    
    try {
      addLog(`Requesting download for asset ID: ${uploadedAssetId}`);
      
      // Wait a moment to make sure the file is processed
      addLog('Waiting for a few seconds before downloading...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const downloadResponse = await client.asset.downloadAssets([uploadedAssetId]);
      addLog('Download links received:', 'success');
      logJson(downloadResponse);
      
      if (downloadResponse && downloadResponse.length > 0) {
        const downloadInfo = downloadResponse[0];
        addLog(`Downloading ${downloadInfo.fileName}...`);
        
        // Create a link element and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadInfo.url;
        downloadLink.download = downloadInfo.fileName;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        addLog(`Download initiated for ${downloadInfo.fileName}`, 'success');
      } else {
        addLog('No download links received.', 'error');
      }
      
    } catch (error) {
      addLog(`Download failed: ${error.message || 'Unknown error'}`, 'error');
      if (error.data) {
        logJson(error.data, 'Error Data: ');
      } else {
        console.error('Full download error:', error);
      }
    } finally {
      setIsDownloading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>File Upload and Download</h2>
      
      <div className="form-group">
        <label htmlFor="projectId">Project ID:</label>
        <input
          type="text"
          id="projectId"
          value={projectId}
          onChange={handleProjectIdChange}
          disabled={isUploading || isLoading}
          placeholder="Enter project ID"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="fileUpload">Select File:</label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          disabled={isUploading || isLoading}
        />
        {file && <div className="file-name">Selected: {file.name}</div>}
      </div>
      
      {(isUploading || uploadProgress > 0) && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
            {uploadProgress}%
          </div>
        </div>
      )}
      
      <div className="button-group">
        <button
          onClick={handleUpload}
          disabled={!file || !projectId || isUploading || isLoading}
          className="upload-btn"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
        
        {uploadedAssetId && (
          <button
            onClick={handleDownload}
            disabled={isDownloading || isLoading}
            className="download-btn"
          >
            {isDownloading ? 'Downloading...' : 'Download File'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 