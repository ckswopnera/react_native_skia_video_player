import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {Colors} from '../Style/theme';

const BORDER_WIDTH = 2;

const AnimatedSwitch = props => {
  const [isOn, setIsOn] = useState(false);
  const progress = useSharedValue(0);
  const toggleSwitch = () => {
    setIsOn(!isOn);
    props.load(!isOn)
    progress.value = withTiming(isOn ? 0 : 1, {duration: 200});
  };

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            isOn
              ? props.switchWidth - props.thumbSize - BORDER_WIDTH - 4 * 2
              : 0,
            {duration: 200},
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

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View
        style={[
          styles.container,
          {
            width: props.switchWidth,
            height: props.switchHeight,
            borderRadius: props.switchHeight / 2,
            borderWidth: BORDER_WIDTH,
            padding: BORDER_WIDTH,
          },
          backgroundColorStyle,
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: props.thumbSize,
              height: props.thumbSize,
              borderRadius: props.thumbSize / 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#fff',
  },
});

export default AnimatedSwitch;
