import {useEffect} from 'react';
import {Alert, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {onlineManager} from '@tanstack/react-query';

const UseOnlineManager = () => {
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      // console.log({state})
      const isOnline =
        state.isConnected != null &&
        state.isConnected &&
        Boolean(state.isInternetReachable);

      // console.log({ isOnline });
      if (Platform.OS === 'ios') {
        if (isOnline === null) {
          console.log('refreshing...');
          NetInfo.refresh();
        }
      } else {
        if (!isOnline) {
          Alert.alert('No internet connection! 😢');
        }
      }

      onlineManager.setOnline(isOnline);
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  return null;
};

export default UseOnlineManager;
