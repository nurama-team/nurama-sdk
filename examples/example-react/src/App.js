import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import FileUpload from './components/FileUpload';
import WebSocketConnection from './components/WebSocketConnection';
import NuramaClient from 'nurama-sdk';
import config from './config';
import './App.css';

function App() {
  const [client, setClient] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [logs, setLogs] = useState(['Enter details and click Login.']);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Store the configured file basepath
  const [fileBasepath] = useState(config.fileBasepath);
  // Store WebSocket connection state
  const [wsEvents, setWsEvents] = useState([]);
  const [connectedChannel, setConnectedChannel] = useState(null);

  // Cleanup WebSocket connections on unmount
  useEffect(() => {
    return () => {
      if (client && connectedChannel) {
        client.socket.disconnect(connectedChannel)
          .catch(e => console.error('Error disconnecting WebSocket:', e));
      }
    };
  }, [client, connectedChannel]);

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [
      { text: message, type },
      ...prevLogs
    ]);
  };

  const logJson = (data, prefix = '') => {
    const message = `${prefix}${JSON.stringify(data, null, 2)}`;
    addLog(message);
  };

  const addWebSocketEvent = (event) => {
    const timestamp = new Date().toLocaleTimeString();
    setWsEvents(prevEvents => [
      {
        id: Date.now(),
        timestamp,
        type: event.type || 'notification',
        data: event
      },
      ...prevEvents
    ]);
  };

  const handleLogin = async (baseURL, email, password) => {
    setLogs(['Initializing client and attempting login...']);
    setIsLoading(true);
    
    try {
      // Log configuration
      addLog(`Using API URL: ${baseURL}`);
      addLog(`Using File Basepath: ${fileBasepath}`);
      addLog(`Using WebSocket URL: ${config.websocketUrl}`);
      
      // Create a new client instance with WebSocket URL
      const newClient = new NuramaClient(baseURL, {
        browserMode: true,
        debug: true,
        websocketURL: config.websocketUrl // Use the WebSocket URL from config
      });
      
      setClient(newClient);
      
      // Attempt login
      addLog(`Attempting login for ${email}...`);
      const loginResult = await newClient.auth.login({
        login: email,
        password: password,
      });
      
      // Handle potential MFA requirement
      if (loginResult?.tokens?.verifyMfa) {
        addLog('Login requires MFA verification. MFA token received.', 'success');
        addLog('This example cannot complete MFA. Cannot fetch user data yet.');
      }
      // Handle successful login
      else if (loginResult?.user && loginResult?.tokens?.access) {
        addLog('Login successful!', 'success');
        logJson(loginResult.user, 'User details from login: ');
        setCurrentUserId(loginResult.user.id);
      } else {
        // Handle unexpected login response
        addLog('Login failed. Unexpected response structure.', 'error');
        logJson(loginResult, 'Login Response: ');
      }
    } catch (error) {
      addLog(`Login failed: ${error.message || 'Unknown error'}`, 'error');
      if (error.data) {
        logJson(error.data, 'Error Data: ');
      } else {
        console.error('Full login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!client || !currentUserId) {
      addLog('Client not initialized or user ID not available. Please login first.', 'error');
      return;
    }

    setIsLoading(true);
    addLog(`Fetching data for user ID: ${currentUserId}...`);

    try {
      const data = await client.user.getUser(currentUserId);
      addLog('Fetched user data:', 'success');
      logJson(data);
      setUserData(data);
    } catch (error) {
      addLog(`Failed to fetch user data: ${error.message || 'Unknown error'}`, 'error');
      if (error.data) {
        logJson(error.data, 'Error Data: ');
      } else {
        console.error('Full getUser error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const connectToProjectChannel = async (projectId, visibility) => {
    if (!client) {
      addLog('Client not initialized. Please login first.', 'error');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Disconnect from previous channel if connected
      if (connectedChannel) {
        addLog(`Disconnecting from previous channel: ${connectedChannel}`);
        await client.socket.disconnect(connectedChannel);
        setConnectedChannel(null);
        setWsEvents([]);
      }
      
      // Create channel path for project visibility
      const channel = `/project/${projectId}/${visibility}`;
      addLog(`Connecting to channel: ${channel}...`);
      
      // Connect to the channel
      await client.socket.connect(channel);
      
      // Subscribe to notification events
      await client.socket.subscribe(channel, 'notification', (event) => {
        addLog(`Received notification from ${channel}`, 'success');
        addWebSocketEvent(event);
      });
      
      addLog(`Successfully connected to project channel: ${channel}`, 'success');
      setConnectedChannel(channel);
      return true;
      
    } catch (error) {
      addLog(`WebSocket connection failed: ${error.message || 'Unknown error'}`, 'error');
      console.error('WebSocket connection error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromChannel = async () => {
    if (!client || !connectedChannel) {
      addLog('Not connected to any channel.', 'error');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      addLog(`Disconnecting from channel: ${connectedChannel}...`);
      await client.socket.disconnect(connectedChannel);
      addLog(`Disconnected from channel: ${connectedChannel}`, 'success');
      
      setConnectedChannel(null);
      setWsEvents([]);
      return true;
      
    } catch (error) {
      addLog(`Disconnect failed: ${error.message || 'Unknown error'}`, 'error');
      console.error('Disconnect error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Nurama SDK React Example</h1>
      
      <LoginForm 
        onLogin={handleLogin} 
        isLoading={isLoading}
      />
      
      <div className="action-area">
        <button 
          onClick={fetchUserData} 
          disabled={!currentUserId || isLoading}
          className="get-user-btn"
        >
          Get User Data
        </button>
      </div>
      
      {userData && <UserData data={userData} fileBasepath={fileBasepath} />}
      
      {currentUserId && (
        <>
          <WebSocketConnection 
            onConnect={connectToProjectChannel}
            onDisconnect={disconnectFromChannel}
            events={wsEvents}
            connectedChannel={connectedChannel}
            isLoading={isLoading}
          />
          
          <FileUpload 
            client={client}
            addLog={addLog}
            logJson={logJson}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </>
      )}
      
      <h2>Output:</h2>
      <div className="output-container">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`log-entry ${typeof log === 'string' ? '' : log.type}`}
          >
            {typeof log === 'string' ? log : log.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 