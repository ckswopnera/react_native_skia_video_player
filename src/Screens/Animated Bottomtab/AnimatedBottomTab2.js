import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../Style/theme';
import Icon, {Icons} from '../../components/Icons';
import ColorScreen from '../../components/ColorScreen';
import * as Animatable from 'react-native-animatable';
import {size} from '@shopify/react-native-skia';
import Animated from 'react-native-reanimated';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Icons.Feather,
    icon: 'home',
    component: ColorScreen,
    color: Colors.primary,
    alphaClr: Colors.primaryAlpha,
  },
  {
    route: 'Search',
    label: 'Search',
    type: Icons.Feather,
    icon: 'search',
    component: ColorScreen,
    color: Colors.green,
    alphaClr: Colors.greenAlpha,
  },
  {
    route: 'Like',
    label: 'Like',
    type: Icons.FontAwesome,
    icon: 'heart-o',
    component: ColorScreen,
    color: Colors.purple,
    alphaClr: Colors.purpleAlpha,
  },
  {
    route: 'Account',
    label: 'Account',
    type: Icons.FontAwesome,
    icon: 'user-circle-o',
    component: ColorScreen,
    color: Colors.purple,
    alphaClr: Colors.purpleAlpha,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = ({item, onPress, accessibilityState}) => {
  const focused = accessibilityState.selected;

  const focusedAnimateView = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 0.5,
      scale: 0.5,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  const focusedAnimateText = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 0.5,
      scale: 0.5,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <TouchableOpacity
      onPress={() => {
        console.log(`Pressed ${item.route}`);
        onPress();
      }}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <View>
        <Animatable.View
          animation={focused ? focusedAnimateView : undefined}
          duration={500}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: focused ? item.color : undefined,
              borderRadius: 16,
            },
          ]}
        />
        <View
          style={[
            styles.btn,
            {backgroundColor: focused ? null : item.alphaClr},
          ]}>
          <Icon
            size={24}
            type={item.type}
            name={item.icon}
            color={focused ? Colors.white : Colors.primary}
          />
          <Animatable.View
            animation={focused ? focusedAnimateText : undefined}
            duration={500}>
            {focused && (
              <Text
                style={{
                  color: Colors.white,
                  paddingHorizontal: 8,
                }}>
                {item.label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AnimTab2() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            position: 'absolute',
            margin: 16,
            borderRadius: 16,
          },
        }}>
        {TabArr.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
});
