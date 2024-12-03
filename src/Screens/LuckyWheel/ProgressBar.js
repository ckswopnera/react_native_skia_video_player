import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

  const ProgressBar = ({ totalStep, currentStep }) => {

  const renderSteps = () => {
    return Array.from({length: totalStep}, (_, index) => {
      const step = index + 1;

      return (
        <Animatable.View
          key={step}
          animation={step <= currentStep ? 'fadeIn' : undefined}
          duration={500}
          style={[
            styles.segment,
            {backgroundColor: step <= currentStep ? '#ffd843' : '#d8d8d8'},
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{...styles.label, marginHorizontal: 10, marginBottom: 4}}>
        No of spin
      </Text>
      <View style={styles.barContainer}>{renderSteps()}</View>

      <View style={styles.labelContainer}>
        {Array.from({length: totalStep}, (_, index) => {
          const isActive = index + 1 <= currentStep;
          return (
            <Text
              key={index}
              style={[
                styles.label,
                {color: isActive ? '#ffd843' : '#d8d8d8'},
              ]}
            >
              {index + 1}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    height: 5,
    backgroundColor: '#d8d8d8',
    marginTop: 5,
    borderRadius: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    height: '100%',
    marginHorizontal: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between', // Ensures labels align with segments
    marginTop: 5,
    marginHorizontal: 10,
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ProgressBar;
