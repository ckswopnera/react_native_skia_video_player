import React, {useState} from 'react';
import {StyleSheet, View, PanResponder} from 'react-native';
import {Canvas, Path, Circle} from '@shopify/react-native-skia';

// Define the cubic Bézier path
const PATH_D = 'M0,50 C25,100 75,0 100,50 C125,100 175,0 200,50';

const CONTROL_POINTS = [
  {x: 0, y: 50},
  {x: 25, y: 100},
  {x: 75, y: 0},
  {x: 100, y: 50},
  {x: 125, y: 100},
  {x: 175, y: 0},
  {x: 200, y: 50},
];

const cubicBezier = (t, p0, p1, p2, p3) => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return {x, y};
};

const Waveform = () => {
  const [circlePos, setCirclePos] = useState({x: 0, y: 50});

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: event => {
      const x = event.nativeEvent.locationX;

      const clampedX = Math.max(0, Math.min(200, x));

      let segmentIndex = Math.floor(clampedX / 100) * 3;
      segmentIndex = Math.min(segmentIndex, CONTROL_POINTS.length - 4);
      const segmentStartX = CONTROL_POINTS[segmentIndex].x;
      const segmentEndX = CONTROL_POINTS[segmentIndex + 3].x;

      const t = (clampedX - segmentStartX) / (segmentEndX - segmentStartX);

      const p0 = CONTROL_POINTS[segmentIndex];
      const p1 = CONTROL_POINTS[segmentIndex + 1];
      const p2 = CONTROL_POINTS[segmentIndex + 2];
      const p3 = CONTROL_POINTS[segmentIndex + 3];
      const point = cubicBezier(t, p0, p1, p2, p3);

      setCirclePos({x: clampedX, y: point.y});
    },
    onPanResponderRelease: () => {},
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Canvas style={styles.waveform}>
        <Path path={PATH_D} color="red" style="stroke" strokeWidth={5} />
        <Circle cx={circlePos.x} cy={circlePos.y} r={8} color="grey" />
        {/* <Circle
          color="#fff"
          cx={circlePos.x}
          cy={circlePos.y}
          r={12}
          stroke={'red'}
          strokeWidth={20}
          strokeDasharray={20 * Math.PI * 2}
          fill="none"
          strokeLinecap="round"
        /> */}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    width: '100%',
    height: 100,
  },
});

export default Waveform;
