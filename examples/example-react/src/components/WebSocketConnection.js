import React, { useState } from 'react';

const WebSocketConnection = ({ 
  onConnect, 
  onDisconnect, 
  events, 
  connectedChannel, 
  isLoading 
}) => {
  const [projectId, setProjectId] = useState('');
  const [visibility, setVisibility] = useState('creator');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId.trim()) return;
    await onConnect(projectId.trim(), visibility);
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  return (
    <div className="section websocket-section">
      <h2>WebSocket Connection</h2>
      
      {!connectedChannel ? (
        <form onSubmit={handleSubmit} className="websocket-form">
          <div className="form-group">
            <label htmlFor="projectChannelId">Project ID to connect:</label>
            <input
              type="text"
              id="projectChannelId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="visibility">Visibility:</label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              disabled={isLoading}
            >
              <option value="creator">Creator</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !projectId.trim()}
            className="connect-btn"
          >
            {isLoading ? 'Connecting...' : 'Connect to Project Channel'}
          </button>
        </form>
      ) : (
        <div className="websocket-controls">
          <div className="connection-status success">
            Connected to: {connectedChannel}
          </div>
          <button 
            onClick={handleDisconnect} 
            disabled={isLoading}
            className="disconnect-btn"
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      )}
      
      <h3>WebSocket Events:</h3>
      <div className="websocket-events">
        {events.length === 0 ? (
          <p className="no-events">No events received yet. Connect to a channel to see events.</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span className="event-timestamp">[{event.timestamp}]</span>
                <span className="event-type">Event: {event.type}</span>
              </div>
              <pre className="event-data">{JSON.stringify(event.data, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebSocketConnection; 