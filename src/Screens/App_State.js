import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {darkTheme, lightTheme} from '../Style/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  interpolate,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

const App_State = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isFocusedLogin, setIsFocusedLogin] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const loginInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, {duration: 4000}), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const boxWidth = 150;
    const boxHeight = 50;
    const overlaySize = 6;

    const translateX = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, boxWidth - overlaySize, boxWidth - overlaySize-2, -4, -6],
    );

    const translateY = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, -2, boxHeight - overlaySize, boxHeight - overlaySize + 2, +5],
    );

    const rotationValue = interpolate(
      Math.floor(progress.value * 4) / 4,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 90, 180, 270, 360],
    );

    const rotation = `${rotationValue}deg`;

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['#fff', 'green', '#fff'],
    );

    return {
      transform: [{translateX}, {translateY}, {rotate: rotation}],
      backgroundColor,
    };
  });

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.backgroundColor,
      }}>
      <Text style={{color: theme.textColor}}>
        Current App State: {appState}
      </Text>

      <View style={{marginTop: 120}}>
        <Animatable.View
          animation={{
            0: {width: isFocusedLogin ? '50%' : '100%'},
            1: {width: isFocusedLogin ? '100%' : '50%'},
          }}
          duration={300}>
          <TextInput
            ref={loginInputRef}
            autoCapitalize="words"
            cursorColor={theme.textColor}
            style={{
              borderWidth: 1,
              borderColor: theme.textColor,
              borderRadius: 14,
              padding: 10,
              paddingLeft: 20,
              color: theme.textColor,
            }}
            onFocus={() => {
              setIsFocusedLogin(true);
              setIsFocusedPassword(false);
              passwordInputRef.current?.blur();
            }}
            onBlur={() => setIsFocusedLogin(false)}
            onChangeText={setLoginValue}
          />
        </Animatable.View>

        <Animatable.Text
          animation={{
            0: {
              top: loginValue.length === 0 ? (isFocusedLogin ? -10 : 0) : -10,
              opacity: loginValue.length === 0 ? (isFocusedLogin ? 1 : 0.7) : 1,
              backgroundColor: theme.textBackgroundColor,
              borderRadius: isFocusedLogin ? 14 : 0,
            },
            1: {
              top: loginValue.length === 0 ? (isFocusedLogin ? -10 : 14) : -10,
              opacity: loginValue.length === 0 ? (isFocusedLogin ? 1 : 0.7) : 1,
              backgroundColor: theme.textBackgroundColor,
              borderRadius: isFocusedLogin ? 14 : 0,
            },
          }}
          duration={300}
          onPress={() => {
            setIsFocusedLogin(true);
            loginInputRef.current?.focus();
            setIsFocusedPassword(false);
          }}
          style={{
            position: 'absolute',
            top: isFocusedLogin ? -10 : 14,
            left: 20,
            fontSize: 14,
            color: theme.textColor,
            paddingHorizontal: 8,
          }}>
          Login
        </Animatable.Text>
      </View>

      <View style={{marginVertical: 20}}>
        <Animatable.View
          animation={{
            0: {width: isFocusedPassword ? '50%' : '100%'},
            1: {width: isFocusedPassword ? '100%' : '50%'},
          }}
          duration={300}>
          <TextInput
            ref={passwordInputRef}
            cursorColor={theme.textColor}
            style={{
              borderWidth: 1,
              borderColor: theme.textColor,
              borderRadius: 14,
              padding: 10,
              paddingLeft: 20,
              color: theme.textColor,
            }}
            onFocus={() => {
              setIsFocusedPassword(true);
              setIsFocusedLogin(false);
              loginInputRef.current?.blur();
            }}
            onBlur={() => setIsFocusedPassword(false)}
            onChangeText={setPasswordValue}
          />
        </Animatable.View>
        <Animatable.Text
          animation={{
            0: {
              top:
                passwordValue.length === 0
                  ? isFocusedPassword
                    ? -10
                    : 0
                  : -10,
              opacity:
                passwordValue.length === 0 ? (isFocusedPassword ? 1 : 0.7) : 1,
              backgroundColor: theme.textBackgroundColor,
              borderRadius: isFocusedPassword ? 14 : 0,
            },
            1: {
              top:
                passwordValue.length === 0
                  ? isFocusedPassword
                    ? -10
                    : 14
                  : -10,
              opacity:
                passwordValue.length === 0 ? (isFocusedPassword ? 1 : 0.7) : 1,
              backgroundColor: theme.textBackgroundColor,
              borderRadius: isFocusedPassword ? 14 : 0,
            },
          }}
          duration={300}
          onPress={() => {
            setIsFocusedPassword(true);
            passwordInputRef.current?.focus();
            setIsFocusedLogin(false);
          }}
          style={{
            position: 'absolute',
            top: isFocusedPassword ? -10 : 14,
            left: 20,
            fontSize: 14,
            color: theme.textColor,
            paddingHorizontal: 8,
          }}>
          Password
        </Animatable.Text>
      </View>

      <View>
        <View style={styles.box} />
        <Animated.View style={[styles.overlay, animatedStyle]} />
      </View>

    </SafeAreaView>
  );
};

export default App_State;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    width: 150,
    height: 50,
    borderWidth: 2,
    borderColor: 'gray',
  },
  overlay: {
    position: 'absolute',
    width: 15,
    height: 3,
    borderRadius: 3,
    padding: 2,
  },
});
