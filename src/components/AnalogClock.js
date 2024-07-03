import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';

const AnalogClock = ({stroke, fill}) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondHandRotation = (seconds / 60) * 360;
  const minuteHandRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourHandRotation = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle
          cx="100"
          cy="100"
          r="95"
          stroke={stroke}
          strokeWidth="2.5"
          fill={fill}
          opacity={0.6}
        />
        {/* Hour Hand */}
        <Line
          x1="100"
          y1="100"
          x2="100"
          y2="50"
          stroke="black"
          strokeWidth="7"
          strokeLinecap="round"
          transform={`rotate(${hourHandRotation}, 100, 100)`}
        />
        {/* Minute Hand */}
        <Line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${minuteHandRotation}, 100, 100)`}
        />
        {/* Second Hand */}
        <Line
          x1="100"
          y1="100"
          x2="100"
          y2="20"
          stroke="red"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondHandRotation}, 100, 100)`}
        />
        <Circle cx="100" cy="100" r="3" fill="black" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
  },
});

export default AnalogClock;
