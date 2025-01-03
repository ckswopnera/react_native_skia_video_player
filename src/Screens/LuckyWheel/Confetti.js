import React, { forwardRef, useMemo, useImperativeHandle } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const initialTopPosition = 0.5;

const getRandomValue = (min, max) => Math.random() * (max - min) + min;
const getRandomColor = (colors) =>
  colors[Math.floor(getRandomValue(0, colors.length))];

const Confetti = ({ style }) => (
  <Animated.View style={[styles.confetti, style]} pointerEvents="none" />
);

const Explosion = forwardRef(
  ({ count, origin, explosionSpeed, fallSpeed, colors, fadeOut }, ref) => {
    const animationValue = useSharedValue(0);

    // Generate confetti items
    const confettiItems = useMemo(
      () =>
        Array(count)
          .fill()
          .map(() => ({
            leftDelta: getRandomValue(0, 1),
            topDelta: getRandomValue(initialTopPosition, 1),
            swingDelta: getRandomValue(0.2, 1),
            speedDelta: {
              rotateX: getRandomValue(0.3, 1),
              rotateY: getRandomValue(0.3, 1),
              rotateZ: getRandomValue(0.3, 1),
            },
            color: getRandomColor(colors),
          })),
      [count, colors]
    );

    // Start animation
    const startAnimation = () => {
      animationValue.value = 0;
      animationValue.value = withSequence(
        withTiming(1, {
          duration: explosionSpeed,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(2, {
          duration: fallSpeed,
          easing: Easing.linear,
        })
      );
    };

    // Expose start and stop methods
    useImperativeHandle(ref, () => ({
      start: startAnimation,
      stop: () => {
        animationValue.value = 0;
      },
    }));

    return (
      <View style={styles.explosionContainer} pointerEvents="none">
        {confettiItems.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const top = interpolate(
              animationValue.value,
              [0, 1, 1 + item.topDelta, 2],
              [
                origin.y,
                origin.y - item.topDelta * screenHeight,
                origin.y,
                origin.y,
              ]
            );
            const left = interpolate(
              animationValue.value,
              [0, 1, 2],
              [origin.x, item.leftDelta * screenWidth, item.leftDelta * screenWidth]
            );
            const opacity = interpolate(
              animationValue.value,
              [0, 1, 1.8, 2],
              [1, 1, 1, fadeOut ? 0 : 1]
            );
            const translateX = interpolate(
              animationValue.value,
              [0, 0.4, 1.2, 2],
              [0, -item.swingDelta * 30, item.swingDelta * 30, 0]
            );
            const rotateX = `${interpolate(
              animationValue.value,
              [0, 2],
              [0, item.speedDelta.rotateX * 360 * 10]
            )}deg`;
            const rotateY = `${interpolate(
              animationValue.value,
              [0, 2],
              [0, item.speedDelta.rotateY * 360 * 5]
            )}deg`;
            const rotateZ = `${interpolate(
              animationValue.value,
              [0, 2],
              [0, item.speedDelta.rotateZ * 360 * 2]
            )}deg`;

            return {
              transform: [
                { translateX: left },
                { translateY: top },
                { rotateX },
                { rotateY },
                { rotate: rotateZ },
              ],
              opacity,
              backgroundColor: item.color,
            };
          });

          return (
            <Confetti
              key={index}
              style={[
                animatedStyle,
                {
                  width: getRandomValue(8, 16), // width of confetti pieces 
                  height: getRandomValue(6, 20), // height of confetti pieces 
                  borderRadius: Math.random() < 0.5 ? 50 : 0,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  explosionContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  confetti: {
    position: "absolute",
  },
});

export default Explosion;
