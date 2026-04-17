import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from '../../routes/StackNavigation';
import { useBookmarkStore } from '../../store/useBookmarkStore';

const MainLayout = () => {
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  
  useEffect(() => {
    // Load bookmarks when app starts
    console.log('🚀 App starting - loading bookmarks...');
    loadBookmarks();
  }, []);
 
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" />
        <StackNavigation />
      </View>
    </NavigationContainer>
  );
};

export default MainLayout;
