import type { ObjectId } from './common';
import type { PublicUser } from './user';
import type { Folder } from './folder';
/**
 * Represents a file associated with an asset.
 */
export interface File {
    /**
     * ID of the asset the file belongs to.
     * @format objectId
     */
    assetId: ObjectId;
    /**
     * The path the file is available at when added to the base media url.
     * @example /project/asset/file123.jpg
     */
    keyPath: string;
    /**
     * The checksum of the file.
     */
    checksum?: string;
    /**
     * This is a placeholder for sometime in the future where we may require multiple hashing algorithms.
     * @default md5
     */
    checksumAlgorithm?: 'md5';
    /**
     * The full name of the file, including extension.
     */
    name: string;
    /**
     * This type is used to determine the file's purpose, not the file type (video, image, etc.).
     * Mirrors `contentTypes.file` in the API, plus `waveform`: the audio peaks
     * JSON the process-media container registers for audio assets.
     */
    functionType: 'original' | 'thumbnail' | 'stream' | 'media' | 'customThumbnailOriginal' | 'customThumbnail' | 'documentText' | 'storyboard' | 'waveform';
    /**
     * The size of the file in bytes.
     */
    sizeInBytes: number;
    /**
     * The status of the file.
     * @default active
     */
    status: 'active' | 'pendingDelete' | 'inactive';
    /**
     * Additional metadata for the file.
     * @default {}
     */
    meta?: Record<string, any>;
    /**
     * The timestamp when the file was created.
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the file was last updated.
     * @format int64
     */
    updatedAt?: number;
}
/**
 * Represents an asset, which can be a file, image, video, etc., associated with a resource.
 */
export interface Asset {
    /**
     * The id of the asset.
     * @format objectId
     */
    id: ObjectId;
    /**
     * The id of the resource that the asset is attached to.
     * @format objectId
     */
    ownerResourceId: ObjectId;
    /**
     * The type of the owner resource.
     */
    ownerResourceType: 'project' | 'user' | 'chatMessage';
    /**
     * If the asset is in a folder the folder ID goes here. If not this is null.
     * @format objectId
     * @default null
     */
    folderId?: ObjectId | null;
    /**
     * Populated folder data.
     */
    folder?: Folder | ObjectId | null;
    /**
     * The ID of the user who created the asset.
     * @format objectId
     */
    creatorId: ObjectId;
    /**
     * Public user information of the creator.
     */
    creator?: PublicUser;
    /**
     * Array of file system entry IDs associated with this asset.
     * @format objectId
     */
    fileSystemPaths?: ObjectId[];
    /**
     * The path used by the file system (like an S3 bucket) for the asset.
     */
    keyPath: string;
    /**
     * MD5 checksum of original file.
     * @format md5
     */
    checksum: string;
    /**
     * The algorithm used for computing the checksum.
     */
    checksumAlgorithm?: 'md5';
    /**
     * The name of the asset used on the platform.
     */
    name: string;
    /**
     * The URL-friendly slug of the asset name.
     */
    slug?: string;
    /**
     * The function of the asset on the platform.
     */
    functionType: 'attachment' | 'media' | 'avatar' | 'logo' | 'icon';
    /**
     * The media type of the asset.
     */
    mediaType: 'image' | 'audio' | 'video' | 'file' | '3d' | 'document';
    /**
     * Tags associated with the asset.
     * @format objectId
     */
    tags?: ObjectId[];
    /**
     * True when the bytes were produced by a platform AI process (e.g.
     * promoted from an `aiRevision` scratch row). Drives the "AI Generated"
     * system chip in the asset view; also queryable for admin filtering.
     * Distinct from user tags — set at create/promote time, not editable.
     */
    aiGenerated?: boolean;
    /**
     * The files associated with the asset.
     */
    files?: File[];
    /**
     * Chat related information for the asset.
     */
    chats?: {
        creatorLastMessageAt?: string | null;
        reviewerLastMessageAt?: string | null;
        creator?: ObjectId | null;
        reviewer?: ObjectId | null;
    };
    /**
     * Expected upload size of the asset in megabytes, used to determine signed link generation.
     */
    expectedUploadSizeInMB: number;
    /**
     * The total size of the asset in bytes.
     */
    sizeInBytes: number;
    /**
     * The visibility settings for the asset.
     * @default ['creator']
     */
    visibility?: ('creator' | 'reviewer' | 'member' | 'public')[];
    /**
     * The date when the asset was published. If not published, this will be null.
     * @format date-time
     * @default null
     */
    publishedOn?: string | null;
    /**
     * The ID of the user who published the asset (if published).
     * @format objectId
     * @default null
     */
    publisherId?: ObjectId | null;
    /**
     * Public user information of the publisher (if published).
     */
    publisher?: PublicUser;
    /**
     * The status of the asset.
     * @default active
     */
    status: 'active' | 'inactive' | 'pendingDelete';
    /**
     * Additional metadata for the asset.
     * @default {}
     */
    meta?: Record<string, any>;
    /**
     * ID of the inheritance object associated with this asset.
     * @format objectId
     */
    inheritanceId?: ObjectId | null;
    /**
     * Populated inheritance data.
     */
    inheritance?: any;
    /**
     * True when the asset has at least one active public download link.
     */
    hasActivePublicLink?: boolean;
    /**
     * True when the asset is a member of at least one active, non-expired public file system.
     */
    hasActivePublicFileSystem?: boolean;
    /**
     * One-way flag set true once the asset has been publicly exposed (link or file system) at any point.
     */
    everPublic?: boolean;
    /**
     * Submission file system IDs the asset currently belongs to. Empty when not in any submission.
     */
    submissionFileSystemIds?: string[];
    /**
     * The timestamp when the asset was created.
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the asset was last updated.
     * @format int64
     */
    updatedAt?: number;
}
/**
 * Represents data required to upload a file.
 */
export interface UploadFile {
    /**
     * This ID is for the requesters use only. It may be any number. It is uses to match request items with response items.
     * @format int32
     */
    id: number;
    /**
     * Name of the file (must include a valid extension).
     */
    name: string;
    /**
     * MD5 hash of the file content
     * @pattern ^[a-f0-9]{32}$
     */
    checksum: string;
    /**
     * File size in MB. This is used only to determine how many signed links to generate for the file and can be rounded to 2 decimals.
     */
    sizeInMB: number;
    /**
     * The base path of the file. This is used to create the initial file system path for the file. If undefined the project's root path is used.
     */
    basePath?: string;
}
/**
 * Represents data needed for generating signed URLs for file uploads/downloads.
 */
export interface SignedUrlData {
    /**
     * @example file1.png
     */
    fileName: string;
    /**
     * @example 65af4c7b22ac19c0b1648241
     * @format objectId
     */
    ownerAssetId: ObjectId;
    /**
     * @example /workspaces/ws-65af4c7b22ac19c0b1648226/projects/pr...
     */
    key: string;
    /**
     * Array of presigned URLs for multipart uploads.
     * @format uri
     * @example ["https://s3.eu-west-1.amazonaws.com/files-test.orama.io..."]
     */
    urls?: string[];
    /**
     * @example image/png
     */
    mimeType?: string;
    /**
     * @format int64
     * @example 1705988395
     */
    expires: number;
    /**
     * @example success
     */
    status?: string;
}
/**
 * Represents an asset along with its signed URL data for uploading.
 */
export interface AssetAndSignedLink {
    /**
     * Client defined ID to correlate requests.
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * @example file1.png
     */
    name?: string;
    /**
     * @example d9729feb74992cc3482b350163a1a010
     */
    hash?: string;
    /**
     * @example image
     */
    type?: string;
    asset?: Asset;
    signedUrlData?: SignedUrlData;
    /**
     * @example success
     */
    status?: string;
}
/**
 * Represents data for repairing an asset upload, including signed URL data.
 */
export interface RepairAssetAndSignedLink {
    /**
     * @format objectId
     */
    assetId?: ObjectId;
    /**
     * @example success
     */
    status?: string;
    asset?: Asset;
    /**
     * @format int64
     * @example 209715200
     */
    uploadChunkSizeInBytes?: number;
    signedUrlData?: SignedUrlData;
}
/**
 * Represents signed URL data specifically for downloading an asset.
 */
export interface DownloadSignedUrlData {
    /**
     * @example file1.png
     */
    fileName: string;
    /**
     * @example 65af4c7b22ac19c0b1648241
     * @format objectId
     */
    ownerAssetId: ObjectId;
    /**
     * @example /workspaces/ws-65af4c7b22ac19c0b1648226/projects/pr...
     */
    key: string;
    /**
     * Presigned URL for downloading.
     * @example https://s3.eu-west-1.amazonaws.com/files-test.orama.io...
     */
    url: string;
    /**
     * @example image/png
     */
    mimeType?: string;
    /**
     * @format int64
     * @example 1705988395
     */
    expires: number;
    /**
     * @example success
     */
    status?: string;
}
/** The collection a secondary reference lives in. */
export type AssetReferenceKind = 'reviewer' | 'submission' | 'public' | 'other';
/** One location an asset is referenced. */
export interface AssetReference {
    fileSystemId: string;
    kind: AssetReferenceKind;
    path: string;
    itemPath: string;
    /** Human-readable, e.g. "Submission / Round 2". */
    label: string;
    createdAt?: string;
}
/**
 * One reference a pending delete would remove, with the asset it belongs to —
 * a bulk delete spans several assets, so the name travels with each row.
 */
export interface DeleteImpactReference extends AssetReference {
    assetId: string;
    assetName: string;
}
/**
 * What deleting a selection would reach beyond the selection itself.
 *
 * Returned by the delete-preview endpoint, computed from the same cascade the
 * delete runs, so the two cannot disagree. `references` lists only the
 * SECONDARY rows that would go with the selection — the reviewer, submission
 * and public-release copies — not the rows the user picked.
 */
export interface DeleteImpact {
    /** How many of the selected rows resolved. */
    selectedCount: number;
    /** Distinct assets losing a reference. */
    affectedAssetCount: number;
    counts: Partial<Record<AssetReferenceKind, number>>;
    references: DeleteImpactReference[];
}
/** Where an asset's primary file system holds it. */
export interface AssetPrimaryReference {
    fileSystemId: string;
    path: string;
    itemPath: string;
    createdAt?: string;
}
/**
 * Every location an asset is referenced.
 *
 * The PRIMARY file system is the asset's home; SECONDARY references are the
 * reviewer tree, submissions and public releases. Renaming fans out to all of
 * them, and deleting the last primary reference removes all of them.
 */
export interface AssetReferences {
    assetId: string;
    assetName: string;
    primaryRoot: string;
    primary: AssetPrimaryReference[];
    secondary: Record<AssetReferenceKind, AssetReference[]>;
    /** Only the kinds with at least one reference appear. */
    counts: Partial<Record<AssetReferenceKind, number>>;
    secondaryCount: number;
}
