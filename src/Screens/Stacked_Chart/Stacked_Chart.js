import {
  Circle,
  useFont,
  Text as SkiaText,
  Group,
  Rect,
  RoundedRect,
} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {StackedBar, CartesianChart, useChartPressState} from 'victory-native';
import inter from '../../Assets/fonts/Inter-Bold.ttf';
import {appColors, Colors} from '../../Style/theme';
import {Button} from './Button';
import {InputSlider} from './InputSlider';
import {InfoCard} from './InfoCard';
import {useDerivedValue} from 'react-native-reanimated';
import {DATA, windowWidth} from '../../utils/util';

export default function StackedBarChartPage(props) {
  const {state, isActive} = useChartPressState({
    x: 0,
    y: {highTmp: 0, topTmp: 0, lowTmp: 0},
  });
  const font = useFont(inter, 12);
  const [data, setData] = useState(DATA(4));
  const [innerPadding, setInnerPadding] = useState(0.66);
  const [roundedCorner, setRoundedCorner] = useState(5);

  let activeXItem = useDerivedValue(() => {
    return data.findIndex(value => value.month === state.x.value.value);
  }).value;
  if (activeXItem < 0) {
    activeXItem = 2;
  }
  const pressedXY = {x: state.matchedIndex.value, y: state.yIndex.value};

  function ToolTipSkia({values, x, y}) {
    // console.log(values,x);
    const fonts = useFont(inter, 14);

    const padding = 10;
    const lineHeight = 20;
    const boxWidth = windowWidth - 40;
    const boxHeight = 80;
    const activeValueY = useDerivedValue(() => y.value - 2 * 30);
    const activeValueX = useDerivedValue(() => x.value - 35);

    const activeValueX1 = useDerivedValue(() => x.value + 15);
    const activeValueX11 = useDerivedValue(() => x.value + 90);

    const activeValueDisplay = useDerivedValue(() =>
      values.highTmp?.value.toFixed(2),
    );
    const activeValueDisplay1 = useDerivedValue(() =>
      values.topTmp?.value.toFixed(2),
    );
    const activeValueDisplay2 = useDerivedValue(() =>
      values.lowTmp?.value.toFixed(2),
    );
    return (
      <Group>
        <RoundedRect
          x={35}
          y={10}
          width={boxWidth}
          height={40}
          color={Colors.primary2}
          r={10}
        />

        <SkiaText
          x={40}
          y={34}
          text={`HighTmp: `}
          color={appColors.text.dark}
          font={fonts}
        />
        <SkiaText
          x={110}
          y={34}
          text={activeValueDisplay}
          color={appColors.text.dark}
          font={fonts}
        />
        <SkiaText
          x={160}
          y={34}
          text={`TopTmp: `}
          color={appColors.text.dark}
          font={fonts}
        />
        <SkiaText
          x={230}
          y={34}
          text={activeValueDisplay1}
          color={appColors.text.dark}
          font={fonts}
        />
        <SkiaText
          x={280}
          y={34}
          text={`LowTmp: `}
          color={appColors.text.dark}
          font={fonts}
        />
        <SkiaText
          x={350}
          y={34}
          text={activeValueDisplay2}
          color={appColors.text.dark}
          font={fonts}
        />
      </Group>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            xKey="month"
            padding={5}
            yKeys={['highTmp', 'topTmp', 'lowTmp']}
            domainPadding={{left: 50, right: 50, top: 30}}
            domain={{y: [0, 250]}}
            axisOptions={{
              font,
              formatXLabel: value => {
                const date = new Date(2023, value - 1);
                return date.toLocaleString('default', {month: 'short'});
              },
              lineColor: '#d4d4d8',
              labelColor: appColors.text.light,
            }}
            data={data}
            chartPressState={state}>
            {({points, chartBounds}) => {
              return (
                <>
                  <StackedBar
                    animate={{type: 'spring'}}
                    innerPadding={innerPadding}
                    chartBounds={chartBounds}
                    points={[points.highTmp, points.topTmp, points.lowTmp]}
                    colors={['orange', 'gold', 'sienna']}
                    barOptions={({isBottom, isTop, columnIndex, rowIndex}) => {
                      const isSelected =
                        pressedXY.x === rowIndex 
                        // && pressedXY.y === columnIndex;
                      return {
                        roundedCorners: isTop
                          ? {
                              topLeft: roundedCorner,
                              topRight: roundedCorner,
                            }
                          : isBottom
                          ? {
                              bottomRight: roundedCorner,
                              bottomLeft: roundedCorner,
                            }
                          : undefined,
                        color: isSelected ? Colors.primary2 : undefined,
                      };
                    }}
                  />

                  {/* {isActive && ( */}
                  <>
                    {/* <Circle
                      cx={state.x?.position}
                      cy={state.y.highTmp?.position}
                      r={4}
                      color={'red'}
                    /> */}

                    <ToolTipSkia
                      x={state.x?.position}
                      y={state.y.highTmp?.position}
                      values={{
                        highTmp: state.y.highTmp?.value,
                        topTmp: state.y.topTmp?.value,
                        lowTmp: state.y.lowTmp?.value,
                      }}
                    />
                  </>
                  {/* )} */}
                </>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}>
          <InfoCard style={{marginBottom: 16}}>Stacked Chart</InfoCard>
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 10,
              marginBottom: 16,
            }}>
            <Button
              style={{flex: 1}}
              onPress={() => setData(data => DATA(data.length))}
              title="Shuffle Data"
            />
          </View>
          <InputSlider
            label="Number of bars"
            maxValue={20}
            minValue={3}
            step={1}
            value={data.length}
            onChange={val => setData(DATA(val))}
          />
          <InputSlider
            label="Inner Padding"
            maxValue={1}
            minValue={0}
            step={0.1}
            value={innerPadding}
            onChange={setInnerPadding}
          />
          <InputSlider
            label="Corner Radius"
            maxValue={16}
            minValue={0}
            step={1}
            value={roundedCorner}
            onChange={setRoundedCorner}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  chart: {
    flex: 1.5,
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
