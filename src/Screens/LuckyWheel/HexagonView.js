import React from 'react';
import {View, StyleSheet} from 'react-native';
import HexagonShape from '../../Assets/svg/HexagonShape'; // Imported as a React component

const HexagonView = ({height, width}) => {
  const CIRCLE_RADIUS = width - 10; // Example value
  const STROKE_WIDTH = 14; // Example value

  return (
    <View style={{...styles.container, width: width + 10, height: width + 10}}>
      <HexagonShape
        height={CIRCLE_RADIUS}
        width={CIRCLE_RADIUS + 20}
        fill={'blue'}
        stroke={'rgba(255, 223, 0,1)'}
        strokeWidth={STROKE_WIDTH}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          elevation: 14,
          //   bottom: 20,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',

    backgroundColor: 'transparent',
    // Android elevation
    // elevation: 4,
    // iOS shadow properties
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
});

export default HexagonView;
