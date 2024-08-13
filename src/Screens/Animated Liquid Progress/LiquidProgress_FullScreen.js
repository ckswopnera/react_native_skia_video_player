import {area, scaleLinear} from 'd3';
import {useEffect} from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  Skia,
  Text,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { windowWidth } from '../../utils/util';

export const LiquidGaugeProgress = ({height, width, value}) => {
  const radius = Math.min(width, height) * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleSize = radius * 2 - fillCircleMargin * 2;

  const minValue = 0;
  const maxValue = 100;
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = width / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = height * 0.1 * fillPercent;
  const fontSize = radius / 4;
  const font = useFont(require('../../Assets/fonts/Inter-Bold.ttf'), fontSize);
  const textWidth = font ? font.measureText(`${value}`).width : 0;
  const textTranslateX = windowWidth/4;
  const textTransform = [{translateY: height * 0.5 - fontSize * 0.7}];
  const data = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);
  const clipArea = area()
    .x(function (d) {
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
    })
    .y1(function (_d) {
      return height; 
    });

  const clipSvgPath = clipArea(data);
  const translateXAnimated = useSharedValue(0);
  const translateYPercent = useSharedValue(0);
  const textValue = useSharedValue(0);

  useEffect(() => {
    textValue.value = withTiming(value, {
      duration: 1000,
    });
  }, [value]);

  const text = useDerivedValue(() => {
    // return `${textValue.value.toFixed(0)}`;
    return 'Loading...'
  }, [textValue]);

  useEffect(() => {
    translateYPercent.value = withTiming(fillPercent, {
      duration: 1000,
    });
  }, [fillPercent]);

  useEffect(() => {
    translateXAnimated.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const clipPath = useDerivedValue(() => {
    const clipP = Skia.Path.MakeFromSVGString(clipSvgPath);
    const transformMatrix = Skia.Matrix();
    transformMatrix.translate(
      -waveLength * translateXAnimated.value,
      (1 - translateYPercent.value) * height - waveHeight,
    );
    clipP.transform(transformMatrix);
    return clipP;
  }, [translateXAnimated, translateYPercent]);

  return (
    <Canvas style={{width, height}}>
      <Rect x={0} y={0} width={width} height={height}  
      color="#fff"
      />
      <Text
        x={textTranslateX}
        y={fontSize}
        text={text}
        font={font}
        color="#6f1712"
        transform={textTransform}
      />
      <Group clip={clipPath}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          // color={"#e7223a"}
        />
        <LinearGradient
          start={vec(0, 0)}
          end={vec(256, 256)}
          colors={['#000', '#e7323a']}
          mode={'mirror'}
        />
        <Text
          x={textTranslateX}
          y={fontSize}
          text={text}
          font={font}
          color="#fff"
          transform={textTransform}
        />
      </Group>
    </Canvas>
  );
};




