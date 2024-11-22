import React, {useEffect, useState} from 'react';
import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  Skia,
  vec,
  interpolateColors,
  Fill,
  Circle,
  Paint,
  Points,
  rotate,
} from '@shopify/react-native-skia';
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {area, scaleLinear} from 'd3';
import {windowHeight, windowWidth} from '../../utils/util';
import {View} from 'react-native';
import Svg, {
  Ellipse,
  Polygon,
  Circle as SvgCircle,
  Path as SvgPath,
} from 'react-native-svg';

const startColors = [
  'rgba(34, 193, 195, 0.4)',
  'rgba(34,193,195,0.4)',
  'rgba(63,94,251,1)',
  'rgba(253,29,29,0.4)',
  'rgba(0,0,0,0.7)',
];
const endColors = [
  'rgba(0,212,255,0.4)',
  'rgba(253,187,45,0.4)',
  'rgba(253,29,29,0.2)',
  'rgba(252,176,69,0.4)',
  'rgba(255,255,255,1)',
];

const startColorsSun = [
  'rgba(253,29,29,0.8)',
  'rgba(253,29,29,0.3)',
  'rgba(253,29,29,0.4)',
  'rgba(253,29,29,0.5)',
  'rgba(253,29,29,0.6)',
  'rgba(0,0,0,1)',
];
const endColorsSun = [
  'rgba(253,29,29,0.4)',
  'rgba(253,29,29,0.3)',
  'rgba(253,29,29,0.4)',
  'rgba(253,29,29,0.5)',
  'rgba(253,29,29,0.6)',
  'rgba(255,255,255,1)',
];

const svgBoat =
  'M2.06963,28.09026h34.42664l-5.59505,7.69515c-0.25913,0.35638-0.67315,0.56725-1.11377,0.56725H10.25818c-0.38568,0-0.7537-0.16177-1.01452-0.44593L2.06963,28.09026z M6.20083,26.7132 17.21735,12.254 17.21735,26.7132 Z M19.97149,30.50013h-1.37707V4.33588c0-0.38028,0.30825-0.68853,0.68853-0.68853l0,0c0.38027,0,0.68853,0.30826,0.68853,0.68853V30.50013z M35.02353,21.05173c-0.28753,2.06474-1.19119,4.00062-2.44405,5.66146H21.34855c1.79369-2.99784,2.87194-6.43792,3.04992-9.96848c0.21565-4.2026-0.84208-8.46087-2.97119-12.06458c3.22791,1.14555,6.34628,2.66011,8.90672,4.99644C33.46948,12.53169,35.60545,16.81433,35.02353,21.05173z';

const svgFish =
  'M19.6231,11.5618c0.6723-0.2425,1.3358-0.6088,1.8866-1.1596c1.8817-1.8817,1.6054-5.1067,1.5927-5.2431l-0.0385-0.4131 l-0.413-0.0385c-0.0089-0.0008-0.2206-0.0202-0.5576-0.0202c-1.1477,0-3.2824,0.2096-4.6857,1.6128c-0.8031,0.8031-1.2123,1.8506-1.4175,2.7985 c-1.1702-0.9376-2.7239-1.9427-4.508-2.5028c0.0753-0.7972,0.0255-1.3805,0.0202-1.4367l-0.0385-0.4131l-0.413-0.0385 c-0.0089-0.0008-0.2206-0.0202-0.5576-0.0202c-1.1477,0-3.2824,0.2096-4.6856,1.6128c-0.1757,0.1757-0.3325,0.3631-0.4725,0.5586 c-1.6126,2.0864-3.1017,5.5437-4.0981,7.1641L0.1,11.6083l0.1615,0.2622c0.1306,0.212,3.2592,5.1927,8.5488,5.1927 c2.9504,0,5.5533-1.5582,7.2972-2.9591c0.2107,0.9267,0.6192,1.9385,1.4,2.7194c1.4032,1.4032,3.538,1.6127,4.6857,1.6128 c0.337,0,0.5487-0.0194,0.5576-0.0202l0.413-0.0385l0.0385-0.4131c0.0127-0.1363,0.2891-3.3613-1.5927-5.2431 C20.9589,12.1706,20.2954,11.8043,19.6231,11.5618z M4.806,11.4482c-0.4933,0-0.8932-0.3999-0.8932-0.8932s0.3999-0.8932,0.8932-0.8932 s0.8932,0.3999,0.8932,0.8932S5.2993,11.4482,4.806,11.4482z';

const pathData1 =
  'M103.814,157.183c-29.427,0-53.368-23.941-53.368-53.368s23.941-53.368,53.368-53.368s53.368,23.941,53.368,53.368 S133.241,157.183,103.814,157.183z M103.814,65.446c-21.156,0-38.368,17.212-38.368,38.368s17.212,38.368,38.368,38.368 s38.368-17.212,38.368-38.368S124.97,65.446,103.814,65.446z';

const pathData2 =
  'M103.814,39.385c-4.142,0-7.5-3.358-7.5-7.5V7.5c0-4.142,3.358-7.5,7.5-7.5s7.5,3.358,7.5,7.5v24.385 C111.314,36.027,107.956,39.385,103.814,39.385z';

const pathData3 =
  'M103.814,207.628c-4.142,0-7.5-3.358-7.5-7.5v-24.385c0-4.142,3.358-7.5,7.5-7.5s7.5,3.358,7.5,7.5v24.385 C111.314,204.271,107.956,207.628,103.814,207.628z';

const pathData4 =
  'M200.128,111.314h-24.385c-4.142,0-7.5-3.358-7.5-7.5s3.358-7.5,7.5-7.5h24.385c4.142,0,7.5,3.358,7.5,7.5 S204.271,111.314,200.128,111.314z';

const pathData5 =
  'M31.885,111.314H7.5c-4.142,0-7.5-3.358-7.5-7.5s3.358-7.5,7.5-7.5h24.385c4.142,0,7.5,3.358,7.5,7.5 S36.027,111.314,31.885,111.314z';

const pathData6 =
  'M154.676,60.452c-1.919,0-3.839-0.732-5.303-2.197c-2.929-2.929-2.929-7.678,0-10.606l17.243-17.242 c2.929-2.929,7.678-2.93,10.606,0c2.929,2.929,2.929,7.678,0,10.606l-17.243,17.242C158.515,59.72,156.595,60.452,154.676,60.452z';

const pathData7 =
  'M35.709,179.419c-1.919,0-3.839-0.732-5.303-2.197c-2.929-2.929-2.929-7.678,0-10.606l17.243-17.243 c2.929-2.929,7.678-2.929,10.606,0c2.929,2.929,2.929,7.678,0,10.606l-17.243,17.243C39.548,178.687,37.629,179.419,35.709,179.419z';

const pathData8 =
  'M171.918,179.419c-1.919,0-3.839-0.732-5.303-2.197l-17.243-17.243c-2.929-2.929-2.929-7.678,0-10.606 c2.929-2.929,7.678-2.929,10.606,0l17.243,17.243c2.929,2.929,2.929,7.678,0,10.606 C175.757,178.687,173.838,179.419,171.918,179.419z';

const pathData9 =
  'M52.952,60.452c-1.919,0-3.839-0.732-5.303-2.197L30.406,41.013c-2.929-2.929-2.929-7.677,0-10.606 c2.929-2.929,7.678-2.93,10.606,0l17.243,17.242c2.929,2.929,2.929,7.677,0,10.606C56.791,59.72,54.872,60.452,52.952,60.452z';

export default function SeaWave() {
  return (
    <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
      <LiquidGaugeProgress
        height={windowHeight}
        width={windowWidth}
        value={35}
      />
    </View>
  );
}

const LiquidGaugeProgress = ({height, width, value}) => {
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
  const textTranslateX = windowWidth / 4;
  const textTransform = [{translateY: height * 0.5 - fontSize * 0.7}];

  const data = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x(d => waveScaleX(d[0]))
    .y0(d => waveScaleY(Math.sin(d[1] * 2 * Math.PI)))
    .y1(() => height);

  const clipSvgPath = clipArea(data);

  const translateXAnimated = useSharedValue(0);
  const translateXFAnimated = useSharedValue(0);
  const translateXBAnimated = useSharedValue(0);

  const translateYPercent = useSharedValue(0);
  const textValue = useSharedValue(0);
  const colorAnimation = useSharedValue(0);

  const [gradientColors, setGradientColors] = useState([
    startColors[0],
    endColors[0],
  ]);

  const [gradientColorsSun, setGradientColorsSun] = useState([
    startColorsSun[0],
    endColorsSun[0],
  ]);

  useEffect(() => {
    textValue.value = withTiming(value, {
      duration: 1000,
    });
  }, [value]);

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

  useEffect(() => {
    translateXBAnimated.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  useEffect(() => {
    translateXFAnimated.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  useEffect(() => {
    colorAnimation.value = withRepeat(
      withTiming(1, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );

    const updateColors = () => {
      const progress = colorAnimation.value;
      const interpolatedStartColors = interpolateColors(
        progress,
        [0, 0.25, 0.5, 0.75, 1],
        startColors,
      );
      const interpolatedEndColors = interpolateColors(
        progress,
        [0, 0.25, 0.5, 0.75, 1],
        endColors,
      );
      setGradientColors([interpolatedStartColors, interpolatedEndColors]);
    };

    const intervalId = setInterval(updateColors, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [colorAnimation]);

  useEffect(() => {
    colorAnimation.value = withRepeat(
      withTiming(1, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );

    const updateColorsSun = () => {
      const progress = colorAnimation.value;
      const interpolatedStartColors = interpolateColors(
        progress,
        [0, 0.25, 0.5, 0.75, 1],
        startColorsSun,
      );
      const interpolatedEndColors = interpolateColors(
        progress,
        [0, 0.25, 0.5, 0.75, 1],
        endColorsSun,
      );
      setGradientColorsSun([interpolatedStartColors, interpolatedEndColors]);
    };

    const intervalId = setInterval(updateColorsSun, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [colorAnimation]);

  const text = useDerivedValue(() => {
    return `${textValue.value.toFixed(0)}`;
  }, [textValue]);

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

  const floatingPath = useDerivedValue(() => {
    const path = Skia.Path.MakeFromSVGString(svgBoat);
    const transformMatrix = Skia.Matrix();

    transformMatrix.translate(
      -waveLength * translateXBAnimated.value + width,
      //   height-300,
      (1 - translateYPercent.value) * height - waveHeight + 100,
    );
    transformMatrix.scale(1.5);
    path.transform(transformMatrix);
    return path;
  }, [translateXBAnimated, translateYPercent]);

  const path = Skia.Path.Make();
  path.moveTo(32, 0);
  path.lineTo(40, 16);
  path.lineTo(53, 17);
  path.lineTo(42, 30);
  path.lineTo(48, 48);
  path.lineTo(32, 38);
  path.lineTo(16, 48);
  path.lineTo(22, 30);
  path.lineTo(12, 16);
  path.lineTo(28, 16);
  path.close();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [opacity]);

  const translateXX = useSharedValue(0);

  const translateYY = useSharedValue(0);

  useEffect(() => {
    translateXX.value = withRepeat(
      withTiming(1, {
        duration: 16000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  useEffect(() => {
    translateYY.value = withRepeat(
      withTiming(fillPercent, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const previousTranslateYY = useSharedValue(translateYY.value);

  const movingFish = useDerivedValue(() => {
    const path = Skia.Path.MakeFromSVGString(svgFish);
    const transformMatrix = Skia.Matrix();
    const startY = height / 2;
    const endY = height - translateYY.value;

    const isMovingUp = translateYY.value > previousTranslateYY.value;

    if (translateYY.value === 0 || translateYY.value === 1) {
      previousTranslateYY.value = translateYY.value;
    } else {
      previousTranslateYY.value = translateYY.value;
    }

    transformMatrix.translate(
      -waveLength * translateXX.value + width,
      startY - translateYY.value * (startY - endY),
    );
    transformMatrix.rotate(isMovingUp ? 55 : -55);
    // transformMatrix.scale(1, -1);

    path.transform(transformMatrix);
    return path;
  }, [translateYY]);

  return (
    <>
      <Svg>
        <Canvas style={{width, height}}>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            color={gradientColors[0]}
          />

          <Group clip={clipPath}>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              //   color={'rgba(0, 0, 255,0.8)'}
            />
            <LinearGradient
              start={vec(0, 0)}
              end={vec(windowWidth, windowHeight)}
              colors={['rgba(0, 1100, 255,1)', 'rgba(0, 0, 255,0.6)']}
            />

          </Group>

          <Group transform={[{translateY: 10}]}>
            <Path
              path={path}
              color="rgba(0,0,255,1)"
              style="fill"
              opacity={0.5}
            />
            <Path
              path={path}
              color="blue"
              style="stroke"
              strokeWidth={2}
              opacity={opacity}
            />
          </Group>

          <Path path={floatingPath} color="rgba(255, 255, 255, 1)" />
          <Group>
            <Path
              path={movingFish}
              // color="rgba(0,0,255,0.8)"
            />

            <LinearGradient
              start={vec(0, 0)}
              end={vec(windowWidth, windowHeight)}
              colors={['rgba(0, 1100, 255,0.8)', 'rgba(0, 0, 255,0.6)']}
            />
          </Group>
          <Group
            transform={[
              {translateY: 10},
              {translateX: windowWidth / 2 + 30},
              {scale: 0.8},
            ]}>
            <Path path={pathData1} color={'red'} />
            <Path
              path={pathData2}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData3}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData4}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData5}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData6}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData7}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData8}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Path
              path={pathData9}
              opacity={opacity}
              color={gradientColorsSun[0]}
            />
            <Circle cx={104} cy={104} r={52} color={'red'} />
          </Group>

        </Canvas>
      </Svg>
    </>
  );
};
