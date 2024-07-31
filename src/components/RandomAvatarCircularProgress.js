import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  useColorScheme,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Image,
  Text as SvgText,
  SvgXml,
  TSpan,
} from 'react-native-svg';
import {LocalSvg} from 'react-native-svg/css';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import {darkTheme, lightTheme} from '../Style/theme';

const {width} = Dimensions.get('window');
const CIRCLE_RADIUS = width / 4;
const STROKE_WIDTH = 2;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedCircle2 = Animated.createAnimatedComponent(Circle);

const CircularProgressAnimation = ({progress, theme}) => {
  const progressValue = useSharedValue(0);
  const [hideSvg, setHideSvg] = useState(false);

  useEffect(() => {
    const normalizedProgress = progress / 100;
    progressValue.value = withTiming(normalizedProgress, {duration: 2000}); // pass to the duration if you want to slow the animation
  }, [progress]);

  const animatedPropsCircle1 = useAnimatedProps(() => {
    const circumference = CIRCLE_RADIUS * Math.PI * 2;
    const strokeDashoffset = circumference * (1 - progressValue.value);
    return {
      strokeDashoffset,
    };
  });
  const animatedPropsCircle2 = useAnimatedProps(() => {
    const x =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.cos(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;
    const y =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.sin(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;

    return {
      cx: x,
      cy: y,
    };
  });
  useDerivedValue(() => {
    if (progressValue.value === 1) {
      runOnJS(setHideSvg)(true);
    }
  }, [progressValue.value]);

  return (
    <View style={styles.container}>
      {!hideSvg && (
        <Svg
          width={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80}
          height={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80}
          viewBox={`0 -20 ${CIRCLE_RADIUS * 2 + STROKE_WIDTH} ${
            CIRCLE_RADIUS * 2 + STROKE_WIDTH + 45
          }`}
          // style={{backgroundColor: 'yellow'}}
        >
          <Circle
            cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            r={CIRCLE_RADIUS}
            stroke={theme.progressBarAvatarStrokeColor}
            strokeWidth={STROKE_WIDTH + 2}
            strokeDasharray={CIRCLE_RADIUS * Math.PI * 2}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedCircle
            cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            r={CIRCLE_RADIUS}
            stroke={theme.progressBarAvatarAnimatedStrokeColor}
            strokeWidth={STROKE_WIDTH + 6}
            strokeDasharray={CIRCLE_RADIUS * Math.PI * 2}
            animatedProps={animatedPropsCircle1}
            strokeLinecap="round"
            fill="none"
          />
          <AnimatedCircle2
            cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            r={10}
            stroke={'#fff'}
            strokeWidth={1}
            animatedProps={animatedPropsCircle2}
            strokeLinecap="round"
            fill={'#6200ee'}
            opacity={1}
          />
        </Svg>
      )}
      <LocalSvg
        asset={require('../Assets/svg/beanhead.svg')}
        height={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 70}
        width={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 90}
        style={{
          // backgroundColor: 'yellow',
          position: 'absolute',
          alignSelf: 'center',
          bottom: 40,
        }}
      />
      {/* <SvgXml xml={Seats} height={40} width={40}/> */}
    </View>
  );
};

const RandomAvatarCircularProgress = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'red'
      }}>
      <CircularProgressAnimation progress={75} theme={theme} />
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
  textinput: {
    borderWidth: 1,
    padding: 14,
    width: '90%',
    marginVertical: 14,
    borderRadius: 12,
    top: 20,
  },
});

export default RandomAvatarCircularProgress;
