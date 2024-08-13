import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {darkTheme, lightTheme} from '../Style/theme';
import {LocalSvg} from 'react-native-svg/css';
import {windowWidth} from '../utils/util';
import RandomAvatarCircularProgress from '../components/RandomAvatarCircularProgress';
export default function RandomAvatar() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  return (
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      
      <RandomAvatarCircularProgress />
    </View>
  );
}
