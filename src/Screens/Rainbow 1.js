import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const RainbowPath = Animated.createAnimatedComponent(Path);

const Rainbow1 = () => {
  const progress = useSharedValue(0);

  progress.value = withRepeat(
    withTiming(1, {
      duration: 3000, 
      easing: Easing.linear,
    }),
    -1, 
    false 
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: 400 * (1 - progress.value), 
    };
  });

  return (
    <View style={{alignItems:'center',justifyContent:'center'}}>

      <Svg height="200" width="300" viewBox="0 0 300 200">
        <Defs>
          <LinearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="red" />
            <Stop offset="17%" stopColor="orange" />
            <Stop offset="34%" stopColor="yellow" />
            <Stop offset="50%" stopColor="green" />
            <Stop offset="67%" stopColor="blue" />
            <Stop offset="84%" stopColor="indigo" />
            <Stop offset="100%" stopColor="violet" />
          </LinearGradient>
  
        </Defs>

        <RainbowPath
          d="M10 150 A 140 140 0 0 1 280 150" 
          fill="none"
          stroke="url(#rainbowGradient)"
          strokeWidth="8"
          strokeDasharray="400" 
          animatedProps={animatedProps} 
        />

      </Svg>
    </View>
  );
};

export default Rainbow1;

