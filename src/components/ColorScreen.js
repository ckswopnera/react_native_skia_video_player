import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, {FadeIn, useAnimatedRef} from 'react-native-reanimated';
import {Colors} from '../Style/theme';
import AppHeader from './MyHeader';

export default function ColorScreen({route, navigation}) {
  const viewRef = useAnimatedRef(null);
  const [bgColor, setBgColor] = useState();
  useEffect(() => {
    switch (route.name) {
      case 'Home': {
        setBgColor(Colors.primary);
        break;
      }
      case 'Search': {
        setBgColor(Colors.green);
        break;
      }
      case 'Add': {
        setBgColor(Colors.red);
        break;
      }
      case 'Account': {
        setBgColor(Colors.purple);
        break;
      }
      case 'Like': {
        setBgColor(Colors.yellow);
        break;
      }
      default:
        setBgColor(Colors.white);
    }
  }, []);

  return (
    <Animated.View
      ref={viewRef}
      entering={FadeIn.duration(800)}
      style={{...styles.container, backgroundColor: bgColor}}>
      {/* <AppHeader
        menu
        onPressMenu={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        onRightPress={() => console.log('right')}
      /> */}
      <View style={{...styles.container, backgroundColor: bgColor}}></View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
