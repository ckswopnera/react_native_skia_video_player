import { View, Text } from 'react-native'
import React from 'react'
import { Snowfall } from 'react-native-snowfall';
import { Colors } from '../Style/theme';
import Santa from '../components/Santa';
export default function SnowFall() {
  return (
    <View style={{flex:1,backgroundColor:Colors.black}}>
     <Snowfall
        count={100}
        duration={15000}
        minSize={5}
        maxSize={25}
        imageScale={0.5}
        imagePath={require('../Assets/images/snowflake.png')}
      />
      {/* <Text style={{
        color:'#fff'
      }}>Test</Text> */}
      <Santa/>
    </View>
  )
}