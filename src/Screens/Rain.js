import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

const {width} = Dimensions.get('window');
const CLOUD_BOTTOM = 200;

const CloudRainAnimation = () => {
  const raindrops = Array.from({length: 40}, (_, index) => ({
    key: index,
    startX: Math.random() * width,
  }));

  const thunderboltY = useSharedValue(CLOUD_BOTTOM - 10);
  const thunderboltOpacity = useSharedValue(1);

  useEffect(() => {
    thunderboltOpacity.value = withRepeat(
      withTiming(0, {
        duration: 200,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
  }, [thunderboltOpacity]);

  const thunderboltStyle = useAnimatedStyle(() => {
    return {
      left: width / 2 - 60,
      top: thunderboltY.value,
      opacity: thunderboltOpacity.value,
      transform: [{rotate: '15deg'}, ],
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height="250" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient
            id="cloudGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <Stop offset="0%" stopColor="rgba(0,0,0,1)" />
            <Stop offset="90%" stopColor="rgba(255,255,255,1)" />
          </LinearGradient>
        </Defs>
        <Circle cx="100" cy="60" r="50" fill="url(#cloudGradient)" />
        <Circle cx="70" cy="110" r="60" fill="url(#cloudGradient)" />
        <Circle cx="130" cy="100" r="50" fill="url(#cloudGradient)" />
        <Circle cx="170" cy="100" r="50" fill="url(#cloudGradient)" />
        <Circle cx="220" cy="100" r="50" fill="url(#cloudGradient)" />
        <Circle cx="20" cy="90" r="53" fill="url(#cloudGradient)" />
        <Circle cx="-20" cy="110" r="50" fill="url(#cloudGradient)" />
        <Circle cx="-35" cy="90" r="50" fill="url(#cloudGradient)" />
        <Circle cx="170" cy="120" r="50" fill="url(#cloudGradient)" />
        <Circle cx="70" cy="100" r="50" fill="url(#cloudGradient)" />
      </Svg>

      {raindrops.map(({key, startX}) => {
        const translateY = useSharedValue(-20);

        useEffect(() => {
          translateY.value = withRepeat(
            withTiming(200, {
              duration: 2000 + Math.random() * 2000,
              easing: Easing.linear,
            }),
            -1,
            false,
          );
        }, [translateY]);

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{translateY: translateY.value}],
          };
        });

        return (
          <Animated.View
            key={key}
            style={[
              animatedStyle,
              {position: 'absolute', left: startX, top: CLOUD_BOTTOM},
            ]}>
            <Svg width="12" height="24" viewBox="0 0 12 24">
              <Defs>
                <LinearGradient
                  id="cloudGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%">
                  <Stop offset="40%" stopColor="rgba(0, 0, 255,1)" />
                  <Stop offset="50%" stopColor="rgba(0, 0, 255,0.5)" />
                  <Stop offset="90%" stopColor="rgba(0, 255, 255,0.8)" />
                </LinearGradient>
              </Defs>
              <Path
                d="M6 24C8.8 24 11 20.4 11 16C11 11.6 6 0 6 0C6 0 1 11.6 1 16C1 20.4 3.2 24 6 24Z"
                fill="url(#cloudGradient)"
              />
            </Svg>
          </Animated.View>
        );
      })}

      <Animated.View
        style={[
          thunderboltStyle,
          {
            position: 'absolute',
            zIndex: -1,
          },
        ]}>
        <Svg
          width="100"
          height="120"
          viewBox="0 0 100 150"
          xmlns="http://www.w3.org/2000/svg">
          <G fill="red" stroke="black" stroke-width="8">
            <Path d="M50 10 L60 40 L50 35 L40 70 L50 60 L40 90 L60 80 L50 130" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor:'yellow'
  },
});

export default CloudRainAnimation;
