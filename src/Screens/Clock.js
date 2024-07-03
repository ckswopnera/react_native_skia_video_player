import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import AnalogClock from '../components/AnalogClock';
import SkiaEx from '../skia/SkiaEx';
import {scale, ScaledSheet} from 'react-native-size-matters';
import ClockIcon from '../components/ClockIcon';
import {darkTheme, lightTheme} from '../Style/theme';

const Clock = () => {
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [clockView, setclockView] = useState(false);
  const [videoView, setVideoView] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const startTimer = () => {
    clearInterval(intervalId);
    const id = setInterval(() => {
      setSecondsPassed(prevSeconds => prevSeconds + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setSecondsPassed(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };
  const {hours, minutes, seconds} = formatTime(secondsPassed);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
        <LinearGradient
          colors={theme.clockBackgroundColor}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // width: windowWidth,
              width: scale(90),
              position: 'absolute',
              top: 20,
            }}>
            <Animatable.Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              key={`hours-${secondsPassed}`}
              animation={parseInt(hours) > 0 ? 'pulse' : undefined}
              duration={1000}
              style={[styles.text, {color: theme.clockTextColor}]}>
              {hours}
            </Animatable.Text>
            <Text
              style={[
                styles.text,
                {fontSize: 100, color: theme.clockTextColor},
              ]}>
              :
            </Text>
            <Animatable.Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              key={`minutes-${secondsPassed}`}
              animation={
                parseInt(hours) > 0 || parseInt(minutes) > 0
                  ? 'pulse'
                  : undefined
              }
              duration={1000}
              style={[styles.text, {color: theme.clockTextColor}]}>
              {minutes}
            </Animatable.Text>
            <Text
              style={[
                styles.text,
                {fontSize: 100, color: theme.clockTextColor},
              ]}>
              :
            </Text>
            <Animatable.Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              key={`seconds-${secondsPassed}`}
              animation="pulse"
              duration={1000}
              style={[styles.text, {color: theme.clockTextColor}]}>
              {seconds}
            </Animatable.Text>
          </View>

          {clockView === true ? (
            <AnalogClock
              fill={theme.clockFillColor}
              stroke={theme.clockTextColor}
            />
          ) : (
            <SkiaEx height={200} width={200} />
          )}
          <TouchableOpacity
            style={{position: 'absolute', left: 1, bottom: 0}}
            onPress={() => {
              clockView === false ? setclockView(true) : setclockView(false);
            }}>
            <ClockIcon width={150} height={150} fill={theme.clockFillColor} />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'space-evenly',
              alignItems: 'center',
              position: 'absolute',
              bottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
              }}>
              <TouchableOpacity style={styles.button} onPress={startTimer}>
                <Text
                  style={[styles.buttonText, {color: theme.clockTextColor}]}>
                  Start
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: theme.clockButtonColor},
                ]}
                onPress={stopTimer}>
                <Text
                  style={[styles.buttonText, {color: theme.clockTextColor}]}>
                  Stop
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, {marginTop: 1}]}
              onPress={resetTimer}>
              <Text style={[styles.buttonText, {color: theme.clockTextColor}]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = ScaledSheet.create({
  text: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 100,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 150,
    width: `100@s`,
    height: `100@s`,
    margin: 4,
    justifyContent: 'center',
    elevation: 6,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Clock;
