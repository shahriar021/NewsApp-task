import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainLayout from './src/components/layout/MainActivity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetworkStatus from './src/components/shared/NetworkStatus';

export default function App() {
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      <MainLayout />
      <NetworkStatus />
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
