import * as React from 'react';
import {
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {CandlestickChart, TCandle} from 'react-native-wagmi-charts';
import mockData from '../utils/candlestick-data.json';
import mockData2 from '../utils/candlestick-data2.json';
import {darkTheme, lightTheme} from '../Style/theme';

function invokeHaptic() {
  if (['ios', 'android'].includes(Platform.OS)) {
    console.log('test');
  }
}

export default function CandleStickChart() {
  const [data, setData] = React.useState([]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const formatDate = () => {
    const updatedData = mockData.map(item => ({
      ...item,
      timestamp: item.timestamp,
    }));

    console.log({updatedData});
    setData(updatedData);
  };

  const formatDate2 = () => {
    const updatedData2 = mockData2.map(item => ({
      ...item,
      timestamp: item.timestamp,
    }));

    console.log({updatedData2});
    setData(updatedData2);
  };

  React.useEffect(() => {
    console.log(new Date().toLocaleString());
    formatDate();
  }, []);

  return (
    <ScrollView>
      <CandlestickChart.Provider data={data}>
        <CandlestickChart>
          <CandlestickChart.Candles />
          <CandlestickChart.Crosshair onCurrentXChange={invokeHaptic}>
            <CandlestickChart.Tooltip />
          </CandlestickChart.Crosshair>
        </CandlestickChart>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            onPress={formatDate}
            style={[
              styles.button,
              {
                backgroundColor: theme.buttonColor,
              },
            ]}>
            <Text style={styles.buttonText}>Data 1</Text>
          </Pressable>
          <Pressable
            onPress={formatDate2}
            style={[
              styles.button,
              {
                backgroundColor: theme.buttonColor,
              },
            ]}>
            <Text style={styles.buttonText}>Data 2</Text>
          </Pressable>
        </View>
        <View>
          <Text
            style={{
              color: theme.textColor,
              fontWeight: '500',
              paddingVertical: 10,
              textDecorationLine: 'underline',
            }}>
            Today Price :
          </Text>

          <View style={styles.dataProfile}>
            <Text
              style={[
                styles.fontText,
                {
                  color: theme.textColor,
                },
              ]}>
              Current
            </Text>
            <CandlestickChart.PriceText
              style={{
                color: theme.textColor,
              }}
              format={d => {
                'worklet';
                return `₹${d.formatted} INR`;
              }}
            />
          </View>
          <View style={styles.dataProfile}>
            <Text
              style={[
                styles.fontText,
                {
                  color: theme.textColor,
                },
              ]}>
              Open
            </Text>
            <CandlestickChart.PriceText
              style={{
                color: theme.textColor,
              }}
              type="open"
              format={d => {
                'worklet';
                return `₹${d.formatted} INR`;
              }}
            />
          </View>

          <View style={styles.dataProfile}>
            <Text
              style={[
                styles.fontText,
                {
                  color: theme.textColor,
                },
              ]}>
              Close
            </Text>
            <CandlestickChart.PriceText
              style={{
                color: theme.textColor,
              }}
              type="close"
              format={d => {
                'worklet';
                return `₹${d.formatted} INR`;
              }}
            />
          </View>
        </View>
        <View>
          <View style={styles.dataProfile}>
            <Text
              style={[
                styles.fontText,
                {
                  color: theme.textColor,
                },
              ]}>
              Date Time:
            </Text>
            <CandlestickChart.DatetimeText
              style={{
                color: theme.textColor,
              }}
              variant="formatted"
              locale="en-IN"
              options={{
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }}
            />
            {/* <Text style={{color: theme.textColor}}>
              {new Date().toLocaleString()}
            </Text> */}
          </View>
        </View>
      </CandlestickChart.Provider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {paddingHorizontal: 40, borderRadius: 6, paddingVertical: 10},
  buttonText: {color: '#fff', padding: 2},
  dataProfile: {flexDirection: 'row', justifyContent: 'space-between'},
  fontText: {
    fontSize: 20,
  },
});
