import { area, scaleLinear } from 'd3';
import { useEffect } from 'react';
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
  Path,
  Rect,
  Skia,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import { windowHeight, windowWidth } from '../../utils/util';

export const LiquidGaugeProgressSquare = ({ size, value }) => {
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleSize = radius * 2 - fillCircleMargin * 2;

  const minValue = 0;
  const maxValue = 100;
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = size / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleSize * 0.1 * fillPercent;
  const fontSize = radius / 2;
  const font = useFont(require('../../Assets/fonts/Inter-Bold.ttf'), fontSize);
  const textWidth = font ? font.measureText(`${value}`).width : 0;
  const textTranslateX = radius - textWidth * 0.5;
  const textTransform = [{ translateY: size * 0.5 - fontSize * 0.7 }];
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
      return fillCircleSize + waveHeight;
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
    return `${textValue.value.toFixed(0)}`;
  }, [textValue]);

  useEffect(() => {
    translateYPercent.value = withTiming(fillPercent, {
      duration: 1000,
    });
  }, [fillPercent]);

  useEffect(() => {
    translateXAnimated.value = withRepeat(
      withTiming(1, {
        duration: 9000,
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
      (1 - translateYPercent.value) * fillCircleSize - waveHeight
    );
    clipP.transform(transformMatrix);
    return clipP;
  }, [translateXAnimated, translateYPercent]);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        color="lightblue"
      />
      <Text
        x={textTranslateX}
        y={fontSize}
        text={text}
        font={font}
        color="#045681"
        transform={textTransform}
      />
      <Group clip={clipPath}>
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          color="#178BCA"
        />
        <Text
          x={textTranslateX}
          y={fontSize}
          text={text}
          font={font}
          color="#A4DBf8"
          transform={textTransform}
        />
      </Group>
    </Canvas>
  );
};