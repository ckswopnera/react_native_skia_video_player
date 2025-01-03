import {Circle, useFont, Text as SkiaText} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {StackedBar, CartesianChart, useChartPressState} from 'victory-native';
import inter from '../../Assets/fonts/Inter-Bold.ttf';
import {appColors} from '../../Style/theme';
import {Button} from './Button';
import {InputSlider} from './InputSlider';
import {InfoCard} from './InfoCard';
import {useDerivedValue} from 'react-native-reanimated';
import {DATA} from '../../utils/util';

export default function StackedBarChartPage(props) {
  // const {state, isActive} = useChartPressState({x: 0, y: {highTmp: 0}});
  const {state, isActive} = useChartPressState({
    x: 0,
    y: {highTmp: 0,},
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

  function ToolTip({x, y, color, activeValue}) {
    const font = useFont(inter, 11);
    const activeValueDisplay = useDerivedValue(() =>
      activeValue?.value.toFixed(2),
    );
    const activeValueWidth = useDerivedValue(
      () => font?.measureText(activeValueDisplay.value).width || 0,
    );
    const activeValueX = useDerivedValue(
      () => x.value - activeValueWidth.value / 2,
    );
    const activeValueY = useDerivedValue(
      () => y.value - activeValueWidth.value,
    );
    const activeValueY1 = useDerivedValue(() => y.value - 3);
    return (
      <>
        <Circle cx={x} cy={activeValueY1} r={4} color={color} />
        <SkiaText
          x={activeValueX}
          y={activeValueY}
          text={activeValueDisplay}
          color={color}
          font={font}
        />
      </>
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
                    barOptions={({isBottom, isTop}) => {
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
                      };
                    }}
                  />

                  {isActive && (
                    <ToolTip
                      x={state.x?.position}
                      y={state.y.highTmp?.position}
                      color={appColors.infoCardActive.light}
                      activeValue={state.y.highTmp.value}
                    />
                  )}
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
