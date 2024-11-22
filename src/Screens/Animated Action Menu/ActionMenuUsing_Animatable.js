import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function ActionMenuUsingAnimatable() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: !selected?.color ? '#111' : selected?.color},
      ]}>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          fontWeight: 'bold',
          fontSize: 44,
        }}>
        {selected?.type}
      </Text>
      <Text style={{color: 'white', textAlign: 'center'}}>
        Click the button in the bottom right!
      </Text>

      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={[
          styles.button,
          {
            backgroundColor: expanded ? '#2F4EB2' : '#10243E',
            borderColor: '#2F4EB2',
          },
        ]}>
        <Animatable.Text
          style={{position: 'absolute'}}
          animation={expanded ? zoomIn : zoomOut}
          duration={150}>
          🎁
        </Animatable.Text>
      </Pressable>

      {expanded && (
        <View style={{position: 'absolute', bottom: 0, right: 0}}>
          {actions.map((action, i) => (
            <ActionButton
              key={i.toString()}
              action={action}
              index={i}
              setSelected={setSelected}
              selected={selected}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function ActionButton({action, index, setSelected, selected}) {
  const fadeIn = {
    0: {
      opacity: 0,
      scale: 0.5,
      transform: [{translateY: 0}],
    },
    1: {
      opacity: 1,
      scale: 1,
      transform: [{translateY: -65 * (index + 1)}],
    },
  };

  return (
    <Animatable.View
      animation={fadeIn}
      delay={index * 100}
      duration={300}
      style={styles.actionButtonContainer}>
      <TouchableOpacity
        onPress={() => {
          console.log(action.type);
          setSelected(action);
        }}
        style={[
          styles.button,
          {
            backgroundColor: action.color,
            shadowColor: action.color,
            borderColor: action.border,
          },
        ]}>
        <Animatable.Text
          animation={action?.type === selected?.type ? zoomIn : zoomOut}
          duration={150}
          style={{fontSize: 18}}>
          {action.emoji}
        </Animatable.Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
    padding: 8,
  },
  button: {
    borderRadius: 100,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
    borderWidth: 2,
  },
  actionButtonContainer: {
    position: 'absolute',
  },
});

const actions = [
  {
    type: 'Send',
    color: '#341A34',
    emoji: '👨🏻‍🚒',
    border: '#692D6F',
  },
  {
    type: 'Scan',
    color: '#16301D',
    emoji: '📸',
    border: '#2F6E3B',
  },
  {
    type: 'Activity',
    color: '#3B1813',
    emoji: '🌊',
    border: '#7F2315',
  },
];

const zoomIn = {
  0: {
    scale: 0.5,
  },
  1: {
    scale: 1.5,
  },
};

const zoomOut = {
  0: {
    scale: 1.5,
  },
  1: {
    scale: 1,
  },
};
