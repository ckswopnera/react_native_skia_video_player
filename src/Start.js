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
import Tanstack_Infinite_Scroll from './Screens/Tanstack_Infinite_Scroll';
import Tanstack_Single_Query from './Screens/Tanstack_Single_Query';
import React_Form from './Screens/React_Form';
import React_Form2 from './Screens/React_Form2';
import React_Form3 from './Screens/React_Form3';
import Video from './skia/Video';
import Screenshot from './Screens/Screenshot';
import ChartVictoryNative from './Screens/ChartVictoryNative';
import UseOnlineManager from './utils/UseOnlineManager';
import Orientation from 'react-native-orientation-locker';
import {useBearStore} from './store/store';
import Tanstack_Queryclient from './Screens/Tanstack_queryclient';
import CandleStickChart from './Screens/CandleStickChart';
import CircularProgress from './Screens/CircularProgressBar';

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
          barStyle="light-content"
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
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
        initialRouteName='Circular ProgressBar'
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
          name="Infine Scroll"
          component={Tanstack_Infinite_Scroll}
        />
        <Drawer.Screen name="Single Query " component={Tanstack_Single_Query} />
        <Drawer.Screen name="Query client " component={Tanstack_Queryclient} />
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
        <Drawer.Screen name="Circular ProgressBar" component={CircularProgress} />


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
