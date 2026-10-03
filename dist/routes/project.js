export default function createProjectMethods(client) {
    return {
        /**
         * Creates a new project.
         * @param {CreateProjectData} projectData - Data for the new project.
         * @returns {Promise<ProjectResponse>} The created project object.
         */
        async createProject(projectData) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/projects',
                body: projectData,
                sendJWT: true,
            });
        },
        /**
         * Retrieves projects accessible by the user.
         * NOTE: API endpoint `/v1/projects` does not currently support pagination.
         * @returns {Promise<ProjectResponse[]>} List of project objects.
         */
        async getProjects() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/projects',
                sendJWT: true,
            });
        },
        /**
         * Retrieves a specific project by its ID.
         * @param {string} projectId - The ID of the project.
         * @returns {Promise<ProjectResponse>} The project object.
         */
        async getProject(projectId) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}`,
                sendJWT: true,
            });
        },
        /**
         * Updates a project.
         * @param {string} projectId - The ID of the project to update.
         * @param {UpdateProjectData} updateData - Data to update.
         * @returns {Promise<ProjectResponse>} The updated project object.
         */
        async updateProject(projectId, updateData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Updates a single project setting (e.g. `aiPolishEnabled`,
         * `aiCustomPreprompt`). Pass `null` to inherit the workspace's value;
         * pass a typed value to override. The valid setting names are validated
         * server-side against `projectService.validProjectSettings`.
         *
         * @param {string} projectId
         * @param {string} name - Setting key (e.g. 'aiPolishEnabled').
         * @param {unknown} value - null (inherit) | boolean | string.
         */
        async updateSetting(projectId, name, value) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!name)
                throw new Error('name is required.');
            return client._request({
                method: 'PATCH',
                endpoint: `/v1/projects/${projectId}/settings/${encodeURIComponent(name)}`,
                body: { value },
                sendJWT: true,
            });
        },
        /**
         * Full-text search across assets, chat messages, and tasks within a project.
         * Results are populated per the content type's native list view (asset →
         * creator/publisher/tags; chatMessage → author/mentions/attachments; task →
         * creator/assignee/project/origin).
         *
         * @param {string} projectId
         * @param {SearchProjectParams} params - At minimum `q`. Optional filters: `contentTypes`, `dateFrom`, `dateTo`, `creatorId`, `sortBy`, `page`, `limit`.
         * @returns {Promise<SearchResponse>} Paginated search results.
         */
        async searchProject(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!params || !params.q)
                throw new Error('params.q is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/search`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Deletes a project (marks for deletion).
         * @param {string} projectId - The ID of the project to delete.
         * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
         */
        async deleteProject(projectId) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/projects/${projectId}`,
                sendJWT: true,
            });
        },
        /**
         * Creates a new logo asset for a project.
         * @param {string} projectId - The ID of the project.
         * @param {LogoUploadData} logoData - File metadata for the logo.
         * @returns {Promise<any>} Object containing signed URL data and updated project info.
         */
        async createLogo(projectId, logoData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/logo`,
                body: logoData,
                sendJWT: true,
            });
        },
        /**
         * Updates the logo asset for a project.
         * @param {string} projectId - The ID of the project.
         * @param {LogoUploadData} logoData - File metadata for the new logo.
         * @returns {Promise<any>} Object containing signed URL data and updated project info.
         */
        async updateLogo(projectId, logoData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/logo`,
                body: logoData,
                sendJWT: true,
            });
        },
        /**
         * Create assets within a project and return their signed links for upload.
         * @param {string} projectId - The ID of the project.
         * @param {ProjectFileUploadBody} fileUploadBody - List of files to upload with optional destination path.
         * @returns {Promise<any[]>} Array of results, each containing asset info and signed URL data.
         */
        async createAssets(projectId, fileUploadBody) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}`,
                body: fileUploadBody,
                sendJWT: true,
            });
        },
        // --- Asset Listing ---
        /**
         * Gets the home feed for a project with a specified visibility.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {ListFeedParams} [params] - Query parameters for filtering and pagination.
         * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated feed items.
         */
        async getHomeFeed(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/feed/${visibility}`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Event Feed ---
        /**
         * Gets one page of the project's event feed (uploads, asset discussions,
         * publishes, submissions and public releases), most recent activity first.
         * The creator and reviewer feeds never share events.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - Which feed to read.
         * @param {ListFeedEventsParams} [params] - Filters and cursor.
         * @returns {Promise<CursorPaginatedFeedEvents>} One page of feed events.
         */
        async getFeedEvents(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/feed-events/${visibility}`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Sets your reaction on a feed event. One per person — a new emoji
         * replaces your previous one.
         * @returns {Promise<FeedEvent>} The updated event.
         */
        async setFeedEventReaction(projectId, visibility, eventId, emoji) {
            if (!projectId || !visibility || !eventId)
                throw new Error('projectId, visibility and eventId are required.');
            if (!emoji)
                throw new Error('emoji is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
                body: { emoji },
                sendJWT: true,
            });
        },
        /**
         * Removes your reaction from a feed event.
         * @returns {Promise<FeedEvent>} The updated event.
         */
        async removeFeedEventReaction(projectId, visibility, eventId) {
            if (!projectId || !visibility || !eventId)
                throw new Error('projectId, visibility and eventId are required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
                sendJWT: true,
            });
        },
        // --- Folder Listing ---
        /**
         * Gets folders within a project with specified visibility.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {ListFoldersParams} [params] - Query parameters for filtering and pagination.
         * @returns {Promise<PaginatedResponse<FolderResponse>>} Paginated list of folders.
         */
        async getFolders(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            // Use file system API with folder filter
            const fileSystemParams = {
                ...params,
                resourceType: 'folder',
                mediaTypes: ['folder'],
            };
            return this.getItemsAtPath(projectId, visibility, '', fileSystemParams);
        },
        // --- Chat ---
        /**
         * Gets the project chat with the specified visibility.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {GetChatParams} [params] - Query parameters for message/reply limits.
         * @returns {Promise<ChatResponse>} The chat object.
         */
        async getProjectChat(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/chat/${visibility}`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Submissions ---
        /**
         * Creates a new submission for a project.
         * @param {string} projectId - The ID of the project.
         * @param {CreateSubmissionData} submissionData - Data for the submission.
         * @returns {Promise<SubmissionResponse>} The created submission object.
         */
        async createSubmission(projectId, submissionData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/submission`,
                body: submissionData,
                sendJWT: true,
            });
        },
        /**
         * Adds items to an existing submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {AddItemsToSubmissionData} addItemsData - Data for adding items to the submission.
         * @returns {Promise<SubmissionResponse>} The updated submission object.
         */
        async addItemsToSubmission(projectId, submissionId, addItemsData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/add`,
                body: addItemsData,
                sendJWT: true,
            });
        },
        /**
         * Retrieves submissions for a project.
         * @param {string} projectId - The ID of the project.
         * @param {ListSubmissionsParams} [params] - Query parameters for filtering and pagination.
         * @returns {Promise<PaginatedResponse<SubmissionResponse>>} Paginated list of submissions.
         */
        async getSubmissions(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/submission`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Retrieves a specific submission by its ID.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {GetSubmissionParams} [params] - Query parameters for chat message/reply options.
         * @returns {Promise<SubmissionResponse>} The submission object.
         */
        async getSubmission(projectId, submissionId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Updates a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {UpdateSubmissionData} updateData - Data to update.
         * @returns {Promise<SubmissionResponse>} The updated submission object.
         */
        async updateSubmission(projectId, submissionId, updateData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Releases a staged (unreleased) submission, making it visible to reviewers
         * and firing the deferred "new submission" side effects (emails,
         * notifications, system messages).
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @returns {Promise<SubmissionResponse>} The released submission object.
         */
        async releaseSubmission(projectId, submissionId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release`,
                sendJWT: true,
            });
        },
        /**
         * Re-releases an already-released submission's side effects (the "Release
         * Update" action) — re-notifies reviewers with the submission-update email
         * template + `submissionUpdate` notification. Does not change status.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @returns {Promise<SubmissionResponse>} The submission object.
         */
        async releaseSubmissionUpdate(projectId, submissionId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release-update`,
                sendJWT: true,
            });
        },
        /**
         * Gets files for a specific submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {string} [path] - The path to get items from (optional, defaults to root).
         * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
         * @returns {Promise<PaginatedResponse<any>>} Paginated list of files.
         */
        async getSubmissionItems(projectId, submissionId, path, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            // Build endpoint with optional path segment (backend supports wildcard paths)
            let endpoint = `/v1/projects/${projectId}/submission/${submissionId}/files`;
            if (path && typeof path === 'string' && path.trim() !== '') {
                // Add path to URL - backend route supports /:path(*) wildcard
                endpoint += `/${encodeURIComponent(path)}`;
            }
            return client._request({
                method: 'GET',
                endpoint,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Creates a folder within a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {CreateSubmissionFolderData} folderData - Data for creating the folder.
         * @returns {Promise<FolderResponse>} The created folder object.
         */
        async createSubmissionFolder(projectId, submissionId, folderData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/create-folder`,
                body: folderData,
                sendJWT: true,
            });
        },
        /**
         * Moves items within a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {MoveSubmissionItemsData} moveData - Data for moving items.
         * @returns {Promise<{count: number}>} Object containing the count of moved items.
         */
        async moveSubmissionItems(projectId, submissionId, moveData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/move`,
                body: moveData,
                sendJWT: true,
            });
        },
        /**
         * Copies items within a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {CopySubmissionItemsData} copyData - Data for copying items.
         * @returns {Promise<{count: number}>} Object containing the count of copied items.
         */
        async copySubmissionItems(projectId, submissionId, copyData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/copy`,
                body: copyData,
                sendJWT: true,
            });
        },
        /**
         * Deletes items within a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {DeleteSubmissionItemsData} deleteData - Data for deleting items.
         * @returns {Promise<{count: number}>} Object containing the count of deleted items.
         */
        async deleteSubmissionItems(projectId, submissionId, deleteData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/delete`,
                body: deleteData,
                sendJWT: true,
            });
        },
        /**
         * Adds a tag to a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {TagSubmissionData} tagData - Data for tagging the submission.
         * @returns {Promise<SubmissionResponse>} The updated submission object.
         */
        async tagSubmission(projectId, submissionId, tagData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/tag`,
                body: tagData,
                sendJWT: true,
            });
        },
        /**
         * Removes a tag from a submission.
         * @param {string} projectId - The ID of the project.
         * @param {string} submissionId - The ID of the submission.
         * @param {TagSubmissionData} tagData - Data for untagging the submission.
         * @returns {Promise<SubmissionResponse>} The updated submission object.
         */
        async untagSubmission(projectId, submissionId, tagData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!submissionId)
                throw new Error('submissionId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/submission/${submissionId}/untag`,
                body: tagData,
                sendJWT: true,
            });
        },
        // --- Publishing / File System Functions ---
        /**
         * Publishes a list of items (assets, folders) within a project.
         * @param {string} projectId - The ID of the project.
         * @param {PublishItemsData} publishData - Data for publishing items.
         * @returns {Promise<any>} Object containing lists of published items and results.
         */
        async publishItems(projectId, publishData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/publish`,
                body: publishData,
                sendJWT: true,
            });
        },
        /**
         * Unpublishes a list of items (assets, folders) within a project.
         * @param {string} projectId - The ID of the project.
         * @param {UnpublishItemsData} unpublishData - Data for unpublishing items.
         * @returns {Promise<any>} Object containing lists of unpublished items and results.
         */
        async unpublishItems(projectId, unpublishData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/unpublish`,
                body: unpublishData,
                sendJWT: true,
            });
        },
        /**
         * Creates a folder within a project with file system integration.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {CreateFolderData} folderData - Data for creating the folder.
         * @returns {Promise<FolderResponse>} The created folder object.
         */
        async createFolder(projectId, visibility, folderData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/files/${visibility}/create-folder`,
                body: folderData,
                sendJWT: true,
            });
        },
        /**
         * Gets items at a specific path within a project.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {string} [path] - The path to get items from (optional, defaults to root).
         * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
         * @param {boolean} [usePost] - Whether to use POST method (useful for large resourceIds arrays).
         * @returns {Promise<PaginatedResponse<any>>} Paginated list of items at the path.
         */
        async getItemsAtPath(projectId, visibility, path, params, usePost = false) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            let endpoint = `/v1/projects/${projectId}/files/${visibility}`;
            if (path && path.trim() !== '') {
                endpoint += `/${encodeURIComponent(path)}`;
            }
            // Use POST method if specified (useful for large resourceIds arrays)
            const method = usePost ? 'POST' : 'GET';
            return client._request({
                method: method,
                endpoint: endpoint,
                params: method === 'GET' ? params : undefined,
                body: method === 'POST' ? params : undefined,
                sendJWT: true,
            });
        },
        /**
         * Moves items to a specific path within a project.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {MoveItemsData} moveData - Data for moving items.
         * @returns {Promise<{count: number}>} Object containing the count of moved items.
         */
        async moveItemsToPath(projectId, visibility, moveData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/files/${visibility}/move`,
                body: moveData,
                sendJWT: true,
            });
        },
        /**
         * Copies items to a specific path within a project.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {CopyItemsData} copyData - Data for copying items.
         * @returns {Promise<{count: number}>} Object containing the count of copied items.
         */
        async copyItemsToPath(projectId, visibility, copyData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/files/${visibility}/copy`,
                body: copyData,
                sendJWT: true,
            });
        },
        /**
         * Deletes items at a specific path within a project.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
         * @param {DeleteItemsData} deleteData - Data for deleting items.
         * @returns {Promise<{count: number}>} Object containing the count of deleted items.
         */
        async deleteItemsAtPath(projectId, visibility, deleteData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/files/${visibility}/delete`,
                body: deleteData,
                sendJWT: true,
            });
        },
        /**
         * Asks what deleting these paths would reach, without deleting anything.
         *
         * Computed from the same cascade the delete runs, so the answer is what
         * will happen rather than an estimate of it. Only SECONDARY references
         * come back — the reviewer, submission and public-release copies that
         * would go with the selection.
         *
         * @param {string} projectId
         * @param {'creator'|'reviewer'} visibility
         * @param {DeleteItemsData} deleteData - The same body the delete takes.
         * @returns {Promise<DeleteImpact>}
         */
        async previewDeleteItemsAtPath(projectId, visibility, deleteData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required (creator or reviewer).');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/files/${visibility}/delete-preview`,
                body: deleteData,
                sendJWT: true,
            });
        },
        // --- Public File System Methods ---
        /**
         * Gets all public file systems for a project.
         * @param {string} projectId - The ID of the project.
         * @param {ListPublicFileSystemsParams} [params] - Query parameters (pagination, sort, search, status, creatorId).
         * @returns {Promise<PaginatedResponse<PublicFileSystemResponse>>} Paginated list of public file systems.
         */
        async getPublicFileSystems(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Get the public audit for a project — assets that are or have been publicly exposed.
         *
         * @requires `projectAdmin` or `projectOwner` on the project (or workspace-tier admin via inheritance).
         * @param {string} projectId
         * @param {Object} [params]
         * @param {boolean} [params.currentlyPublic=false] - When true, only assets currently public.
         * @param {number} [params.page]
         * @param {number} [params.limit]
         */
        async getPublicAudit(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public-audit`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Creates a public file system with a secure token for sharing project assets publicly.
         * @param {string} projectId - The ID of the project.
         * @param {CreatePublicFileSystemData} publicFileSystemData - Data for creating the public file system.
         * @returns {Promise<PublicFileSystemResponse>} The created public file system object.
         */
        async createPublicFileSystem(projectId, publicFileSystemData) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public`,
                body: publicFileSystemData,
                sendJWT: true,
            });
        },
        /**
         * Updates an existing public file system's title and description.
         * @param {string} projectId - The ID of the project.
         * @param {string} publicId - The ID of the public file system.
         * @param {UpdatePublicFileSystemData} updateData - Data to update.
         * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
         */
        async updatePublicFileSystem(projectId, publicId, updateData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!publicId)
                throw new Error('publicId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/public/${publicId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Releases a staged (unreleased) public file system, making it externally
         * accessible via its public token.
         * @param {string} projectId - The ID of the project.
         * @param {string} publicId - The ID of the public file system.
         * @returns {Promise<PublicFileSystemResponse>} The released public file system object.
         */
        async releasePublicFileSystem(projectId, publicId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!publicId)
                throw new Error('publicId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${publicId}/release`,
                sendJWT: true,
            });
        },
        /**
         * Retrieves a specific public file system by its ID.
         * @param {string} projectId - The ID of the project.
         * @param {string} publicId - The ID of the public file system.
         * @returns {Promise<PublicFileSystemResponse>} The public file system object.
         */
        async getPublicFileSystem(projectId, publicId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!publicId)
                throw new Error('publicId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public/${publicId}`,
                sendJWT: true,
            });
        },
        /**
         * Deletes a public file system and invalidates its access token.
         * @param {string} projectId - The ID of the project.
         * @param {string} publicId - The ID of the public file system.
         * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
         */
        async deletePublicFileSystem(projectId, publicId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!publicId)
                throw new Error('publicId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/projects/${projectId}/public/${publicId}`,
                sendJWT: true,
            });
        },
        /**
         * Adds additional items to an existing public file system.
         * @param {string} projectId - The ID of the project.
         * @param {string} publicId - The ID of the public file system.
         * @param {AddItemsToPublicFileSystemData} addItemsData - Data for adding items.
         * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
         */
        async addItemsToPublicFileSystem(projectId, publicId, addItemsData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!publicId)
                throw new Error('publicId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${publicId}/add`,
                body: addItemsData,
                sendJWT: true,
            });
        },
        /**
         * Gets items from a public file system at a specific path (authenticated management).
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {string} [path] - The path to get items from (optional, defaults to root).
         * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
         * @returns {Promise<PaginatedResponse<any>>} Paginated list of public file system items.
         */
        async getPublicItemsAtPath(projectId, token, path, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            let endpoint = `/v1/projects/${projectId}/public/${token}/files`;
            if (path && path.trim() !== '') {
                endpoint += `/${encodeURIComponent(path)}`;
            }
            return client._request({
                method: 'GET',
                endpoint,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Moves items within a public file system (authenticated management).
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {MovePublicItemsData} moveData - Data for moving items.
         * @returns {Promise<{count: number}>} Object containing the count of moved items.
         */
        async movePublicItemsAtPath(projectId, token, moveData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/public/${token}/files/move`,
                body: moveData,
                sendJWT: true,
            });
        },
        /**
         * Copies items within a public file system (authenticated management).
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {CopyPublicItemsData} copyData - Data for copying items.
         * @returns {Promise<{count: number}>} Object containing the count of copied items.
         */
        async copyPublicItemsAtPath(projectId, token, copyData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/public/${token}/files/copy`,
                body: copyData,
                sendJWT: true,
            });
        },
        /**
         * Deletes items from a public file system (authenticated management).
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {DeletePublicItemsData} deleteData - Data for deleting items.
         * @returns {Promise<{count: number}>} Object containing the count of deleted items.
         */
        async deletePublicItemsAtPath(projectId, token, deleteData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/projects/${projectId}/public/${token}/files/delete`,
                body: deleteData,
                sendJWT: true,
            });
        },
        /**
         * Creates a folder inside a public file system (authenticated management).
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {CreateFolderData} folderData - Data for creating the folder (name, color, basePath).
         * @returns {Promise<FolderResponse>} The created folder object.
         */
        async createPublicFolder(projectId, token, folderData) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${token}/files/create-folder`,
                body: folderData,
                sendJWT: true,
            });
        },
        /**
         * Gets a public chat from an authenticated project context.
         * Unlike the public endpoint, this does NOT check token expiration.
         * Use this for internal management of public file systems.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @returns {Promise<any>} The public chat or null if none exists.
         */
        async getProjectPublicChat(projectId, token) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public/${token}/chat`,
                sendJWT: true,
            });
        },
        /**
         * Gets a public asset with its public chat from an authenticated project context.
         * Unlike the public endpoint, this does NOT check token expiration.
         * Use this for internal management of public file systems.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {string} assetId - The ID of the asset to retrieve.
         * @returns {Promise<PublicAssetResponse>} The asset with its public chat.
         */
        async getProjectPublicAsset(projectId, token, assetId) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}`,
                sendJWT: true,
            });
        },
        /**
         * Gets messages from a public chat from an authenticated project context.
         * Unlike the public endpoint, this does NOT check token expiration.
         * Use this for internal management of public file systems.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {string} chatId - The ID of the chat.
         * @param {GetPublicChatMessagesParams} [params] - Query parameters for pagination.
         * @returns {Promise<PublicChatMessagesResponse>} Paginated list of chat messages.
         */
        async getProjectPublicChatMessages(projectId, token, chatId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Creates a message in an existing public chat from an authenticated project context.
         * Unlike the public endpoint, this does NOT check token expiration.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {string} chatId - The ID of the chat.
         * @param {CreatePublicChatMessageRequest} data - Message data.
         * @returns {Promise<ChatMessage>} The created message.
         */
        async createProjectPublicChatMessage(projectId, token, chatId, data) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Creates a message on the main public topic chat from an authenticated project context.
         * Creates the chat lazily if it doesn't exist yet.
         * Unlike the public endpoint, this does NOT check token expiration.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {CreatePublicChatMessageRequest} data - Message data.
         * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
         */
        async createProjectPublicTopicChatMessage(projectId, token, data) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${token}/chat/messages`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Creates a message on an asset's public chat from an authenticated project context.
         * Creates the chat lazily if it doesn't exist yet.
         * Unlike the public endpoint, this does NOT check token expiration.
         *
         * @param {string} projectId - The ID of the project.
         * @param {string} token - The public access token.
         * @param {string} assetId - The ID of the asset.
         * @param {CreatePublicChatMessageRequest} data - Message data.
         * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
         */
        async createProjectPublicAssetChatMessage(projectId, token, assetId, data) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!token)
                throw new Error('token is required.');
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}/messages`,
                body: data,
                sendJWT: true,
            });
        },
        // --- Highlighted Messages ---
        /**
         * Lists a project's assets for one visibility tier.
         * `creator` requires `canGetCreatorAssets`; `reviewer` requires `canGetReviewerAssets`.
         * @param {string} projectId - The project ID.
         * @param {'creator'|'reviewer'} visibility - Which tier's assets to list.
         * @param {ListAssetsParams} [params] - Filters and pagination. See ListAssetsParams.
         * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated assets.
         * @throws {Error} 'projectId is required.' or 'visibility is required.'.
         */
        async getAssets(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/assets/${visibility}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Lists highlighted chat messages across a project for one visibility tier (cursor pagination only).
         * `creator` requires `canGetCreatorHighlights`; `reviewer` requires `canGetReviewerHighlights`.
         * @param {string} projectId - The project ID.
         * @param {'creator'|'reviewer'} visibility - Which tier's highlights to list.
         * @param {GetHighlightedMessagesParams} [params] - Cursor pagination. See GetHighlightedMessagesParams.
         * @returns {Promise<PaginatedResponse<ChatMessage>>} Paginated highlighted messages.
         * @throws {Error} 'projectId is required.' or 'visibility is required.'.
         */
        async getHighlightedMessages(projectId, visibility, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/${visibility}/highlighted-messages`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Top-N assets in a project by access-activity event type (plays, downloads, embeds).
         * Requires project read access. Returns asset IDs and counts only; hydrate names and
         * thumbnails through the normal asset fetch path.
         * @param {string} projectId - The project ID.
         * @param {object} [params] - `range` ('7d' | '30d' | '90d'), `eventType`, `limit`.
         * @returns {Promise<ProjectTopAccessActivityResponse>} Ranked asset IDs with counts.
         * @throws {Error} 'projectId is required.' when `projectId` is falsy.
         */
        async getTopAccessActivity(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/access-activity/top-assets`,
                params,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=project.js.map