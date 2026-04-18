import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ArticleList from '../screens/ArticleList/ArticleList';
import Bookmarks from '../screens/Bookmarks/Bookmarks';
import { BottomTabParamList } from '../types/navigation';

const BottomTabs = createBottomTabNavigator<BottomTabParamList>();

const ACTIVE_BG_COLOR = '#FF4D00';
const ACTIVE_ICON_COLOR = '#FFFFFF';
const INACTIVE_ICON_COLOR = '#55556A';

export const BottomNavigation = () => {
  const { width } = useWindowDimensions();
  const TAB_NAMES = ['Home', 'Bookmarks'];

  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const routeIndex = TAB_NAMES.indexOf(route.name);
        const isFirst = routeIndex === 0;
        const isLast = routeIndex === TAB_NAMES.length - 1;

        const getIconName = (focused: boolean) => {
          if (route.name === 'Home') {
            return focused ? 'newspaper' : 'newspaper-outline';
          }
          return focused ? 'bookmark' : 'bookmark-outline';
        };

        return {
          lazy: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#16161D',
            borderTopWidth: 0,
            elevation: 0,
            marginHorizontal: 17,
            borderRadius: 60,
            marginBottom: Platform.OS === 'android' ? 17 : 16,
            paddingHorizontal: 5,
            overflow: 'visible',
            height: 68,
            paddingBottom: 5,
            paddingTop: 17,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },

          tabBarShowLabel: false,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
          tabBarIcon: ({ focused }) => {
            const translateX = isFirst ? 15 : isLast ? -15 : 0;

            if (focused) {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ACTIVE_BG_COLOR,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 30,
                    minWidth: 100,
                    maxWidth: 100,
                    zIndex: 10,
                    transform: [{ translateX }],
                  }}
                >
                  <Icon
                    name={getIconName(true)}
                    size={22}
                    color={ACTIVE_ICON_COLOR}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: ACTIVE_ICON_COLOR,
                      marginLeft: 8,
                      fontWeight: '600',
                      fontSize: width > 450 ? 14 : 12,
                      flexShrink: 1,
                    }}
                  >
                    {route.name}
                  </Text>
                </View>
              );
            }

            return (
              <Icon
                name={getIconName(false)}
                size={24}
                color={INACTIVE_ICON_COLOR}
              />
            );
          },
        };
      }}
    >
      <BottomTabs.Screen name="Home" component={ArticleList} />
      <BottomTabs.Screen name="Bookmarks" component={Bookmarks} />
    </BottomTabs.Navigator>
  );
};
