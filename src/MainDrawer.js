import {View, Text, Button} from 'react-native';
import React from 'react';
import {windowHeight} from './utils/util';
const MainDrawer = () => {
  return (
    <View
      style={{
        backgroundColor: 'red',
        flexDirection: 'row',
        height: windowHeight - 100,
      }}>
      <View style={{backgroundColor: 'yellow', height: '100%', width: '30%'}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            flexDirection: 'column',
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'yellow',
            flexDirection: 'column',
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'green',
            flexDirection: 'column',
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            flexDirection: 'column',
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'yellow',
            flexDirection: 'column',
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'green',
            flexDirection: 'column',
          }}></View>
      </View>
         {/* <Button title='test' color={'green'} onPress={()=>console.log('test')
        }/> */}
      <View
        style={{backgroundColor: 'blue', height: '100%', width: '70%'}}>

               <Button title='test' color={'green'} onPress={()=>console.log('test')
        }/>
        </View>
     
    </View>
  );
};
export default MainDrawer;
