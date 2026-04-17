import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Story } from '../types';
import ArticleDetail from '../screens/ArticleDetail/ArticleDetail';
import { BottomNavigation } from './BottomNavigation';

export type StackParamList = {
  BottomScreen: undefined;
  ArticleDetail: { story: Story };
};

const Stack = createNativeStackNavigator<StackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: '#1f1f23' },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerShadowVisible: false, 
        headerTintColor: '#305FA1',
      }}
    >
      <Stack.Screen
        name="BottomScreen"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetail}
        options={{ headerShown: true, title: 'Article' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
