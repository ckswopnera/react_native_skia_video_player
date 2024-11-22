import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Svg, Rect, Mask, Path } from 'react-native-svg';
import { windowWidth } from '../utils/util';

const CARD_SIZE = windowWidth - 100;
const TOTAL_AREA = CARD_SIZE * CARD_SIZE;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ScratchScreen = () => {
  const path = useSharedValue('');
  const revealedArea = useSharedValue(0);
  const isRevealed = useSharedValue(false);

  const [svgOffset, setSvgOffset] = useState({ x: 0, y: 0 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isRevealed.value ? 1 : 0),
    };
  });

  const triggerReveal = () => {
    console.log('Revealed!');
    alert('You Won!');
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      const adjustedX = Math.min(Math.max(event.x - svgOffset.x, 0), CARD_SIZE); 
      const adjustedY = Math.min(Math.max(event.y - svgOffset.y, 0), CARD_SIZE); 
      path.value += `M${adjustedX},${adjustedY} `;
    },
    onActive: (event) => {
      const adjustedX = Math.min(Math.max(event.x - svgOffset.x, 0), CARD_SIZE); 
      const adjustedY = Math.min(Math.max(event.y - svgOffset.y, 0), CARD_SIZE); 
      path.value += `L${adjustedX},${adjustedY} `;
      revealedArea.value += 30 * 10;
      if (!isRevealed.value && revealedArea.value >= TOTAL_AREA * 0.4) {
        isRevealed.value = true;
        runOnJS(triggerReveal)();
      }
    },
  });

  const animatedProps = useAnimatedProps(() => ({
    d: path.value,
  }));

  return (
    <View style={styles.container}>
      <View
        style={styles.scratchSurfaceContainer}
        onLayout={(event) => {
          const { x, y } = event.nativeEvent.layout;
          setSvgOffset({ x, y });
        }}
      >
        <Svg
          height={CARD_SIZE}
          width={CARD_SIZE}
          style={[styles.scratchSurface, { borderRadius: 20, overflow: 'hidden' }]}
        >
          <Mask id="mask">
            <Rect x="0" y="0" width="100%" height="100%" fill="white" />
            <AnimatedPath
              animatedProps={animatedProps}
              stroke="black"
              strokeWidth={40}
              strokeLinecap="round"
              fill="none"
            />
          </Mask>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="gray"
            mask="url(#mask)"
          />
        </Svg>
      </View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill} />
      </PanGestureHandler>

      <Animated.View style={[styles.hiddenContent, animatedStyle]}>
        <Text style={styles.hiddenText}>You Won </Text>
        <Text style={styles.hiddenText}>Rs 1000</Text>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  scratchSurfaceContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  scratchSurface: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'transparent',
  },
  hiddenContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -CARD_SIZE / 2 }, { translateY: -CARD_SIZE / 2 }],
    width: CARD_SIZE,
    height: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  hiddenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default ScratchScreen;
