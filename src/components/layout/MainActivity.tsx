import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from '../../routes/StackNavigation';
import { useBookmarkStore } from '../../store/useBookmarkStore';

const MainLayout = () => {
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  
  useEffect(() => {
    loadBookmarks();
  }, []);
 
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#0C0C0F' }}>
        <StatusBar barStyle="dark-content" />
        <StackNavigation />
      </View>
    </NavigationContainer>
  );
};

export default MainLayout;
