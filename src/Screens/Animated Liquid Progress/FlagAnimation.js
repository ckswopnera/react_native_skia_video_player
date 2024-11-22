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
  Image,
  Rect,
  Skia,
  Text,
  useFont,
  useImage,
} from '@shopify/react-native-skia';

export const FlagAnimation = ({size, values}) => {
  const image = useImage(require('../../Assets/images/ashokachakra.png'));
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleSize = radius * 2 - fillCircleMargin * 2;
  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = size / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleSize * 0.1;

  const fontSize = radius / 2;
  const font = useFont(require('../../Assets/fonts/Inter-Bold.ttf'), fontSize);
  const font2 = useFont(require('../../Assets/fonts/Inter-Bold.ttf'), 60);
  const textWidth = font ? font.measureText(`${values[0]}`).width : 0;
  const textTranslateX = radius - textWidth * 0.5;
  const textTransform = [{translateY: waveHeight * 0.5 - fontSize * 0.7}];

  const data = Array.from({length: 41 * waveClipCount}, (_, i) => [
    i / (40 * waveClipCount),
    i / 40,
  ]);

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x(d => waveScaleX(d[0]))
    .y0(d => waveScaleY(Math.sin(d[1] * 2 * Math.PI)))
    .y1(() => fillCircleSize + waveHeight);

  const clipSvgPath = clipArea(data);

  const createAnimationValues = value => {
    const fillPercent = Math.max(0, Math.min(100, value)) / 100;
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
      translateY.value = withTiming(fillPercent, {
        duration: 1000,
      });
    }, [fillPercent]);

    useEffect(() => {
      translateX.value = withRepeat(
        withTiming(1, {
          duration: 6000,
          easing: Easing.linear,
        }),
        -1,
      );
    }, []);

    const clipPath = useDerivedValue(() => {
      const clipP = Skia.Path.MakeFromSVGString(clipSvgPath);
      const transformMatrix = Skia.Matrix();
      transformMatrix.translate(
        -waveLength * translateX.value,
        (1 - translateY.value) * fillCircleSize - waveHeight,
      );
      clipP.transform(transformMatrix);
      return clipP;
    });

    return clipPath;
  };

  const clipPaths = values.map(createAnimationValues);

  return (
    <Canvas style={{width: size, height: size}}>
      <Rect x={0} y={0} width={size} height={size} color="#fff" />
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        color="#FF671F"
        clip={clipPaths[0]}
      />
      <Group clip={clipPaths[1]}>
        <Rect x={0} y={0} width={size} height={size} color="#fff" />
        <Image
          image={image}
          x={textTranslateX}
          y={fontSize}
          width={120}
          height={120}
          color="#fff"
        />
      </Group>
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        color="#046A38"
        clip={clipPaths[2]}
      />
      <Group clip={clipPaths[3]}>
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          color="#fff"
          // clip={clipPaths[3]}
        />

        <Text
          x={textTranslateX - 10}
          y={fontSize + 300}
          text={'INDIA'}
          font={font2}
          color={'#6f1712'}
          transform={textTransform}
        />
      </Group>
    </Canvas>
  );
};
