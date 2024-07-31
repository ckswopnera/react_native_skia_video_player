import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  useColorScheme,TextInput
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
} from 'react-native-reanimated';

import Seats from '../Assets/svg/seats.svg';
import {darkTheme, lightTheme} from '../Style/theme';

const {width} = Dimensions.get('window');
const CIRCLE_RADIUS = width / 4;
const STROKE_WIDTH = 10;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedCircle2 = Animated.createAnimatedComponent(Circle);
const AnimatedCircle3 = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

const CircularProgressAnimation = ({
  total_no_of_seats,
  booked_no_of_seats,
  theme,
}) => {
  // console.log({total_no_of_seats}, {booked_no_of_seats});
  const progressValue = useSharedValue(0);
  const progressPercentage =
    total_no_of_seats > 0 ? (booked_no_of_seats / total_no_of_seats) * 100 : 0;
  const [bookedStateSpace, setbookedStateSpace] = useState(0);

  const [percentageText, setpercentageText] = useState(0);
  const circle3Radius = 24;
  const circle2Radius = 23;
  const circle1Radius = 24;

  useEffect(() => {
    const normalizedProgress = progressPercentage / 100;
    progressValue.value = withTiming(normalizedProgress, {duration: 2000}); // pass to the duration if you want to slow the animation
  }, [progressPercentage]);

  useEffect(() => {
    let newBookedStateSpace = '';
    for (let i = 0; i < booked_no_of_seats.toString().length; i++) {
      newBookedStateSpace += booked_no_of_seats.toString()[i] + '  ';
    }
    setbookedStateSpace(newBookedStateSpace.trim());
  }, [total_no_of_seats, booked_no_of_seats]);

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

  const animatedPropsCircle3 = useAnimatedProps(() => {
    const x =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.cos(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;
    const y =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.sin(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;

    const circumference = circle3Radius * Math.PI * 2;
    const strokeDashoffset = circumference * (1 - progressValue.value);
    return {
      cx: x,
      cy: y,
      strokeDashoffset,
    };
  });
  const animatedPropsText = useAnimatedProps(() => {
    const x =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.cos(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;
    const y =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.sin(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;

    return {
      x: x - 3,
      y: y + 5,
    };
  });

  const animatedPropsText2 = useAnimatedProps(() => {
    const x =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.cos(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;
    const y =
      CIRCLE_RADIUS +
      STROKE_WIDTH / 2 +
      Math.sin(progressValue.value * 2 * Math.PI) * CIRCLE_RADIUS;

    const adjustedX =
      !Number.isInteger(percentageText) && Number.isFinite(percentageText)
        ? x + 16
        : percentageText === 0 || percentageText.toString().length === 1
        ? x + 7
        : x + 14;

    return {
      x: adjustedX,
      y: y + 5,
    };
  });

  useDerivedValue(() => {
    runOnJS(setpercentageText)(progressValue.value * 100);
  }, [progressValue.value]);

  return (
    <View style={styles.container}>
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
          stroke={theme.progressBarBackgroundColor}
          strokeWidth={STROKE_WIDTH + 10}
          strokeDasharray={CIRCLE_RADIUS * Math.PI * 2}
          fill="none"
          strokeLinecap="round"
        />

        <AnimatedCircle
          cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          r={CIRCLE_RADIUS}
          stroke="red"
          strokeWidth={STROKE_WIDTH + 8}
          strokeDasharray={CIRCLE_RADIUS * Math.PI * 2}
          animatedProps={animatedPropsCircle1}
          strokeLinecap="round"
          fill="none"
        />

        <AnimatedCircle2
          cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          r={circle1Radius}
          stroke={theme.progressBarSmallCircleShadowBackgroundColor}
          strokeWidth={4}
          animatedProps={animatedPropsCircle2}
          strokeLinecap="round"
          fill="rgba(0,0,0,0.4)"
          opacity={1}
        />
        <AnimatedCircle2
          cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          r={circle2Radius}
          stroke={theme.progressBarSmallCircleBackgroundColor}
          strokeWidth={1}
          animatedProps={animatedPropsCircle2}
          strokeLinecap="round"
          fill="#fff"
          opacity={1}
        />
        <AnimatedCircle3
          cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          r={24}
          stroke={theme.progressBarSmallCircleAnimationStrokeColor}
          strokeWidth={4}
          strokeDasharray={circle3Radius * Math.PI * 2}
          animatedProps={animatedPropsCircle3}
          strokeLinecap="round"
          fill="none"
        />

        <AnimatedText
          fill="#000"
          fontSize="12"
          fontWeight="bold"
          animatedProps={animatedPropsText}
          textAnchor="middle">
          {/* {!Number.isInteger(progressPercentage) &&
          Number.isFinite(progressPercentage)
            ? progressPercentage.toFixed(2)
            : progressPercentage} */}
          {/* {percentageText} */}
          {!Number.isInteger(percentageText) && Number.isFinite(percentageText)
            ? percentageText.toFixed(2)
            : percentageText}
        </AnimatedText>

        <AnimatedText
          fill="#000"
          fontSize="12"
          fontWeight="bold"
          animatedProps={animatedPropsText2}
          textAnchor="middle">
          %
        </AnimatedText>
        <SvgText
          fill={theme.textColor}
          fontSize="12"
          fontWeight="bold"
          // textAnchor="middle"
          x={CIRCLE_RADIUS + STROKE_WIDTH / 2}
          y={CIRCLE_RADIUS + STROKE_WIDTH / 2 + 30}>
          <TSpan
            x={
              booked_no_of_seats === 0
                ? CIRCLE_RADIUS + STROKE_WIDTH / 2 - 17
                : CIRCLE_RADIUS +
                  STROKE_WIDTH / 2 -
                  (17 + bookedStateSpace.length * 4)
            }
            dy="0em"
            fontSize={22}>
            {booked_no_of_seats}
          </TSpan>
          <TSpan x={CIRCLE_RADIUS + STROKE_WIDTH / 2} dy="0em" fontSize={16}>
            / {total_no_of_seats}
          </TSpan>
          <TSpan x={CIRCLE_RADIUS + STROKE_WIDTH / 2 - 45} dy="1.5em">
            No. of Seats Filled
          </TSpan>
        </SvgText>
      </Svg>
      <LocalSvg
        asset={require('../Assets/svg/seats.svg')}
        height={70}
        width={70}
        style={{
          // backgroundColor:'yellow',
          position: 'absolute',
          // alignSelf:'center',
          bottom: (CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80) / 2,
          right: (CIRCLE_RADIUS * 2 + STROKE_WIDTH + 20) / 2 - 7,
        }}
      />

      {/* <SvgXml xml={Seats} height={40} width={40}/> */}
      <View
        style={{
          height: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 90,
          width: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 90,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: theme.progressBarDottedCircleBorderColor,
          position: 'absolute',
          borderRadius: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80,
        }}
      />
    </View>
  );
};

const CircularProgressBar = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [total_no_of_seats, settotal_no_of_seats] = useState(0);
  const [booked_no_of_seats, setno_of_seats] = useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgressAnimation
        total_no_of_seats={parseInt(total_no_of_seats)}
        booked_no_of_seats={parseInt(booked_no_of_seats)}
        theme={theme}
      />
      <TextInput
        placeholder="Total Seat"
        placeholderTextColor={theme.textColor}
        keyboardType="numeric"
        value={total_no_of_seats}
        onChangeText={e => {
          if (parseInt(e) >= 0) {
            settotal_no_of_seats(e);
          } else if (parseInt(e) < 0) {
            settotal_no_of_seats(0);

            Alert.alert('booked seat can not be negative');
          } else {
            settotal_no_of_seats(0);
          }
        }}
        style={[
          styles.textinput,
          {
            color: theme.textColor,
            borderColor: theme.borderColor,
          },
        ]}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Booked Seat"
        placeholderTextColor={theme.textColor}
        value={booked_no_of_seats}

        onChangeText={e => {
          if (parseInt(e) >= 0 && parseInt(e) <= total_no_of_seats) {
            setno_of_seats(e);
          } else if (e < 0) {
            Alert.alert('booked seat can not be negative');
          } else if (e > total_no_of_seats) {
            Alert.alert('booked seat can not exceed total seat');
          } else {
            setno_of_seats(0);
          }
        }}
        style={[
          styles.textinput,
          {
            color: theme.textColor,
            borderColor: theme.borderColor,
          },
        ]}
      />
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

export default CircularProgressBar;
