import { View, Text } from 'react-native'
import React from 'react'
import { LiquidGaugeProgress } from './LiquidProgress_FullScreen'
import { CocaCola } from '../CocaCola'
import { windowHeight, windowWidth } from '../../utils/util'
import { LiquidGaugeProgressSquare } from './LiquidProgress_squareSize'

export default function WaveForm1() {
  return (
    <View style={{
       flex: 1, alignSelf: "center", justifyContent: "center" ,
    }}>
       <CocaCola size={windowWidth-60} value={50} />
    </View>
  )
}