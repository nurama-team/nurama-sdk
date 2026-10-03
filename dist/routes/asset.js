import { uploadSessionManager } from '../utils/uploadSessionManager.js';
/**
 * Defines asset-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the asset-related methods.
 */
export default function createAssetMethods(client) {
    /**
     * Uploads a single part of a file
     * @private
     * @param {string} signedUrl - The signed URL for uploading this part
     * @param {number} partNumber - The part number (1-based index)
     * @param {number} totalParts - Total number of parts
     * @param {Blob|Buffer|ArrayBuffer} data - The data chunk to upload
     * @param {PartUploadOptions} options - Upload options
     * @param {number} attempt - Current attempt number
     * @returns {Promise<{ETag: string, PartNumber: number}>} The completed part information
     */
    async function uploadPart(signedUrl, partNumber, totalParts, data, options = {}, attempt = 1) {
        const { onPartProgress, maxRetries = 3, abortSignal } = options;
        try {
            // Report start of part upload
            if (onPartProgress) {
                onPartProgress({
                    partNumber,
                    totalParts,
                    partPercent: 0
                });
            }
            // Check for abort signal
            if (abortSignal?.aborted) {
                throw new Error('Upload aborted by user');
            }
            // Create headers
            const headers = {
                'Content-Type': 'application/octet-stream',
            };
            // Set Content-Length only in Node.js (Buffer). In browsers, Content-Length
            // is a forbidden header that gets silently stripped — the browser calculates
            // it automatically from the body.
            if (typeof Buffer !== 'undefined' && data instanceof Buffer) {
                headers['Content-Length'] = data.length.toString();
            }
            // Upload the part
            // Note: Buffer extends Uint8Array, which is a valid BodyInit type
            const response = await fetch(signedUrl, {
                method: 'PUT',
                headers,
                body: data,
                signal: abortSignal
            });
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }
            // Get ETag from response headers
            const eTag = response.headers.get('ETag')?.replace(/['"]/g, '') || '';
            if (!eTag) {
                throw new Error('Server did not return an ETag');
            }
            // Report completion of part upload
            if (onPartProgress) {
                onPartProgress({
                    partNumber,
                    totalParts,
                    partPercent: 100
                });
            }
            return {
                ETag: eTag,
                PartNumber: partNumber
            };
        }
        catch (error) {
            // Handle retries
            if (attempt < maxRetries) {
                console.warn(`Part ${partNumber} upload failed (attempt ${attempt}/${maxRetries}). Retrying...`);
                // Exponential backoff with jitter
                const delay = Math.min(1000 * Math.pow(2, attempt - 1) * (0.9 + Math.random() * 0.2), 10000);
                await new Promise(resolve => setTimeout(resolve, delay));
                return uploadPart(signedUrl, partNumber, totalParts, data, options, attempt + 1);
            }
            throw error;
        }
    }
    return {
        /**
         * Retrieves a specific asset by its ID with optional chat data.
         * @param {string} assetId - The ID of the asset.
         * @param {GetAssetParams} [params] - Optional parameters for chat data inclusion.
         * @returns {Promise<AssetResponse>} The asset object with optional chat data.
         */
        async getAsset(assetId, params) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Lists every location an asset is referenced — its primary file system and
         * each secondary reference (reviewer, submission, public), grouped and counted.
         *
         * Renaming an asset retitles it at every one of these locations, and deleting
         * its last primary reference removes them all — so this is what the rename and
         * delete confirmations show the user before either happens.
         *
         * @param {string} assetId - The ID of the asset.
         * @returns {Promise<AssetReferences>} The asset's references.
         */
        async getAssetReferences(assetId) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/references`,
                sendJWT: true,
            });
        },
        /**
         * Updates an asset.
         * @param {string} assetId - The ID of the asset to update.
         * @param {UpdateAssetData} updateData - Data to update (e.g., name, meta, tags, folderId).
         * @returns {Promise<AssetResponse>} The updated asset object.
         */
        async updateAsset(assetId, updateData) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Deletes an asset (marks for deletion).
         * @param {string} assetId - The ID of the asset to delete.
         * @returns {Promise<void>}
         */
        async deleteAsset(assetId) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/assets/${assetId}`,
                sendJWT: true,
            });
        },
        /**
         * Retrieves a specific file from an asset.
         * @param {string} assetId - The ID of the asset.
         * @param {string} fileId - The ID of the file.
         * @returns {Promise<FileResponse>} The file object.
         */
        async getFile(assetId, fileId) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!fileId)
                throw new Error('fileId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/file/${fileId}`,
                sendJWT: true,
            });
        },
        /**
         * Retrieves files of a specific function type from an asset.
         * @param {string} assetId - The ID of the asset.
         * @param {string} functionType - The function type of the files (e.g., 'thumbnail', 'original').
         * @returns {Promise<FileResponse[]>} An array of file objects.
         */
        async getFilesByFunctionType(assetId, functionType) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!functionType)
                throw new Error('functionType is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/function-type/${functionType}`,
                sendJWT: true,
            });
        },
        /**
         * Complete a multipart upload initiated by `createAssets`.
         *
         * Matches the route (`POST /v1/assets/complete-upload`) and mirrors
         * `nuramaClient.scratch.completeUpload`, so moving between the asset
         * and scratch namespaces uses the same verb.
         *
         * @param {CompleteMultipartUploadData} uploadData - Data including key, uploadId, parts, and assetId.
         * @returns {Promise<any>} S3 completion response.
         */
        async completeUpload(uploadData) {
            if (!uploadData || !uploadData.key || !uploadData.uploadId || !uploadData.parts || !uploadData.assetId) {
                throw new Error('key, uploadId, parts, and assetId are required for completeUpload.');
            }
            return client._request({
                method: 'POST',
                endpoint: '/v1/assets/complete-upload',
                body: uploadData,
                sendJWT: true,
            });
        },
        /**
         * Uploads a file using multipart upload with the provided signed URLs
         * @param {File|Blob|Buffer|string} file - The file to upload (File/Blob in browser, Buffer/string path in Node.js)
         * @param {string[]} signedUrls - Array of signed URLs for each part
         * @param {string} key - The S3 key for the upload
         * @param {string} uploadId - The S3 uploadId for the multipart upload
         * @param {MultipartUploadOptions} options - Upload options
         * @returns {Promise<MultipartUploadResult>} The completed upload data
         */
        async multipartUpload(file, signedUrls, key, uploadId, options = {}) {
            if (!file)
                throw new Error('file is required');
            if (!signedUrls || !signedUrls.length)
                throw new Error('signedUrls array is required and cannot be empty');
            if (!key)
                throw new Error('key is required');
            if (!uploadId)
                throw new Error('uploadId is required');
            const { onProgress, abortSignal, enableProgressPersistence, projectId, sessionId: providedSessionId, fileName, fileSize: providedFileSize, assetId } = options;
            const totalParts = signedUrls.length;
            const completedParts = [];
            // Track progress of each part
            const partProgress = new Array(totalParts).fill(0);
            const calculateTotalProgress = () => {
                const totalPercent = partProgress.reduce((sum, percent) => sum + percent, 0) / totalParts;
                return Math.floor(totalPercent);
            };
            // Initialize upload session if enabled
            let sessionData = null;
            if (enableProgressPersistence && projectId) {
                const actualSessionId = providedSessionId || `upload_${uploadId}_${Date.now()}`;
                const actualFileName = fileName || (typeof file === 'string' ? file.split('/').pop() || 'unknown' : 'unknown');
                let actualFileSize = providedFileSize;
                // Get file size if not provided
                if (!actualFileSize) {
                    if ((typeof File !== 'undefined' && file instanceof File) ||
                        (typeof Blob !== 'undefined' && file instanceof Blob)) {
                        actualFileSize = file.size;
                    }
                    else if (typeof Buffer !== 'undefined' && file instanceof Buffer) {
                        actualFileSize = file.length;
                    }
                }
                try {
                    sessionData = uploadSessionManager.createSession(projectId, actualSessionId, {
                        uploadId,
                        key,
                        fileName: actualFileName,
                        fileSize: actualFileSize || 0,
                        totalParts,
                        assetId
                    });
                }
                catch (error) {
                    console.warn('[SDK] Failed to create upload session:', error);
                }
            }
            try {
                // Get file data according to environment
                let fileSize;
                let getChunk;
                // Browser environment (File/Blob)
                if ((typeof File !== 'undefined' && file instanceof File) ||
                    (typeof Blob !== 'undefined' && file instanceof Blob)) {
                    const blob = file;
                    fileSize = blob.size;
                    getChunk = async (start, end) => {
                        // Read slice into ArrayBuffer to materialize the data before upload.
                        // Passing a Blob reference directly to fetch() can silently send
                        // empty bodies for large files when the browser loses the file handle.
                        const slice = blob.slice(start, end);
                        let buffer;
                        if (typeof slice.arrayBuffer === 'function') {
                            buffer = await slice.arrayBuffer();
                        }
                        else {
                            // React Native Blob polyfill lacks arrayBuffer() — use FileReader fallback
                            buffer = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result);
                                reader.onerror = () => reject(new Error('Failed to read blob chunk'));
                                reader.readAsArrayBuffer(slice);
                            });
                        }
                        if (buffer.byteLength === 0 && end > start) {
                            throw new Error(`Failed to read file bytes ${start}-${end}: got 0 bytes (file may have been modified or removed)`);
                        }
                        return buffer;
                    };
                }
                // Node.js environment with Buffer
                else if (typeof Buffer !== 'undefined' && file instanceof Buffer) {
                    const buffer = file;
                    fileSize = buffer.length;
                    getChunk = async (start, end) => {
                        return buffer.slice(start, end);
                    };
                }
                // Node.js environment with file path
                else if (typeof file === 'string') {
                    // Handle Node.js file reading
                    if (typeof process === 'undefined' || typeof require !== 'function') {
                        throw new Error('File path provided but environment does not support Node.js file system');
                    }
                    try {
                        // Dynamic import of fs module for Node.js
                        const fs = await import('fs/promises');
                        const { stat, open } = fs;
                        // Get file size
                        const stats = await stat(file);
                        fileSize = stats.size;
                        getChunk = async (start, end) => {
                            const fileHandle = await open(file, 'r');
                            try {
                                const length = end - start;
                                const buffer = Buffer.alloc(length);
                                await fileHandle.read(buffer, 0, length, start);
                                return buffer;
                            }
                            finally {
                                await fileHandle.close();
                            }
                        };
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        throw new Error(`Failed to read file: ${errorMessage}`);
                    }
                }
                else {
                    throw new Error('Unsupported file type. Must be File, Blob, Buffer, or string path in Node.js');
                }
                const chunkSize = Math.ceil(fileSize / totalParts);
                // Upload each part
                for (let i = 0; i < totalParts; i++) {
                    if (abortSignal?.aborted) {
                        throw new Error('Upload aborted by user');
                    }
                    const partNumber = i + 1;
                    const start = i * chunkSize;
                    const end = Math.min((i + 1) * chunkSize, fileSize);
                    // Calculate current total progress (based on completed parts so far)
                    const currentTotalProgress = calculateTotalProgress();
                    client._log(`[DEBUG] Uploading part ${partNumber}/${totalParts}, bytes ${start}-${end - 1} of ${fileSize}, totalPercentComplete: ${currentTotalProgress}%`);
                    // Get the chunk data
                    const chunkData = await getChunk(start, end);
                    // Create part-specific options with progress callback
                    const partOptions = {
                        maxRetries: options.maxRetries,
                        abortSignal: abortSignal,
                        onPartProgress: onProgress ? (progress) => {
                            // Update this part's progress
                            partProgress[i] = progress.partPercent;
                            const totalPercentComplete = calculateTotalProgress();
                            // Update upload session if enabled
                            if (sessionData) {
                                try {
                                    const completedPartsArray = partProgress
                                        .map((percent, index) => percent === 100 ? index + 1 : null)
                                        .filter(part => part !== null);
                                    uploadSessionManager.updateProgress(sessionData.projectId, sessionData.sessionId, {
                                        progress: totalPercentComplete,
                                        partNumber: progress.partNumber,
                                        completedParts: completedPartsArray
                                    });
                                }
                                catch (error) {
                                    console.warn('[SDK] Failed to update upload session progress:', error);
                                }
                            }
                            // Call user's progress callback with complete information
                            onProgress({
                                partNumber: progress.partNumber,
                                totalParts: progress.totalParts,
                                percentComplete: progress.partPercent,
                                totalPercentComplete
                            });
                        } : undefined
                    };
                    // Upload the part
                    const part = await uploadPart(signedUrls[i], partNumber, totalParts, chunkData, partOptions);
                    completedParts.push(part);
                }
                // Sort parts by part number to ensure correct order
                completedParts.sort((a, b) => a.PartNumber - b.PartNumber);
                // Mark upload session as completing if enabled
                if (sessionData) {
                    try {
                        uploadSessionManager.updateStatus(sessionData.projectId, sessionData.sessionId, 'completing');
                    }
                    catch (error) {
                        console.warn('[SDK] Failed to update upload session status to completing:', error);
                    }
                }
                return {
                    key,
                    uploadId,
                    parts: completedParts
                };
            }
            catch (error) {
                // Mark upload session as failed if enabled
                if (sessionData) {
                    try {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        uploadSessionManager.updateStatus(sessionData.projectId, sessionData.sessionId, 'failed', errorMessage);
                    }
                    catch (sessionError) {
                        console.warn('[SDK] Failed to update upload session status to failed:', sessionError);
                    }
                }
                // Re-throw the original error
                throw error;
            }
        },
        /**
         * Gets the page number an asset appears on based on specified filters and sorting.
         * @param {string} assetId - The ID of the asset to find the page for.
         * @param {GetAssetPageParams} [params] - Query parameters for sorting, filtering, and pagination limit.
         * @returns {Promise<AssetPageResponse>} Object containing the page number.
         */
        async getAssetPage(assetId, params) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/page/${assetId}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Attempts to repair assets (e.g., regenerate signed URLs for pending uploads).
         * @param {string[]} assetIds - An array of asset IDs to repair.
         * @returns {Promise<RepairAssetsResponse>} Array of repair results.
         */
        async repairAssets(assetIds) {
            if (!assetIds || assetIds.length === 0)
                throw new Error('assetIds array is required and cannot be empty.');
            return client._request({
                method: 'POST',
                endpoint: '/v1/assets/repair',
                body: { assetIds },
                sendJWT: true,
            });
        },
        /**
         * Generates signed download URLs for the original files of specified assets.
         * @param {string[]} assetIds - An array of asset IDs.
         * @returns {Promise<DownloadAssetsResponse>} Array of download URL results.
         */
        async downloadAssets(assetIds) {
            if (!assetIds || assetIds.length === 0)
                throw new Error('assetIds array is required and cannot be empty.');
            return client._request({
                method: 'POST',
                endpoint: '/v1/assets/download',
                body: { assetIds },
                sendJWT: true,
            });
        },
        /**
         * Mints a short-lived signed URL for rendering a document inline.
         *
         * Documents keep their `media` PDF in the private bucket, so unlike images
         * and video it cannot be addressed by keyPath through the file CDN. Fetch
         * this per document open; do not cache it past `expires`.
         *
         * @param {string} assetId - The document asset's ID.
         * @returns {Promise<DocumentViewUrlResponse>} Signed URL, expiry and page count.
         */
        async getDocumentViewUrl(assetId) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/document-url`,
                sendJWT: true,
            });
        },
        /**
         * Tags an asset with a specific tag.
         * @param {string} assetId - The ID of the asset to tag.
         * @param {TagAssetData} tagData - Data containing the tag ID.
         * @returns {Promise<AssetResponse>} The updated asset object.
         */
        async tagAsset(assetId, tagData) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!tagData.tagId)
                throw new Error('tagId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}/tag`,
                body: tagData,
                sendJWT: true,
            });
        },
        /**
         * Untags an asset by removing a specific tag.
         * @param {string} assetId - The ID of the asset to untag.
         * @param {UntagAssetData} untagData - Data containing the tag ID to remove.
         * @returns {Promise<AssetResponse>} The updated asset object.
         */
        async untagAsset(assetId, untagData) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!untagData.tagId)
                throw new Error('tagId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}/untag`,
                body: untagData,
                sendJWT: true,
            });
        },
        /**
         * Creates a short link for an asset.
         * If a short link already exists for the asset with the same visibility, returns the existing one.
         * @param {string} assetId - The ID of the asset to create a short link for.
         * @param {CreateAssetShortLinkData} [data] - Optional data including visibility context.
         * @returns {Promise<CreateAssetShortLinkResponse>} The short link object and short URL.
         */
        async createShortLink(assetId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/shortlink`,
                params: data,
                sendJWT: true,
            });
        },
        // ========================================================================
        // Public Asset Link Methods
        // ========================================================================
        /**
         * Create a public download link for an asset.
         * @param {string} assetId - The asset ID.
         * @param {Object} data - Link creation data.
         * @param {string} data.projectId - The project ID.
         * @param {number} [data.validity] - Link validity in milliseconds.
         * @returns {Promise<PublicAssetLink>} The created public link.
         */
        async createPublicLink(assetId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/public-links`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Get all public download links for an asset.
         * @param {string} assetId - The asset ID.
         * @returns {Promise<{ results: PublicAssetLink[] }>} The public links.
         */
        async getPublicLinks(assetId, options) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/public-links`,
                sendJWT: true,
                bypassCache: options?.bypassCache,
            });
        },
        /**
         * Update a public download link (extend expiration or change status).
         * @param {string} assetId - The asset ID.
         * @param {string} linkId - The link ID.
         * @param {Object} data - Update data.
         * @returns {Promise<PublicAssetLink>} The updated public link.
         */
        async updatePublicLink(assetId, linkId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!linkId)
                throw new Error('linkId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}/public-links/${linkId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Disable a public download link.
         * @param {string} assetId - The asset ID.
         * @param {string} linkId - The link ID.
         * @returns {Promise<PublicAssetLink>} The disabled public link.
         */
        async disablePublicLink(assetId, linkId) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!linkId)
                throw new Error('linkId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}/public-links/${linkId}/disable`,
                sendJWT: true,
            });
        },
        /**
         * Reactivate a disabled/expired public download link.
         * @param {string} assetId - The asset ID.
         * @param {string} linkId - The link ID.
         * @param {Object} [data] - Reactivation data.
         * @param {number} [data.validity] - New validity in milliseconds.
         * @returns {Promise<PublicAssetLink>} The reactivated public link.
         */
        async reactivatePublicLink(assetId, linkId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!linkId)
                throw new Error('linkId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/assets/${assetId}/public-links/${linkId}/reactivate`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Mint a signed multipart upload URL for a user-supplied custom thumbnail
         * image. The upload lands in the originals bucket tagged so the
         * post-processing Lambda generates the customThumbnail outputs and
         * registers them on the asset via the file-update callback.
         *
         * Caller flow:
         *   1. multipartUpload(file, response.urls, response.key, response.uploadId)
         *   2. completeCustomThumbnailUpload({ assetId, key, uploadId, parts })
         *   3. wait for the assetFileUpdate websocket event
         */
        async getCustomThumbnailUploadUrl(assetId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!data?.fileName || !data?.mimeType || !data?.sizeInMB) {
                throw new Error('fileName, mimeType, and sizeInMB are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/custom-thumbnail/upload-url`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Finalize the multipart S3 upload for a custom thumbnail. Triggers the
         * post-processing Lambda by committing the S3 object.
         */
        async completeCustomThumbnailUpload(assetId, data) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!data?.key || !data?.uploadId || !data?.parts?.length) {
                throw new Error('key, uploadId, and parts are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/custom-thumbnail/complete-upload`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Remove the custom thumbnail from an asset. Soft-deletes all custom
         * thumb files; the asset falls back to the auto-generated thumbnail.
         */
        async removeCustomThumbnail(assetId) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/assets/${assetId}/custom-thumbnail`,
                sendJWT: true,
            });
        },
        /**
         * Promote a chat-message attachment into a project as a fresh,
         * independent project asset. The source attachment is left untouched;
         * the new project asset has its own lifecycle, post-processing
         * pipeline, and storage footprint.
         *
         * Idempotent: a second promote of the same source into the same
         * project returns the existing promoted asset with `deduped: true`.
         *
         * Requires `canCreateAsset` on the destination project — reviewers
         * are blocked. The server additionally rejects when the source
         * attachment's workspace doesn't match the destination project's.
         */
        async promoteAttachmentToProject(assetId, payload) {
            if (!assetId)
                throw new Error('assetId is required.');
            if (!payload?.projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/promote-to-project`,
                body: payload,
                sendJWT: true,
            });
        },
        /**
         * Upload Session Management Methods
         */
        /**
         * Get all active upload sessions for a project
         * @param {string} projectId - The project ID to get sessions for
         * @returns {UploadSessionData[]} Array of upload session data
         */
        getUploadSessions(projectId) {
            if (!projectId)
                throw new Error('projectId is required');
            return uploadSessionManager.getProjectSessions(projectId);
        },
        /**
         * True when any upload is genuinely in flight anywhere in the app (across
         * all projects and tabs). Intended for app-level guards — e.g. suppressing
         * an automatic version-update page refresh while bytes are still uploading.
         * Stale (crashed-tab) sessions are ignored via the freshness window.
         * @param {number} [staleMs] - Max age of the last progress update that still
         *   counts as active (default: 2 minutes)
         * @returns {boolean}
         */
        hasActiveUploads(staleMs) {
            return uploadSessionManager.hasActiveUploads(staleMs);
        },
        /**
         * Get a specific upload session
         * @param {string} projectId - The project ID
         * @param {string} sessionId - The session ID
         * @returns {UploadSessionData | null} Upload session data or null if not found
         */
        getUploadSession(projectId, sessionId) {
            if (!projectId)
                throw new Error('projectId is required');
            if (!sessionId)
                throw new Error('sessionId is required');
            return uploadSessionManager.getSession(projectId, sessionId);
        },
        /**
         * Remove an upload session
         * @param {string} projectId - The project ID
         * @param {string} sessionId - The session ID
         */
        removeUploadSession(projectId, sessionId) {
            if (!projectId)
                throw new Error('projectId is required');
            if (!sessionId)
                throw new Error('sessionId is required');
            uploadSessionManager.removeSession(projectId, sessionId);
        },
        /**
         * Clean up old upload sessions for a project
         * @param {string} projectId - The project ID
         * @param {number} [olderThanMs] - Remove sessions older than this (default: 24 hours)
         */
        cleanupUploadSessions(projectId, olderThanMs) {
            if (!projectId)
                throw new Error('projectId is required');
            uploadSessionManager.cleanupSessions(projectId, olderThanMs);
        },
        /**
         * Register a listener for cross-tab upload session messages
         * @param {string} listenerId - Unique listener ID
         * @param {function} callback - Callback function to handle messages
         */
        onUploadSessionMessage(listenerId, callback) {
            if (!listenerId)
                throw new Error('listenerId is required');
            if (typeof callback !== 'function')
                throw new Error('callback must be a function');
            uploadSessionManager.onMessage(listenerId, callback);
        },
        /**
         * Unregister a cross-tab upload session message listener
         * @param {string} listenerId - Unique listener ID
         */
        offUploadSessionMessage(listenerId) {
            if (!listenerId)
                throw new Error('listenerId is required');
            uploadSessionManager.offMessage(listenerId);
        },
        /**
         * Mark an upload session as completed
         * @param {string} projectId - The project ID
         * @param {string} sessionId - The session ID
         */
        completeUploadSession(projectId, sessionId) {
            if (!projectId)
                throw new Error('projectId is required');
            if (!sessionId)
                throw new Error('sessionId is required');
            uploadSessionManager.updateStatus(projectId, sessionId, 'completed');
        },
        // ========================================================================
        // Access Activity Methods (play / download / embed metrics)
        // ========================================================================
        /**
         * Record an authenticated play event from the in-app player. Fire-and-forget;
         * server returns 204. Throw-on-failure is fine because the caller already
         * de-dupes per session.
         */
        async recordAccessActivity(assetId, body) {
            if (!assetId)
                throw new Error('assetId is required.');
            await client._request({
                method: 'POST',
                endpoint: `/v1/assets/${assetId}/access-activity`,
                body,
                sendJWT: true,
            });
        },
        /**
         * Get aggregated access-activity for a single asset. Returns totals per
         * eventType, a breakdown for the requested dimension, and a zero-filled
         * daily series.
         */
        async getAssetAccessActivity(assetId, params) {
            if (!assetId)
                throw new Error('assetId is required.');
            const query = new URLSearchParams();
            if (params?.range)
                query.set('range', params.range);
            if (params?.groupBy)
                query.set('groupBy', params.groupBy);
            if (params?.eventType)
                query.set('eventType', params.eventType);
            if (params?.limit != null)
                query.set('limit', String(params.limit));
            const qs = query.toString();
            return client._request({
                method: 'GET',
                endpoint: `/v1/assets/${assetId}/access-activity${qs ? `?${qs}` : ''}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=asset.js.map