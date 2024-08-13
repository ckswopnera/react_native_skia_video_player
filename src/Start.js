import React, {useEffect, useState} from 'react';
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
import {QueryClientProvider} from '@tanstack/react-query';
import {prefetchData, queryClient} from './utils/util';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Clock from './Screens/Clock';
import Tanstack_Infinite_Scroll from './Screens/Tanstack/Tanstack_Infinite_Scroll';
import Tanstack_Single_Query from './Screens/Tanstack/Tanstack_Single_Query';
import React_Form from './Screens/Form/React_Form';
import React_Form2 from './Screens/Form/React_Form2';
import React_Form3 from './Screens/Form/React_Form3';
import Video from './skia/Video';
import Screenshot from './Screens/Screenshot';
import ChartVictoryNative from './Screens/ChartVictoryNative';
import UseOnlineManager from './utils/UseOnlineManager';
import Orientation from 'react-native-orientation-locker';
import {useBearStore} from './store/store';
import Tanstack_Queryclient from './Screens/Tanstack/Tanstack_queryclient';
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
import ActionMenu from './Screens/Animated Action Menu/Moti_ActionMenu';
import SkeletonComponent from './Screens/Skeleton';
import { AnimatedColorGradient } from './Screens/AnimatedColorGradient';
import CircularAnimatedMenu from './Screens/Animated Action Menu/CircularAnimatedMenu';
import Rainbow1 from './Screens/Rainbow 1';
import Rainbow2 from './Screens/Rainbow 2';
import Cyclone from './Screens/Cyclone';
import CloudRainAnimation from './Screens/Rain';
import Tanstack_Infinite_Button from './Screens/Tanstack/Tanstack_Infinite_Button';
import UseQueryInfinite from './Screens/Tanstack/Tanstack_Infinite_Scroll_with_usequey';

const Drawer = createDrawerNavigator();

const Start = () => {
  const showBar = useBearStore(state => state.showBar);
  const colorScheme = useColorScheme();
  const {isUpdateAvailable, isUpdatePending, isChecking, isDownloading} =
    Updates.useUpdates();
  const [isPrefetched, setIsPrefetched] = useState(false);

  useEffect(() => {
    const prefetch = async () => {
      await prefetchData();
      setIsPrefetched(true);
    };
    prefetch();
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
    if (isUpdatePending) {
      upDate();
    }
  }, [isUpdatePending]);

  if (!isPrefetched) {
    return (
      <View
        style={[
          styles.loadingView,
          {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        ]}>
        <ActivityIndicator
          size="200"
          color={colorScheme === 'dark' ? '#fff' : '#000'}
        />
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
          // translucent={false}
        />
      </View>
    );
  }

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
      <NavigationContainer
        theme={
          colorScheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme
        }>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
          hidden={!showBar}
        />
        <MainComponent />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const MainComponent = () => {
  const showBar = useBearStore(state => state.showBar);
  const colorScheme = useColorScheme();

  return (
    <>
      <UseOnlineManager />
      <Drawer.Navigator
        initialRouteName='UseQuery Infinite'
        screenOptions={{
          headerShown: showBar,
          drawerHideStatusBarOnOpen: false,
          headerTitleAlign: 'center',
          drawerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
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
          name="Infinite Scroll"
          component={Tanstack_Infinite_Scroll}
        />
        <Drawer.Screen name="Single Query " component={Tanstack_Single_Query} />
        <Drawer.Screen name="Query client " component={Tanstack_Queryclient} />
        <Drawer.Screen name="Infinite Button" component={Tanstack_Infinite_Button} />
        <Drawer.Screen name="UseQuery Infinite" component={UseQueryInfinite} />
        
        
        <Drawer.Screen name="React Form" component={React_Form} />
        <Drawer.Screen name="React Form 2" component={React_Form2} />
        <Drawer.Screen name="React Form 3" component={React_Form3} />
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
        <Drawer.Screen name="Action Menu using Moti" component={ActionMenu} />
        <Drawer.Screen name="Switches" component={Switches} />
        <Drawer.Screen name="Animated Gradient" component={AnimatedColorGradient} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Animated BottomTab 1" component={AnimTab1} />
        <Drawer.Screen name="Animated BottomTab 2" component={AnimTab2} />
        <Drawer.Screen name="Animated BottomTab 3" component={AnimTab3} />
        <Drawer.Screen name="Bezier Curve" component={BezierCurve} />
        <Drawer.Screen name="Circle Wave" component={WaveForm1} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="FullScreen Wave" component={WaveForm2} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Square Wave" component={WaveForm3} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Skeleton Component" component={SkeletonComponent} />
        <Drawer.Screen name="Paper Fold" component={PaperFold} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Circular Animated Menu" component={CircularAnimatedMenu} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Rainbow 1" component={Rainbow1} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Rainbow 2" component={Rainbow2} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Cyclone" component={Cyclone} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="CloudRainAnimation" component={CloudRainAnimation} options={{unmountOnBlur: true}}/>

        
        
        
      </Drawer.Navigator>
    </>
  );
};

export default Start;

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
