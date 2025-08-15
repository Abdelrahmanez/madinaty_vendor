import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Socket Debugger Component
 * Helps debug Socket.io connection issues
 */
const SocketDebugger = ({ socket, socketConnected, getSocketStatus }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // Add log entry
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // Test socket connection
  const testSocketConnection = () => {
    if (!socket) {
      addLog('❌ Socket not initialized', 'error');
      return;
    }

    const status = getSocketStatus();
    addLog(`🔍 Socket Status: ${JSON.stringify(status, null, 2)}`, 'info');

    if (status.connected) {
      addLog('✅ Socket is connected', 'success');
      
      // Test emit
      socket.emit('test_connection', { message: 'Hello from client' });
      addLog('📡 Emitted test_connection event', 'info');
    } else {
      addLog('❌ Socket is not connected', 'error');
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Monitor socket events
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      addLog('✅ Socket connected', 'success');
    };

    const handleDisconnect = (reason) => {
      addLog(`❌ Socket disconnected: ${reason}`, 'error');
    };

    const handleConnectError = (error) => {
      addLog(`❌ Socket connection error: ${error.message}`, 'error');
    };

    const handleReconnect = (attemptNumber) => {
      addLog(`🔄 Socket reconnected after ${attemptNumber} attempts`, 'success');
    };

    // Listen for test response
    const handleTestResponse = (data) => {
      addLog(`📨 Test response received: ${JSON.stringify(data)}`, 'success');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect', handleReconnect);
    socket.on('test_response', handleTestResponse);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect', handleReconnect);
      socket.off('test_response', handleTestResponse);
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Socket.io Debugger</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: socketConnected ? theme.colors.success : theme.colors.error }
          ]} />
          <Text style={styles.statusText}>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={testSocketConnection}
        >
          <MaterialCommunityIcons name="connection" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => setShowLogs(!showLogs)}
        >
          <MaterialCommunityIcons name="console" size={20} color={theme.colors.primary} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={clearLogs}
        >
          <MaterialCommunityIcons name="delete" size={20} color={theme.colors.primary} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      {showLogs && (
        <ScrollView style={styles.logsContainer}>
          {logs.length === 0 ? (
            <Text style={styles.noLogs}>No logs yet. Test the connection to see logs.</Text>
          ) : (
            logs.map((log, index) => (
              <View key={index} style={styles.logEntry}>
                <Text style={styles.logTimestamp}>{log.timestamp}</Text>
                <Text style={[
                  styles.logMessage,
                  log.type === 'error' && styles.logError,
                  log.type === 'success' && styles.logSuccess
                ]}>
                  {log.message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  logsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 6,
    padding: 8,
  },
  noLogs: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
    padding: 16,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 8,
  },
  logTimestamp: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    minWidth: 60,
  },
  logMessage: {
    fontSize: 11,
    color: theme.colors.onSurface,
    flex: 1,
  },
  logError: {
    color: theme.colors.error,
  },
  logSuccess: {
    color: theme.colors.success,
  },
});

export default SocketDebugger;
