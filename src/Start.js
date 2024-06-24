import * as Updates from 'expo-updates';
import {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import App from './Screens/App';
import {QueryClientProvider, useQuery} from '@tanstack/react-query';
import {queryClient} from './utils/util';
import Tanstack_Infinite_Scroll from './Screens/Tanstack_Infinite_Scroll';
import UseOnlineManager from './utils/UseOnlineManager';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Tanstack_Single_Query from './Screens/Tanstack_Single_Query';
import React_Form from './Screens/React_Form';
import Video from './skia/Video';
import Orientation from 'react-native-orientation-locker';
import {useBearStore} from '../store/store';

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function Start() {
  const {currentlyRunning, isUpdateAvailable, isUpdatePending} =
    Updates.useUpdates();

  useEffect(() => {
    Orientation.lockToPortrait();
    // console.log({currentlyRunning}, {isUpdateAvailable});
    if (isUpdatePending) {
      upDate();
    }
  }, [isUpdatePending]);

  const upDate = () => {
    Alert.alert(
      'Update Alert',
      'Press OK to get the latest update.',
      [
        {
          text: 'OK',
          onPress: () => Updates.reloadAsync(),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={'#000'} />
        <MainComponent />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
function MainComponent() {
  const showBar = useBearStore(state => state.showBar);

  return (
    <>
      <UseOnlineManager />
      <Drawer.Navigator
        initialRouteName="Video Player"
        screenOptions={{
          headerShown: showBar,
          drawerHideStatusBarOnOpen: false,
          headerTitleAlign: 'center',
          drawerStyle: {
            backgroundColor: '#000',
          },
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}>
        <Drawer.Screen
          name="Timer Clock"
          component={App}
          options={{
            // headerTitleAlign:'center',
            headerTitle: 'Timer Clock',
            // headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Infine Scroll"
          component={Tanstack_Infinite_Scroll}
          // options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Single Query "
          component={Tanstack_Single_Query}
          // options={{headerShown: false}}
        />
        <Drawer.Screen
          name="React Form"
          component={React_Form}
          // options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Video Player"
          component={Video}
          // options={{headerShown: false}}
        />
      </Drawer.Navigator>
    </>
  );
}
