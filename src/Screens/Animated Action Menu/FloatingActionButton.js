import React, {useReducer, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon, {Icons} from '../../components/Icons';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../../Style/theme';
import {AnimatedColorGradient} from '../AnimatedColorGradient';

const {width} = Dimensions.get('window');

const FAB_SIZE = 54;
const circleScale = (width / FAB_SIZE).toFixed(1);
const circleSize = circleScale * FAB_SIZE;
const dist = circleSize / 2 - FAB_SIZE;
const middleDist = dist / 1.41;
const BUTTON_SPACING = 70;

const ActionButton = ({iconType, icon, style, onPress, title}) => {
  return (
    <Animated.View style={[styles.actionBtn, style]}>
      <TouchableHighlight
        underlayColor={Colors.lightRed}
        style={styles.actionBtn}
        onPress={onPress}>
        <>
          <Icon
            type={iconType}
            name={icon}
            size={icon === 'calendar' ? 22 : 26}
            color={Colors.white}
          />
        </>
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
      <Text style={styles.mainViewText}>{screen}</Text>
    </View>
  );
};

export default function Fab() {
  const [open, toggle] = useReducer(s => !s, false);
  const [open2, toggle2] = useReducer(s => !s, false);
  const [theme, setTheme] = useState(null);

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

  const rotation2 = useDerivedValue(() => {
    return withTiming(open2 ? '0deg' : '135deg');
  }, [open2]);

  const progress2 = useDerivedValue(() => {
    return open2 ? withSpring(1) : withSpring(0);
  });

  const translation2 = useDerivedValue(() => {
    return open2 ? withSpring(1, {stiffness: 80, damping: 8}) : withSpring(0);
  });

  const fabStyles2 = useAnimatedStyle(() => {
    const rotate = rotation2.value;
    const backgroundColor = interpolateColor(
      progress2.value,
      [0, 1],
      [Colors.red, Colors.darkRed],
    );
    return {
      transform: [{rotate}],
      backgroundColor,
    };
  });

  const translationStyles2 = index =>
    useAnimatedStyle(() => {
      const dist2 = (index + 1) * BUTTON_SPACING;
      const translateY = interpolate(translation2.value, [0, 1], [0, -dist2], {
        extrapolateLeft: 'clamp',
      });
      const scale = interpolate(progress2.value, [0, 1], [0, 1], {
        extrapolateLeft: 'clamp',
      });
      return {
        transform: [{translateY}, {scale}],
      };
    });

  return (
    <View style={styles.container}>
      {theme === null ? (
        <View style={styles.gradientContainer}>
          <AnimatedColorGradient />
        </View>
      ) : (
        <MainView screen={theme} />
      )}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.expandingCircle, scalingStyles]} />
        <TouchableWithoutFeedback
          onPress={() => {
            toggle();
            setTheme(null);
          }}>
          <Animated.View style={[styles.fab, fabStyles]}>
            <Icons.FontAwesome
              name="close"
              color={Colors.white}
              size={34}
              style={styles.icon}
            />
          </Animated.View>
        </TouchableWithoutFeedback>

        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(false, true, dist)}
          icon="calendar"
          onPress={() => setTheme('calendar')}
        />
        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(true, true, middleDist)}
          icon="share-alt"
          onPress={() => setTheme('share')}
        />
        <ActionButton
          iconType={Icons.FontAwesome}
          style={translationStyles(true, false, dist)}
          icon="gear"
          onPress={() => setTheme('gear')}
        />
      </View>

      <View style={styles.fabContainer2}>
        <TouchableWithoutFeedback
          onPress={() => {
            toggle2();
            setTheme(null);
          }}>
          <Animated.View style={[styles.fab, fabStyles2]}>
            <Icons.FontAwesome
              name="close"
              color={Colors.white}
              size={34}
              style={styles.icon}
            />
          </Animated.View>
        </TouchableWithoutFeedback>

        {['calendar', 'share-alt', 'gear'].map((icon, index) => (
          <ActionButton
            key={icon}
            iconType={Icons.FontAwesome}
            style={translationStyles2(index)}
            icon={icon}
            onPress={() => setTheme(icon)}
            title={icon.charAt(0).toUpperCase() + icon.slice(1)}
          />
        ))}
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
  gradientContainer: {
    zIndex: -1,
    flex: 1,
  },
  mainViewText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fabContainer2: {
    position: 'absolute',
    bottom: 20,
    left: 20,
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
    flexDirection: 'row',
  },
  icon: {
    position: 'absolute',
    right: 13,
    top: 9,
  },
});
