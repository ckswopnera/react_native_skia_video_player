import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import {windowHeight, windowWidth} from '../utils/util';
import {Colors} from '../Style/theme';

const SWITCH_WIDTH = windowWidth - 30;
const SWITCH_HEIGHT = 60;
const THUMB_SIZE = 50;
const BORDER_WIDTH = 2;

const AnimatedSwitch = props => {
  const [isOn, setIsOn] = useState(false);
  const progress = useSharedValue(0);

  //   const toggleSwitch = (value) => {
  //     setIsOn(value);
  //     progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  //   };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      const newPosition =
        (event.translationX +
          (isOn ? SWITCH_WIDTH - THUMB_SIZE - BORDER_WIDTH - 3 * 2 : 0)) /
        (SWITCH_WIDTH - THUMB_SIZE - BORDER_WIDTH * 2);
      progress.value = interpolate(newPosition, [0, 1], [0, 1], 'clamp');
    })
    .onEnd(() => {
      const newPosition = progress.value > 0.5 ? 1 : 0;
      progress.value = withTiming(newPosition, {duration: 200});
      runOnJS(setIsOn)(newPosition === 1);
      // runOnJS(props.load)(!isOn);
    });

  //   const tapGesture = Gesture.Tap().onEnd(() => {
  //     runOnJS(toggleSwitch)(!isOn);
  //   });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, SWITCH_WIDTH - THUMB_SIZE - BORDER_WIDTH - 3 * 2],
          ),
        },
      ],
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#ccc', Colors.red],
      ),
    };
  });

  const ShapeChange = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [Colors.white, Colors.yellow],
      ),
      borderRadius: interpolate(progress.value, [0, 1], [20, windowWidth]),
    };
  });

  return (
    <>
      <Animated.View
        style={[
          {
            height: windowWidth - 50,
            marginVertical: 20,
            borderRadius: 20,
          },
          ShapeChange,
        ]}
      />
      <GestureHandlerRootView>
        <GestureDetector
          gesture={Gesture.Exclusive(
            panGesture,
            // tapGesture
          )}>
          <Animated.View style={[styles.switch, backgroundColorStyle]}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: '#ddd',
    justifyContent: 'center',
    padding: BORDER_WIDTH,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
  },
});

export default AnimatedSwitch;
