import React, {useEffect, useReducer, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import EvilIcons from 'react-native-vector-icons/FontAwesome';
import Icon, {Icons} from '../components/Icons';

import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../Style/theme';
import {AnimatedColorGradient} from './AnimatedColorGradient';
import {Canvas, Circle, LinearGradient, vec} from '@shopify/react-native-skia';
import ButtonSkia from '../components/ButtonSkia';

const {width} = Dimensions.get('window');

const FAB_SIZE = 54;
const circleScale = (width / FAB_SIZE).toFixed(1);
const circleSize = circleScale * FAB_SIZE;
const dist = circleSize / 2 - FAB_SIZE;
const middleDist = dist / 1.41;

const ActionButton = ({iconType, icon, style, onPress}) => {
  return (
    <Animated.View style={[styles.actionBtn, style]}>
      <TouchableHighlight
        underlayColor={Colors.lightRed}
        style={styles.actionBtn}
        onPress={onPress}>
        <Icon
          type={iconType}
          name={icon}
          size={icon === 'calendar' ? 22 : 26}
          color={Colors.white}
        />
      </TouchableHighlight>
    </Animated.View>
  );
};

const MainView = ({screen}) => {
  return (
    <View
      style={[
        styles.container,
        {
          zIndex: -1,
          backgroundColor:
            screen === 'calendar'
              ? 'grey'
              : screen === 'share'
              ? 'lightgreen'
              : screen === 'gear'
              ? 'lightyellow'
              : null,
        },
      ]}>
      <Text
        style={{
          color: '#fff',
        }}>
        {screen}
      </Text>
    </View>
  );
};
export default function Fab() {
  const [open, toggle] = useReducer(s => !s, false);
  const [view, setview] = useState('');

  const rotation = useDerivedValue(() => {
    return withTiming(open ? '0deg' : '135deg');
  }, [open]);

  const progress = useDerivedValue(() => {
    return open ? withSpring(1) : withSpring(0);
  });

  const translation = useDerivedValue(() => {
    return open ? withSpring(1, {stiffness: 80, damping: 8}) : withSpring(0);
  });

  const fabStyles = useAnimatedStyle(() => {
    const rotate = rotation.value;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.red, Colors.darkRed],
    );
    return {
      transform: [{rotate}],
      backgroundColor,
    };
  });

  const scalingStyles = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0, circleScale]);
    return {
      transform: [{scale}],
    };
  });

  const translationStyles = (x, y, value) =>
    useAnimatedStyle(() => {
      const translate = interpolate(translation.value, [0, 1], [0, -value], {
        extrapolateLeft: 'clamp',
      });
      const scale = interpolate(progress.value, [0, 1], [0, 1], {
        extrapolateLeft: 'clamp',
      });
      if (x && y) {
        return {
          transform: [
            {translateX: translate},
            {translateY: translate},
            {scale},
          ],
        };
      } else if (x) {
        return {
          transform: [{translateX: translate}, {scale}],
        };
      } else {
        return {
          transform: [{translateY: translate}, {scale}],
        };
      }
    });

  return (
    <View style={styles.container}>
      <View
        style={{
          zIndex: -1,
          flex: 1,
        }}>
        <AnimatedColorGradient />
      </View>
      {/* <MainView screen={view} /> */}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.expandingCircle, scalingStyles]} />
        <TouchableWithoutFeedback onPress={toggle}>
          <Animated.View style={[styles.fab, fabStyles]}>
            <Icons.FontAwesome
              name="close"
              color={Colors.white}
              size={34}
              style={{
                position: 'absolute',
                right: 13,
                top: 9,
              }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>

        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(false, true, dist)}
          icon="calendar"
          onPress={() => setview('calendar')}
        />
        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(true, true, middleDist)}
          icon="share-alt"
          onPress={() => setview('share')}
        />
        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(true, false, dist)}
          icon="gear"
          onPress={() => setview('gear')}
        />
      </View>
    </View>
  );
}

const CircleStyle = {
  width: FAB_SIZE,
  height: FAB_SIZE,
  borderRadius: FAB_SIZE / 2,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.accent,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    ...CircleStyle,
    backgroundColor: Colors.red,
    transform: [{rotate: '135deg'}],
  },
  expandingCircle: {
    ...CircleStyle,
    backgroundColor: Colors.red,
    position: 'absolute',
    zIndex: -1,
  },
  actionBtn: {
    ...CircleStyle,
    backgroundColor: Colors.darkRed,
    position: 'absolute',
    zIndex: -1,
  },
});
