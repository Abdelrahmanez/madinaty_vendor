import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Card, Divider, ActivityIndicator } from 'react-native-paper';
import { checkServerConnection, runNetworkDiagnostics } from '../services/serverTest';
import { API_BASE_URL } from '../config/api';

/**
 * مكون لتشخيص مشاكل الاتصال بالشبكة والخادم الخلفي
 * يمكن استخدامه في أي شاشة للمساعدة في تشخيص مشاكل الاتصال
 */
const NetworkDiagnostics = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      // اختبار الاتصال بالخادم
      const connectionResult = await checkServerConnection();
      
      // الحصول على المزيد من التفاصيل إذا كان الاتصال ناجحًا
      let fullDiagnostics = null;
      if (connectionResult.success || connectionResult.errorType === 'server_error') {
        fullDiagnostics = await runNetworkDiagnostics();
      }
      
      setResults({
        connectionResult,
        fullDiagnostics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setResults({
        error: true,
        message: `حدث خطأ أثناء التشخيص: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="تشخيص الاتصال بالشبكة" />
        <Card.Content>
          <Text style={styles.urlText}>عنوان الخادم: {API_BASE_URL}</Text>
          <Divider style={styles.divider} />
          
          {isRunning ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E01105" />
              <Text style={styles.loadingText}>جاري تشخيص الاتصال...</Text>
            </View>
          ) : (
            <Button
              title="فحص الاتصال بالخادم الخلفي"
              onPress={runTests}
              color="#E01105"
            />
          )}
          
          {results && (
            <ScrollView style={styles.resultsContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.timestamp}>تاريخ التشخيص: {new Date(results.timestamp).toLocaleString()}</Text>
              
              {results.error ? (
                <Text style={styles.errorText}>{results.message}</Text>
              ) : (
                <>
                  <Text style={[
                    styles.statusText,
                    results.connectionResult.success ? styles.successText : styles.errorText
                  ]}>
                    حالة الاتصال: {results.connectionResult.success ? 'ناجح ✅' : 'فشل ❌'}
                  </Text>
                  
                  <Text style={styles.messageText}>{results.connectionResult.message}</Text>
                  
                  {results.fullDiagnostics && results.fullDiagnostics.corsPolicies && (
                    <>
                      <Divider style={styles.divider} />
                      <Text style={styles.sectionTitle}>تفاصيل CORS:</Text>
                      <Text>نجاح CORS: {results.fullDiagnostics.corsPolicies.success ? 'نعم ✅' : 'لا ❌'}</Text>
                      {results.fullDiagnostics.corsPolicies.allowOrigin && (
                        <Text>Access-Control-Allow-Origin: {results.fullDiagnostics.corsPolicies.allowOrigin}</Text>
                      )}
                    </>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  urlText: {
    marginBottom: 10,
    fontSize: 14,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  resultsContainer: {
    maxHeight: 300,
    marginTop: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
  messageText: {
    marginTop: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default NetworkDiagnostics; 