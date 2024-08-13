import React, {useReducer, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon, {Icons} from '../components/Icons';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../Style/theme';
import AnimatedSwitch from '../components/AnimatedSwitch';
import {windowHeight, windowWidth} from '../utils/util';
import AnimatedSwitchWithGesture from '../components/AnimatedSwitchWithGesture';
import {center} from '@shopify/react-native-skia';

export default function Switches() {
  const [bulb, setBulb] = useState(false);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: !bulb ? 'rgba(0,0,0,0.4)' : Colors.accent,
          
        },

      ]}>
         <Text style={{
          color:'#fff',
          fontSize:28,
          textAlign:'center',
          fontWeight:'bold'
        }}>Toggle switch</Text>
      <View style={{
        position:'absolute',
        top:60,
        alignSelf:'center',
        flexDirection:'row',
      }}>
       
      <AnimatedSwitch
        switchWidth={100}
        switchHeight={40}
        thumbSize={30}
        load={setBulb}
      />
      </View>
      <Text style={{
         position: 'absolute',
         bottom: 530,
          color:'#fff',
          fontSize:28,
          textAlign:'center',
          fontWeight:'bold'
        }}>Gesture switch</Text>
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          alignSelf: 'center',
        }}>
        <AnimatedSwitchWithGesture load={setBulb}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
