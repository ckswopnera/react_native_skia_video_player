import React, { useEffect, useState } from "react";
import {
  Canvas,
  LinearGradient,
  Fill,
  interpolateColors,
  vec,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { windowHeight, windowWidth } from "../utils/util";

const startColors = [
  "rgba(34, 193, 195, 0.4)",
  "rgba(34,193,195,0.4)",
  "rgba(63,94,251,1)",
  "rgba(253,29,29,0.4)",
  "rgba(0,0,0,0.7)",
];
const endColors = [
  "rgba(0,212,255,0.4)",
  "rgba(253,187,45,0.4)",
  "rgba(252,70,107,1)",
  "rgba(252,176,69,0.4)",
  "rgba(255,255,255,1)",
];

export const AnimatedColorGradient = () => {
  const colorsIndex = useSharedValue(0);
  const [gradientColors, setGradientColors] = useState([startColors[0], endColors[0]]);

  useEffect(() => {
    colorsIndex.value = withRepeat(
      withTiming(1, {
        duration: 4000,
      }),
      -1,
      true
    );

    const updateColors = () => {
      const progress = colorsIndex.value;
      const interpolatedStartColors = interpolateColors(progress, [0, 0.25, 0.5, 0.75, 1], startColors);
      const interpolatedEndColors = interpolateColors(progress, [0, 0.25, 0.5, 0.75, 1], endColors);
      setGradientColors([interpolatedStartColors, interpolatedEndColors]);
    };

    const intervalId = setInterval(updateColors, 1000 / 60); 
    return () => clearInterval(intervalId);
  }, [colorsIndex]);

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(windowWidth, windowHeight)}
          colors={gradientColors}
        />
      </Fill>
    </Canvas>
  );
};
