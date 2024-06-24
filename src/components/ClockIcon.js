import {center} from '@shopify/react-native-skia';
import React from 'react';
import {View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';

const ClockIcon = ({width, height, fill}) => {
  const iconColor='#f2f2f2';
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx="5"
        cy="18"
        r="4"
        stroke={'#333'}
        strokeWidth="1"
        fill={fill}
      />

      <Line x1="5" y1="18" x2="5" y2="14.6" stroke={iconColor} strokeWidth="0.7" />

      <Line x1="5" y1="18" x2="7.6" y2="18" stroke={iconColor} strokeWidth="1.3" />

      <Circle cx="5" cy="18" r="0.7" fill={'#333'} />
    </Svg>
  );
};

export default ClockIcon;
