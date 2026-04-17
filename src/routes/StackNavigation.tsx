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
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
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
