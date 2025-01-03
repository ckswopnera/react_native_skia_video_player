import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../../components/Icons';

// import { Colors, darkTheme, lightTheme } from '../style/Theme';
import ColorScreen from '../../components/ColorScreen';
import { Colors, darkTheme, lightTheme } from '../../Style/theme';

const TabArr = [
  {
    route: 'HomeNavigator',
    label: 'Home',
    type: Icons.Feather,
    icon: 'home',
    component: ColorScreen,
  },
  {
    route: 'QrScan',
    label: 'QrScan',
    type: Icons.MaterialCommunityIcons,
    icon: 'qrcode-scan',
    component: ColorScreen,
  },
  {
    route: 'HistoryNavigator',
    label: 'History',
    type: Icons.FontAwesome,
    icon: 'exchange',
    component: ColorScreen,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = props => {
  const { item, onPress, accessibilityState, color, theme } = props;
  const focused = accessibilityState.selected;

  const getTextAnimation = (route, isFocused) => {
    const startOpacity = 0;
    const finalOpacity = 1;
    const startScale = 0;
    const finalScale = 1;
    if (isFocused) {
      return {
        0: { opacity: startOpacity, scale: startScale },
        1: { opacity: finalOpacity, scale: finalScale },
      };
    }

    return {
      0: { opacity: finalOpacity, scale: finalScale },
      1: { opacity: startOpacity, scale: startScale },
    };
  };
  const getCircleAnimation = (route, isFocused) => {
    const startScale = 0;
    const finalScale = 1;
    if (isFocused) {
      return {
        0: { scale: startScale },
        1: { scale: finalScale },
      };
    }

    return {
      0: { scale: finalScale },
      1: { scale: startScale },
    };
  };
  const getCircleAnimationBorder = (route, isFocused) => {
    const startScale = 0;
    const finalScale = 1;
    if (!isFocused) {
      return {
        0: {
          scale: startScale,
          borderColor:
            route === 'QrScan'
              ? theme.bottomNavQrScanBorderColor
              : 'transparent',
        },
        1: {
          scale: finalScale,
          borderColor:
            route === 'QrScan'
              ? theme.bottomNavQrScanBorderColor
              : 'transparent',
        },
      };
    }

    return {
      0: { scale: finalScale },
      1: { scale: startScale },
    };
  };
  const getAnimation = (route, isFocused) => {
    const baseScale = route === 'QrScan' ? 1.5 : 0.8;
    const midScale = route === 'QrScan' ? 1.5 : 1;
    const translateY = route === 'QrScan' ? -20 : 5;

    if (isFocused) {
      return {
        0: { scale: baseScale, translateY },
        0.5: { scale: midScale, translateY },
        1: { scale: baseScale, translateY },
      };
    }

    return {
      0: { scale: baseScale, translateY },
      1: { scale: baseScale, translateY },
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        animation={getAnimation(item.route, focused)}
        duration={700}
        style={styles.container}>
        <View
          style={[
            styles.btn,
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: Colors.white,
              borderWidth: 4,
              borderColor:
                item.route === 'QrScan'
                  ? theme.bottomNavQrScanColor
                  : color,
              // focused
              //   ? item.route === 'QrScan'
              //     ? color
              //     :theme.bottomNavQrScanColor
              //   : color,

            },
          ]}>
          <Animatable.View
            animation={getCircleAnimation(item.route, focused)}
            duration={700}
            style={{
              ...styles.circle,
              backgroundColor: Colors.primary2,
            }}
          />
          <Animatable.View
            animation={getCircleAnimationBorder(item.route, focused)}
            duration={700}
            style={{
              ...styles.circle,
              borderWidth: 4,
            }}
          />

          <Icon
            size={20}
            type={item.type}
            name={item.icon}
            color={focused ? Colors.white : Colors.primary2}
            style={
              item.route === 'HistoryNavigator' ? { transform: [{ rotate: '0deg' }] } : null
            }
          />
        </View>
        <Animatable.Text
          animation={getTextAnimation(item.route, focused)}
          duration={700}
          style={[styles.text, { color }]}>
          {item.route === 'QrScan' ? '' : item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function AnimTab4() {
  const isDarkMode = useColorScheme() === 'dark';
  const color = isDarkMode ? Colors.white : Colors.white;
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <Tab.Navigator screenOptions={{
        tabBarStyle:{
          // zIndex:9999
        }
      }}>
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                headerShown: false,
                tabBarShowLabel: false,
          headerTitleAlign: 'center',

                tabBarStyle: {
                      ...styles.tabBar,
                      backgroundColor: theme.bottomNavColor,
                    },
                tabBarButton: props => (
                  <TabButton
                    {...props}
                    item={item}
                    color={color}
                    theme={theme}
                  />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    // backgroundColor:'transparent'
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    margin: 16,
    borderRadius: 16,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,

  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '500',
  },
});

