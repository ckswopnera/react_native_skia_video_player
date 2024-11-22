import {View, Text} from 'react-native';
import React from 'react';
import {LiquidGaugeProgress} from './LiquidProgress_FullScreen';
import {CocaCola} from './CocaCola';
import {windowHeight, windowWidth} from '../../utils/util';
import {FlagAnimation} from './FlagAnimation';

export default function FlagWave() {
  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor:'#fff'
      }}>
      <FlagAnimation size={windowWidth} values={[73,53,33,13]}/>

    </View>
  );
}
