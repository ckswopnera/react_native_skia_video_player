import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

// Create an Animated version of the G component
const AnimatedG = Animated.createAnimatedComponent(G);

const sectors = [
  { color: '#E5243B', label: 'Carlos' },
  { color: '#DDA63A', label: 'Boru' },
  { color: '#C5192D', label: 'Rosicler' },
  { color: '#FF3A21', label: 'Moraima' },
  { color: '#FCC30B', label: 'Yamel' },
  { color: '#FD6925', label: 'Javier' },
  { color: '#DD1367', label: 'Alejandro' },
  { color: '#FD9D24', label: 'Lissette' },
  { color: '#BF8B2E', label: 'Ana M' },
  { color: '#3F7E44', label: 'Carla' },
  { color: '#0A97D9', label: 'Lubel' },
  { color: '#56C02B', label: 'Luis' },
  { color: '#00689D', label: 'Jonathan' },
  { color: '#19486A', label: 'Yuletza' },
  { color: '#E5243B', label: 'Claudia' },
  { color: '#DDA63A', label: 'Robert' },
];

export default function Wheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const rotation = useSharedValue(0); // Shared value for rotation
  const arc = (Math.PI * 2) / sectors.length; // Angle of each sector
  const radius = 150; // Wheel radius

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomSpin = Math.random() * 720 + 720; // Random spin between 720 and 1440 degrees
    rotation.value = withTiming(rotation.value + randomSpin, {
      duration: 3000,
      easing: Easing.out(Easing.cubic),
    }, (isFinished) => {
      if (isFinished) {
        runOnJS(determineResult)(rotation.value);
      }
    });
  };

  const determineResult = (angle) => {
    const normalizedAngle = angle % 360; // Normalize the angle to 0-360 degrees
    const sectorIndex = Math.floor((360 - normalizedAngle) / (360 / sectors.length)) % sectors.length;
    setSpinResult(sectors[sectorIndex].label);
    setIsSpinning(false);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Fixed SVG */}
      <Svg height="400" width="400" style={styles.svg}>
        <AnimatedG originX="200" originY="200" 
        // style={animatedStyle}
        >
          {sectors.map((sector, index) => {
            const startAngle = arc * index;
            const endAngle = startAngle + arc;

            const path = `M 200,200 L ${200 + radius * Math.cos(startAngle)},${200 + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 0 1 ${200 + radius * Math.cos(endAngle)},${200 + radius * Math.sin(endAngle)} Z`;

            return (
              <Path
                key={sector.label}
                d={path}
                fill={sector.color}
                strokeWidth={1}
                stroke="#fff"
              />
            );
          })}
        </AnimatedG>
        {sectors.map((sector, index) => {
          const angle = arc * index + arc / 2;
          return (
            <SvgText
              key={sector.label}
              x={200 + (radius / 1.5) * Math.cos(angle)}
              y={200 + (radius / 1.5) * Math.sin(angle)}
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {sector.label}
            </SvgText>
          );
        })}
      </Svg>

      <TouchableOpacity style={styles.button} onPress={startSpin}>
        <Text style={styles.buttonText}>{isSpinning ? 'Spinning' : 'SPIN'}</Text>
      </TouchableOpacity>

      {spinResult && (
        <Text style={styles.resultText}>
          {`Result: ${spinResult}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  button: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
