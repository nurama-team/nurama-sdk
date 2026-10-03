import React from 'react';

function UserData({ data, fileBasepath }) {
  if (!data) return null;
  
  // Function to build complete file URLs
  const getCompleteFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Already a complete URL
    return `${fileBasepath}/${path.replace(/^\//, '')}`; // Remove leading slash if present
  };
  
  return (
    <div className="user-data-container">
      <h2>User Information</h2>
      <div className="user-card">
        {data.avatar && (
          <div className="user-avatar">
            <img 
              src={data.avatar?.files?.[1]
                ? getCompleteFileUrl(data.avatar.files[1].keyPath)
                : ''}
              alt="User Avatar"
            />
          </div>
        )}
        {data.profileImage && (
          <div className="user-avatar">
            <img 
              src={getCompleteFileUrl(data.profileImage)}
              alt="Profile" 
            />
          </div>
        )}
        <div className="user-details">
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Name:</strong> {data.name || 'N/A'}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>
          {data.role && <p><strong>Role:</strong> {data.role}</p>}
          {fileBasepath && (
            <p><strong>Files Base URL:</strong> {fileBasepath}</p>
          )}
        </div>
      </div>
      <div className="json-data">
        <h3>Full User Data</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default UserData; 