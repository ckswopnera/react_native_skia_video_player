import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';

const ZoomableImage = () => {
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const focalX = event.focalX - 150;
      const focalY = event.focalY - 150;

      scale.value = event.scale;
      translationX.value = focalX * (1 - event.scale);
      translationY.value = focalY * (1 - event.scale);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translationX.value},
        {translateY: translationY.value},
        {scale: scale.value},
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={animatedStyle}>
          <Image
            source={require('../Assets/images/ashokachakra.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default ZoomableImage;
