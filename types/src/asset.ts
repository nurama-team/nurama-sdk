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
  functionType:
    | 'original'
    | 'thumbnail'
    | 'stream'
    | 'media'
    | 'customThumbnailOriginal'
    | 'customThumbnail'
    | 'documentText'
    | 'storyboard'
    | 'waveform';
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
   * Client-supplied fingerprint of the original, used to spot duplicate uploads.
   * The web and mobile apps send a SHA-256 of the whole file up to 4 MB and of
   * its first 2 MB, last 2 MB and size beyond that; older SDK callers sent MD5.
   * It is not a full-file hash — see `contentSha256`.
   */
  checksum: string;
  /**
   * The algorithm used for computing the checksum, when recorded.
   */
  checksumAlgorithm?: string | null;
  /**
   * Full-file SHA-256 of the original, computed server-side once the upload
   * has been read. Null until then.
   */
  contentSha256?: string | null;
  /**
   * The file name the original was uploaded under. Unlike `name` it does not
   * change when the asset is renamed. Best effort for assets uploaded before it
   * was recorded.
   */
  originalName?: string | null;
  /**
   * Lower-case extension of the original file, without the dot.
   */
  originalExtension?: string | null;
  /**
   * Size of the original file in bytes. Unlike `sizeInBytes`, which totals
   * every file the asset holds, this is the upload alone.
   */
  originalSizeInBytes?: number | null;
  /**
   * Where the original file is: `stored` while it is in storage, otherwise
   * pruned or in transition. `restoring`: a pruned original is being
   * re-attached — uploaded, or verified against its recorded hash.
   */
  originalState?: 'stored' | 'pruneRequested' | 'pruning' | 'pruned' | 'restoring';
  /**
   * When post-processing finished (Unix ms), or null while it is running or
   * has not run.
   */
  processingCompletedAt?: number | null;
  /** True when the asset is exempt from pruning. */
  keepOriginal?: boolean;
  /**
   * When a requested prune runs (Unix ms): the end of the undo window, or the
   * next retry after a failed attempt.
   */
  pruneAfter?: number | null;
  /** Who requested the waiting prune; null for the project policy. */
  pruneRequestedById?: string | null;
  /** Whether a person or the project policy asked for the prune. */
  pruneReason?: 'manual' | 'policy' | null;
  /** When the original was pruned (Unix ms). */
  prunedAt?: number | null;
  /** Failed prune attempts since the last success or request. */
  pruneAttempts?: number;
  /** Why the last prune attempt failed, or why the policy set the asset aside. */
  pruneError?: string | null;
  /** While `restoring`, when the re-attach upload was started (Unix ms). */
  reattachStartedAt?: number | null;
  /** While `restoring`, who started the re-attach. */
  reattachById?: string | null;
  /** While `restoring`, the upload the file is arriving through; null once it is being verified. */
  reattachUploadId?: string | null;
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
  inheritance?: any; // Represents populated inheritance data
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
  /**
   * Public references only: whether the release is live (`active`) or has been
   * `disabled`, has `expired` or hit an `error`. Null when the release is gone.
   */
  releaseStatus?: 'active' | 'disabled' | 'expired' | 'error' | null;
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
  /** Whether the asset has ever been in a public release; stays true after it leaves. */
  everPublic: boolean;
  primaryRoot: string;
  primary: AssetPrimaryReference[];
  secondary: Record<AssetReferenceKind, AssetReference[]>;
  /** Only the kinds with at least one reference appear. */
  counts: Partial<Record<AssetReferenceKind, number>>;
  secondaryCount: number;
}

/**
 * Whether an asset's original can be pruned, and what pruning would cost.
 * `reasons` block the prune; `warnings` never do.
 */
export interface AssetPruneEligibility {
  eligible: boolean;
  /**
   * `notProjectMedia`, `unsupportedMediaType`, `notActive`,
   * `processingNotFinished`, `processingFailed`, `renditionsPending`,
   * `documentNotProcessed`, `missingOutputs`, `keepOriginal`, `noOriginal`,
   * `originalNotStored`; for the policy only, `policyDisabled`,
   * `mediaTypeExcluded`, `published`, `inSubmission`.
   */
  reasons: string[];
  /**
   * `noDownloadableVersion`, `reducedResolution`, `compressedModelOnly`,
   * `documentPreviewOnly`, `sharedElsewhere`, `cannotReprocess`.
   */
  warnings: string[];
  /** Where else the asset can be seen; every one of these loses the original too. */
  references: {
    reviewers: boolean;
    publicLinks: boolean;
    publicCollections: number;
    submissions: number;
  };
  /** Storage the prune would free. */
  bytesReclaimed: number;
}

/** Everything about an asset's original, from `GET /v1/assets/:assetId/original`. */
export interface AssetOriginalStatus {
  assetId: string;
  originalState: NonNullable<Asset['originalState']>;
  keepOriginal: boolean;
  pruneAfter: number | null;
  pruneReason: 'manual' | 'policy' | null;
  prunedAt: number | null;
  pruneAttempts: number;
  pruneError: string | null;
  contentSha256: string | null;
  originalName: string | null;
  originalExtension: string | null;
  originalSizeInBytes: number | null;
  processingCompletedAt: number | null;
  /** While `restoring`, how far the re-attach has got. Optional for older servers. */
  reattach?: { phase: 'uploading' | 'verifying'; startedAt: number | null; startedById: string | null } | null;
  eligibility: AssetPruneEligibility;
  policy: {
    enabled: boolean;
    mediaTypes: string[];
    graceDays: number;
    skipPublished: boolean;
    skipInSubmissions: boolean;
    /** Whether the policy covers this asset at all. */
    appliesToAsset: boolean;
    /**
     * Why an enabled policy leaves the asset alone: `mediaTypeExcluded`,
     * `published` (shared with reviewers or publicly), `inSubmission`. Empty
     * when the policy is off or covers the asset. Optional for older servers.
     */
    skippedBecause?: Array<'mediaTypeExcluded' | 'published' | 'inSubmission'>;
    /** When the policy will consider the asset (Unix ms). */
    eligibleFrom: number | null;
  };
}

/** One event in an asset's original history. */
export interface AssetOriginalHistoryEntry {
  id: string;
  assetId: string;
  action:
    | 'hashed'
    | 'pruneRequested'
    | 'pruneCancelled'
    | 'pruned'
    | 'pruneFailed'
    | 'keepOriginalSet'
    | 'keepOriginalCleared'
    | 'reattachStarted'
    | 'reattached'
    | 'reattachRejected'
    | 'reattachCancelled'
    | 'reattachFailed';
  /** Who acted; null when the system did. */
  actor: { id: string; displayName: string | null } | null;
  sha256: string | null;
  sizeInBytes: number | null;
  fileName: string | null;
  relatedSha256: string | null;
  relatedAssetId: string | null;
  note: string | null;
  createdAt: number;
}

/** From `POST /v1/assets/:assetId/original/reattach`: the asset, now `restoring`, and where to upload. */
export interface AssetOriginalReattachStart {
  asset: Asset;
  upload: {
    uploadId: string;
    key: string;
    /** PUT part N of the file to `urls[N - 1]`. */
    urls: string[];
    /** When the links expire (Unix seconds). */
    expires: number;
    uploadChunkSizeInBytes: number;
  };
}

/**
 * Assets a bulk prune request acts on: ids, paths in the project's creator
 * tree (a folder includes everything inside it), or both.
 */
export interface AssetPruneSelection {
  assetIds?: string[];
  itemPaths?: string[];
}

/** What pruning a selection would do. */
export interface AssetPrunePreview {
  totals: { selected: number; eligible: number; ineligible: number; bytesReclaimed: number };
  assets: Array<AssetPruneEligibility & { assetId: string; name: string; mediaType: string; originalState: string }>;
  notFound: string[];
}

/** Which prunes a bulk request scheduled. */
export interface AssetPruneRequestResult {
  requested: string[];
  skipped: Array<{ assetId: string; reasons: string[] }>;
  /** When the requested prunes run (Unix ms). */
  pruneAfter: number;
  notFound: string[];
}

/** Which prunes a bulk cancel stopped. */
export interface AssetPruneCancelResult {
  cancelled: string[];
  notCancelled: string[];
  notFound: string[];
}

/** Pruning in a project at a glance. */
export interface ProjectPruningSummary {
  policy: {
    enabled: boolean;
    mediaTypes: string[];
    graceDays: number;
    skipPublished: boolean;
    skipInSubmissions: boolean;
    reattachMatchingUploads: boolean;
  };
  /** Active media assets by `originalState`. */
  counts: Record<string, number>;
  /** Assets exempt from pruning. */
  keepOriginal: number;
  /** Size of the originals pruned so far. */
  prunedBytes: number;
  /** Assets the policy would prune on its next runs. */
  policyCandidates: number;
}
