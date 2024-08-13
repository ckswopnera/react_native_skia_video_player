import {View, Text} from 'react-native';
import React from 'react';
import {Canvas, Circle, LinearGradient, vec} from '@shopify/react-native-skia';

export default function ButtonSkia() {
  const r = 60;
  const canvasSize = 140;
  return (
    <Canvas
      style={{
        height: canvasSize,
        width: canvasSize,
      }}>
      <Circle cx={canvasSize / 2} cy={canvasSize / 2} r={r}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(2 * r, 2 * r)}
          colors={['#00ff87', '#60efff']}
        />
      </Circle>
    </Canvas>
  );
}
