import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const MovieIcon = ({width, height, fill}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Rect width="24" height="24" fill="none" />
    <Path d="M23 7L17 12L23 17V7Z" fill={fill} />
    <Rect x="2" y="5" width="15" height="14" rx="2" ry="2" fill={fill} />
  </Svg>
);

export default MovieIcon;
