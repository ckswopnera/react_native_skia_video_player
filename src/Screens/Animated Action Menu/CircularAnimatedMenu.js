import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, useColorScheme, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {darkTheme, lightTheme} from '../../Style/theme';
import Feather from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');
const CIRCLE_RADIUS = width / 3;
const STROKE_WIDTH = 10;
const ICON_SIZE = 24;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressAnimation = ({total_no_of_icons, theme}) => {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withRepeat(
      withTiming(1, {duration: 5000, easing: Easing.linear}),
      -1,
      false,
    );
  }, []);

  const animatedCirclePositions = Array.from({length: total_no_of_icons}).map(
    (_, index) => {
      const angle = (index / total_no_of_icons) * Math.PI * 2;
      return {
        animatedProps: useAnimatedProps(() => {
          const rotationAngle = progressValue.value * 2 * Math.PI + angle;
          const x =
            CIRCLE_RADIUS +
            STROKE_WIDTH / 2 +
            Math.cos(rotationAngle) * CIRCLE_RADIUS;
          const y =
            CIRCLE_RADIUS +
            STROKE_WIDTH / 2 +
            Math.sin(rotationAngle) * CIRCLE_RADIUS;
          return {
            cx: x,
            cy: y,
          };
        }),
        initialX:
          CIRCLE_RADIUS + STROKE_WIDTH / 2 + Math.cos(angle) * CIRCLE_RADIUS,
        initialY:
          CIRCLE_RADIUS + STROKE_WIDTH / 2 + Math.sin(angle) * CIRCLE_RADIUS,
      };
    },
  );

  return (
    <View style={styles.container}>
      <Svg
        width={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80}
        height={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80}
        viewBox={`0 -20 ${CIRCLE_RADIUS * 2 + STROKE_WIDTH} ${
          CIRCLE_RADIUS * 2 + STROKE_WIDTH + 45
        }`}>
        <Circle
          cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          r={CIRCLE_RADIUS}
          stroke={theme.progressBarBackgroundColor}
          strokeWidth={STROKE_WIDTH + 3}
          strokeDasharray={CIRCLE_RADIUS * Math.PI * 2}
          fill="none"
          strokeLinecap="round"
        />

        {animatedCirclePositions.map(
          ({animatedProps, initialX, initialY}, index) => {
            const animatedStyle = useAnimatedStyle(() => {
              const rotationAngle =
                progressValue.value * 2 * Math.PI +
                (index / total_no_of_icons) * Math.PI * 2;
              const x =
                CIRCLE_RADIUS +
                STROKE_WIDTH / 2 +
                Math.cos(rotationAngle) * CIRCLE_RADIUS;
              const y =
                CIRCLE_RADIUS +
                STROKE_WIDTH / 2 +
                Math.sin(rotationAngle) * CIRCLE_RADIUS;

              return {
                transform: [
                  {translateX: x - ICON_SIZE / 2},
                  {translateY: y - ICON_SIZE / 2},
                ],
              };
            });

            return (
              <View key={index.toString()} style={styles.iconContainer}>
                <AnimatedCircle
                  r={23}
                  stroke={theme.progressBarSmallCircleShadowBackgroundColor}
                  strokeWidth={1}
                  animatedProps={animatedProps}
                  strokeLinecap="round"
                  fill="rgba(0,0,0,0.4)"
                  opacity={1}
                />

                <AnimatedCircle
                  r={24}
                  stroke={theme.progressBarSmallCircleBackgroundColor}
                  strokeWidth={2}
                  animatedProps={animatedProps}
                  strokeLinecap="round"
                  fill="#fff"
                  opacity={1}/>
                  
                <Animated.View style={animatedStyle}>
                <Feather name="home" size={ICON_SIZE} />
              </Animated.View>
              </View>
            );
          },
        )}
      </Svg>
    </View>
  );
};

const CircularAnimatedMenu = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgressAnimation total_no_of_icons={4} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80,
    width: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80,
  },
  iconContainer: {
    position: 'absolute',
  },
});

export default CircularAnimatedMenu;
