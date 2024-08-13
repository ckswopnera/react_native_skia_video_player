import React from 'react';
import {View} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const RainbowPath = Animated.createAnimatedComponent(Path);

const Rainbow2 = () => {
  const progress = useSharedValue(0);

  progress.value = withRepeat(
    withTiming(1, {
      duration: 3000,
      easing: Easing.linear,
    }),
    -1,
    false,
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: 450 * (1 - progress.value),
    };
  });

  return (
    <View style={{alignItems:'center',justifyContent:'center'}}>
      <Svg height="200" width="300" viewBox="0 0 300 200">
        <Defs>
          <LinearGradient
            id="rainbowGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="red" />
            <Stop offset="100%" stopColor="red" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="orange" />
            <Stop offset="100%" stopColor="orange" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient3"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="yellow" />
            <Stop offset="100%" stopColor="yellow" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient4"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="green" />
            <Stop offset="100%" stopColor="green" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient5"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="blue" />
            <Stop offset="100%" stopColor="blue" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient6"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="indigo" />
            <Stop offset="100%" stopColor="indigo" />
          </LinearGradient>
          <LinearGradient
            id="rainbowGradient7"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%">
            <Stop offset="0%" stopColor="violet" />
            <Stop offset="100%" stopColor="violet" />
          </LinearGradient>
        </Defs>

        <RainbowPath
          d="M10 180 A 140 140 0 0 1 290 180"
          fill="none"
          stroke="url(#rainbowGradient1)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 135 135 0 0 1 285 180"
          fill="none"
          stroke="url(#rainbowGradient2)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 130 130 0 0 1 280 180"
          fill="none"
          stroke="url(#rainbowGradient3)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 125 125 0 0 1 275 180"
          fill="none"
          stroke="url(#rainbowGradient4)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 120 120 0 0 1 270 180"
          fill="none"
          stroke="url(#rainbowGradient5)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 115 115 0 0 1 265 180"
          fill="none"
          stroke="url(#rainbowGradient6)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
        <RainbowPath
          d="M10 180 A 110 110 0 0 1 260 180"
          fill="none"
          stroke="url(#rainbowGradient7)"
          strokeWidth="4"
          strokeDasharray="450"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default Rainbow2;
