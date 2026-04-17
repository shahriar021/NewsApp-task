import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

const NetworkStatus = ({ onRetry }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [bannerAnim] = useState(new Animated.Value(-50));
  const [connectionType, setConnectionType] = useState(null);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected;
      
      setIsConnected(connected);
      setConnectionType(state.type);
      
      if (!connected) {
        // Show offline banner immediately
        setShowOnlineBanner(false);
        Animated.spring(bannerAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }).start();
      } else if (connected && !isConnected) {
        // Just came back online
        setShowOnlineBanner(true);
        Animated.spring(bannerAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }).start();
        
        // Hide online banner after 3 seconds
        setTimeout(() => {
          Animated.spring(bannerAnim, {
            toValue: -50,
            useNativeDriver: true,
            tension: 50,
            friction: 7
          }).start();
        }, 3000);
      } else if (connected && isConnected) {
        // Was already online, keep hidden
        Animated.spring(bannerAnim, {
          toValue: -50,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }).start();
      }
    });

    return () => unsubscribe();
  }, [bannerAnim, isConnected]);

  if (!isConnected) {
    return (
      <Animated.View 
        style={[
          styles.banner, 
          styles.offlineBanner,
          { transform: [{ translateY: bannerAnim }] }
        ]}
      >
        <Text style={styles.offlineText}>📡 No Internet Connection</Text>
        <Text style={styles.offlineSubText}>
          Please check your connection
        </Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry ↻</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }

  if (showOnlineBanner) {
    return (
      <Animated.View 
        style={[
          styles.banner, 
          styles.onlineBanner,
          { transform: [{ translateY: bannerAnim }] }
        ]}
      >
        <Text style={styles.onlineText}>
          ✓ Back Online {connectionType === 'wifi' ? '📶' : '📱'}
        </Text>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  offlineBanner: {
    backgroundColor: '#ff4444',
  },
  onlineBanner: {
    backgroundColor: '#4CAF50',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  offlineSubText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  onlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  retryButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default NetworkStatus;