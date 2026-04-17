import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from '../../routes/StackNavigation';

const MainLayout = () => {
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
