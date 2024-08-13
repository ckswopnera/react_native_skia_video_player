import { View, Text } from 'react-native'
import React from 'react'
import { LiquidGaugeProgress } from './LiquidProgress_FullScreen'
import { CocaCola } from '../CocaCola'
import { windowHeight, windowWidth } from '../../utils/util'
import { LiquidGaugeProgressSquare } from './LiquidProgress_squareSize'

export default function WaveForm2() {
  return (
    <View style={{
       flex: 1, alignSelf: "center", justifyContent: "center" ,
    }}>

       <LiquidGaugeProgress height={windowHeight} width={windowWidth} value={45} />
    </View>
  )
}