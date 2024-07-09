import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Alert, useColorScheme} from 'react-native';
import Svg, {
  Circle,
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
  runOnUI,
} from 'react-native-reanimated';

import Seats from '../Assets/svg/seats.svg';
import {TextInput} from 'react-native-gesture-handler';
import { darkTheme, lightTheme } from '../Style/theme';

const {width} = Dimensions.get('window');
const CIRCLE_RADIUS = width / 4;
const STROKE_WIDTH = 10;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedCircle2 = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

const CircularProgressAnimation = ({total_no_of_seats, no_of_seats,theme}) => {
  const progressValue = useSharedValue(0);
  const progressPercentage = (no_of_seats / total_no_of_seats) * 100;
  React.useEffect(() => {
    const normalizedProgress = progressPercentage / 100;
    progressValue.value = withTiming(normalizedProgress, {duration: 2000}); // pass to the duration if you want to slow the animation
  }, [progressPercentage]);

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

  const animatedTextValue = useDerivedValue(() => {
    return `${Math.round(progressValue.value * 100)}`;
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

    return {
      x:
        !Number.isInteger(progressPercentage) &&
        Number.isFinite(progressPercentage)
          ? x + 17
          : x + 8,
      y: y + 5,
    };
  });

  return (
    <>
      <View style={styles.container}>
        <Svg
          width={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80}
          height={CIRCLE_RADIUS * 2 + STROKE_WIDTH + 40}
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
            r={25}
            stroke={theme.progressBarSmallCircleBackgroundColor}
            strokeWidth={4}
            animatedProps={animatedPropsCircle2}
            strokeLinecap="round"
            fill="#fff"
          />

          <AnimatedText
            fill="#000"
            fontSize="12"
            fontWeight="bold"
            animatedProps={animatedPropsText}
            textAnchor="middle">
            {!Number.isInteger(progressPercentage) &&
            Number.isFinite(progressPercentage)
              ? progressPercentage.toFixed(2)
              : progressPercentage}
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
            //   textAnchor="middle"
            x={CIRCLE_RADIUS + STROKE_WIDTH / 2}
            y={CIRCLE_RADIUS + STROKE_WIDTH / 2 + 30}>
            <TSpan
              x={
                no_of_seats.length > 0
                  ? CIRCLE_RADIUS + STROKE_WIDTH / 2 - 28
                  : no_of_seats.length > 2
                  ? CIRCLE_RADIUS + STROKE_WIDTH / 2 - 38
                  : CIRCLE_RADIUS + STROKE_WIDTH / 2 - 16
              }
              dy="0em"
              fontSize={22}>
              {no_of_seats}
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
            bottom: (CIRCLE_RADIUS * 2 + STROKE_WIDTH + 20) / 2,
            right: (CIRCLE_RADIUS * 2 + STROKE_WIDTH + 20) / 2 - 4,
          }}
        />

        {/* <SvgXml xml={Seats} height={40} width={40}/> */}
        <View
          style={{
            height: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 50,
            width: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 50,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: theme.progressBarDottedCircleBorderColor,
            position: 'absolute',
            borderRadius: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80,
          }}
        />
      </View>
    </>
  );
};

const CircularProgress = () => {
    const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [total_no_of_seats, settotal_no_of_seats] = useState(0);
  const [no_of_seats, setno_of_seats] = useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgressAnimation
        total_no_of_seats={total_no_of_seats}
        no_of_seats={no_of_seats}
        theme={theme}
      />

      <TextInput
        placeholder="Total Seat"
        placeholderTextColor={theme.textColor}
        keyboardType="numeric"
        onChangeText={e => settotal_no_of_seats(e)}
        style={[styles.textinput,{
            color:theme.textColor,borderColor:theme.borderColor
        }]}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Booked Seat"
        placeholderTextColor={theme.textColor}
        onChangeText={e => {
          console.log(e);
          if (parseInt(e) >= 0 && parseInt(e) <= total_no_of_seats) {
            setno_of_seats(e);
          } else if (e.length === 0) {
            console.log(e.length);
            setno_of_seats(0);
          } else {
            Alert.alert('booked seat can not exceed total seat');
          }
        }}
        style={[styles.textinput,{
            color:theme.textColor,borderColor:theme.borderColor

        }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'yellow',
    height: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 40,
    width: CIRCLE_RADIUS * 2 + STROKE_WIDTH + 80,
    // borderStyle:'dashed',borderWidth:1,borderColor:'#000'
  },
  textinput: {
    borderWidth: 1,
    padding: 14,
    width: '90%',
    marginVertical: 14,
    borderRadius: 12,
    top:20,
  },
});

export default CircularProgress;
