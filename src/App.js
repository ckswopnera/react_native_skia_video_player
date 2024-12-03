import React, {useEffect, useRef, useState} from 'react';
import * as Updates from 'expo-updates';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {QueryClientProvider, useQuery} from '@tanstack/react-query';
import {
  prefetchData,
  queryClient,
  toast_error,
  tokenCheck,
  tokenExpiryCheck,
} from './utils/util';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Clock from './Screens/Clock';
import Tanstack_Infinite_Scroll from './Screens/Tanstack/Infinite_Scroll';
import Tanstack_Zustand_mmkv_example from './Screens/Tanstack/Tanstack_Zustand_mmkv_example';
import React_Form from './Screens/Form/React_Form';
import React_Form2 from './Screens/Form/React_Form2';
import React_Form3 from './Screens/Form/React_Form3';
import Video from './skia/Video';
import Screenshot from './Screens/Screenshot';
import ChartVictoryNative from './Screens/ChartVictoryNative';
import UseOnlineManager from './utils/UseOnlineManager';
import Orientation from 'react-native-orientation-locker';
import Tanstack_Queryclient from './Screens/Tanstack/Queryclient';
import CandleStickChart from './Screens/CandleStickChart';
import RandomAvatar from './Screens/RandomAvatar';
import CircularProgressBar from './Screens/CircularProgressBar';
import CardScan from './Screens/CardScan';
import Fab from './Screens/Animated Action Menu/FloatingActionButton';
import AnimTab1 from './Screens/Animated Bottomtab/AnimatedBottomTab1';
import AnimTab2 from './Screens/Animated Bottomtab/AnimatedBottomTab2';
import AnimTab3 from './Screens/Animated Bottomtab/AnimatedBottomTab3';
import Switches from './Screens/Switches';
import WaveForm1 from './Screens/Animated Liquid Progress/WaveForm 1';
import WaveForm2 from './Screens/Animated Liquid Progress/WaveForm 2';
import WaveForm3 from './Screens/Animated Liquid Progress/WaveForm 3';
import BezierCurve from './Screens/Bezier Curve';
import PaperFold from './Screens/PaperFold';
import SkeletonComponent from './Screens/Skeleton_using_moti';
import {AnimatedColorGradient} from './Screens/AnimatedColorGradient';
import CircularAnimatedMenu from './Screens/Animated Action Menu/CircularAnimatedMenu';
import Rainbow1 from './Screens/Rainbow 1';
import Rainbow2 from './Screens/Rainbow 2';
import Cyclone from './Screens/Cyclone';
import CloudRainAnimation from './Screens/Rain';
import Tanstack_Infinite_Button from './Screens/Tanstack/Infinite_Button_using_useInfiniteQuery';
import UseQueryInfinite from './Screens/Tanstack/Infinite_Button_using_usequery';
import FlagWave from './Screens/Animated Liquid Progress/FlagWave';
import ZoomableImage from './Screens/ZoomImage';
import SeaWave from './Screens/Animated Liquid Progress/SeaWave';
import Suspense from './Screens/Tanstack/Suspense';
import Carousel from './Screens/Carousel/Carousel';
import CRUD from './Screens/Tanstack/CRUD';
import {createStackNavigator} from '@react-navigation/stack';
import TokenExpiredScreen from './Screens/TokenExpiredScreen';
import CachePage from './Screens/Tanstack/CachePage';
import ActionMenuUsingAnimatable from './Screens/Animated Action Menu/ActionMenuUsing_Animatable';
import YourComponent from './Screens/Skeleton_using_animatable';
import TestZustand from './Screens/TestZustand';
import {useBoundStore} from './store/MainStore';
import generatePassword from './utils/passwordGenerator';
import Table from './Screens/Tanstack/table/Basic_Table';
import FilterTable from './Screens/Tanstack/table/Filter_Table/FilterTable';
import {Toaster} from 'sonner-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ToastScreen from './Screens/ToastScreen';
import VisionCamera from './Screens/VisionCamera/VisionCamera';
import App_State from './Screens/App_State';
import Notification from './Screens/Notification';
import ScratchScreen from './Screens/ScratchScreen';
import React_Form_Zod from './Screens/Form/React_Form_Zod';
import Wheel from './Screens/Wheel';
import LuckyWheel from './Screens/LuckyWheel/LuckyWheel';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const App = () => {
  const isFirstRender = useRef(true);
  const {
    token,
    showBar,
    setToken,
    isTokenExpired,
    isLoading,
    setIsLoading,
    checkTokenValidityTimer,
    checkTokenValidity,
    startTokenTimer,
    clearTokenTimer,
  } = useBoundStore();
  const colorScheme = useColorScheme();
  const {isUpdateAvailable, isUpdatePending, isChecking, isDownloading} =
    Updates.useUpdates();
  useEffect(() => {
    setIsLoading(true);

    const fetchToken = async () => {
      try {
        const data = await tokenCheck();
        setToken(await data.accessToken);
        console.log({data});
        return data;
      } catch (error) {
        console.log('Error fetching token:', error);
        toast_error('Error!', 'Error fetching token:');
      }
    };

    fetchToken()
      .then(e => {
        prefetchData();
        setIsLoading(false);
      })
      .catch(err => console.log({err}));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    checkTokenValidity();
    // startTokenTimer();
    return () => {
      clearTokenTimer();
    };
  }, [token]);

  useEffect(() => {
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
    Orientation.lockToPortrait();
    if (isUpdatePending) {
      upDate();
    }
  }, [isUpdatePending]);

  // if (isLoading === true) {
  //   return (
  //     <View
  //       style={[
  //         styles.loadingView,
  //         {
  //           backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  //         },
  //       ]}>
  //       <ActivityIndicator
  //         size="200"
  //         color={colorScheme === 'dark' ? '#fff' : '#000'}
  //       />
  //       <StatusBar
  //         barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
  //         backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
  //         // translucent={false}
  //       />
  //     </View>
  //   );
  // } else 
  // if (isTokenExpired) {
  //   return <TokenExpiredScreen />;
  // } else {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <NavigationContainer
              theme={
                colorScheme === 'dark'
                  ? NavigationDarkTheme
                  : NavigationDefaultTheme
              }>
              <StatusBar
                barStyle={
                  colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
                backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                hidden={!showBar}
              />
              <Stack.Navigator
                initialRouteName="MainComponent"
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen name="MainComponent" component={MainComponent} />
                <Stack.Screen name="CachePage" component={CachePage} />
                <Stack.Screen
                  name="TokenExpired"
                  component={TokenExpiredScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
            <Toaster
              position="bottom-center"
              toastOptions={{
                closeButtonIconStyle: {color: '#000'},
              }}
              richColors="true"
              // closeButton="true"
              theme="system"
            />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  // }
};

const MainComponent = () => {
  const showBar = useBoundStore(state => state.showBar);
  const colorScheme = useColorScheme();
  return (
    <>
      <UseOnlineManager />
      <Drawer.Navigator
        initialRouteName="Wheel Fortune"
        screenOptions={{
          headerShown: showBar,
          drawerHideStatusBarOnOpen: false,
          headerTitleAlign: 'center',
          drawerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            borderRightWidth: colorScheme === 'dark' ? 1 : 0,
            // borderColor: 'red',
          },
          drawerActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          drawerInactiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}>
        <Drawer.Screen
          name="Timer Clock"
          component={Clock}
          options={{headerTitle: 'Timer Clock'}}
        />
        <Drawer.Screen
          name="Table"
          component={Table}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="FilterTable"
          component={FilterTable}
          options={{unmountOnBlur: true}}
        />

        <Drawer.Screen
          name="Infinite Scroll"
          component={Tanstack_Infinite_Scroll}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="TestZustand"
          component={TestZustand}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Tanstack_Zustand_mmkv_example"
          component={Tanstack_Zustand_mmkv_example}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen name="Query client " component={Tanstack_Queryclient} />
        <Drawer.Screen
          name="UseinfiniteQuery Button"
          component={Tanstack_Infinite_Button}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="UseQuery Infinite Button"
          component={UseQueryInfinite}
        />
        <Drawer.Screen
          name="Suspense"
          component={Suspense}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Crud"
          component={CRUD}
          options={{title: 'Crud Operations', unmountOnBlur: true}}
        />
        <Drawer.Screen name="React Form" component={React_Form} />
        <Drawer.Screen name="React Form 2" component={React_Form2} />
        <Drawer.Screen name="React Form 3" component={React_Form3} />
        <Drawer.Screen name="React Form Using Zod" component={React_Form_Zod} />

        <Drawer.Screen
          name="Video Player"
          component={Video}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen name="Screenshot" component={Screenshot} />
        <Drawer.Screen name="Chart" component={ChartVictoryNative} />
        <Drawer.Screen name="Candlestick Chart" component={CandleStickChart} />
        <Drawer.Screen
          name="Circular ProgressBar"
          component={CircularProgressBar}
        />
        <Drawer.Screen
          name="Random Avatar"
          component={RandomAvatar}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Card Scan"
          component={CardScan}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen name="Floating ActionButton" component={Fab} />
        <Drawer.Screen
          name="Action Menu Using Animatable"
          component={ActionMenuUsingAnimatable}
        />
        <Drawer.Screen name="Switches" component={Switches} />
        <Drawer.Screen
          name="Animated Gradient"
          component={AnimatedColorGradient}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen name="Animated BottomTab 1" component={AnimTab1} />
        <Drawer.Screen name="Animated BottomTab 2" component={AnimTab2} />
        <Drawer.Screen name="Animated BottomTab 3" component={AnimTab3} />
        <Drawer.Screen name="Bezier Curve" component={BezierCurve} />
        <Drawer.Screen
          name="Circle Wave"
          component={WaveForm1}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="FullScreen Wave"
          component={WaveForm2}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Square Wave"
          component={WaveForm3}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Sea Wave"
          component={SeaWave}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="India Flag"
          component={FlagWave}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Skeleton using moti"
          component={SkeletonComponent}
        />
        <Drawer.Screen
          name="Skeleton using animatable"
          component={YourComponent}
        />
        <Drawer.Screen
          name="Paper Fold"
          component={PaperFold}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Circular Animated Menu"
          component={CircularAnimatedMenu}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Rainbow 1"
          component={Rainbow1}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Rainbow 2"
          component={Rainbow2}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Cyclone"
          component={Cyclone}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="CloudRainAnimation"
          component={CloudRainAnimation}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Zoomable Image"
          component={ZoomableImage}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Carousel"
          component={Carousel}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="ToastScreen"
          component={ToastScreen}
          options={{unmountOnBlur: true}}
        />

        <Drawer.Screen
          name="VisionCamera"
          component={VisionCamera}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="App_State"
          component={App_State}
          // options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="Notification"
          component={Notification}
          // options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name="ScratchScreen"
          component={ScratchScreen}
          options={{unmountOnBlur: true}}
        />
          <Drawer.Screen
          name="Wheel Fortune"
          component={LuckyWheel}
          options={{unmountOnBlur: true}}
        />
   <Drawer.Screen
          name="Wheel"
          component={Wheel}
          options={{unmountOnBlur: true}}
        />
      </Drawer.Navigator>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
