import React, {Component, useEffect} from 'react';
import {View, TouchableOpacity, Text, Platform, Alert} from 'react-native';
import {CardIOModule, CardIOUtilities} from 'react-native-awesome-card-io';
import {windowWidth} from '../utils/util';

export default function CardScan() {
  let config = {
    useCardIOLogo: false,
    hideCardIOLogo: true,
    guideColor: '#90EE90',
    // scanInstructions:'test',
    scanExpiry: true,
    requireExpiry:true,
    // suppressManualEntry:true,
    requireCardholderName: true,
    restrictPostalCodeToNumericOnly: true,
    usePaypalActionbarIcon: false,
    detectionMode:'CardIODetectionModeCardImageAndNumber',
  };
  const scanCard = async () => {
    try {
      const card = await CardIOModule.scanCard(config);
      console.log(card);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload();
    }
  }, []);
 
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        style={{
          backgroundColor: 'grey',
          padding: 14,
          width: windowWidth / 2,
          borderRadius: 12,
        }}
        onPress={scanCard}>
        <Text
          style={{
            textAlign: 'center',color:'#fff',
          }}>
          Scan card
        </Text>
      </TouchableOpacity>
    </View>
  );
}
