import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {
  toast_action,
  toast_error,
  toast_loading,
  toast_success,
  toast_warning,
  toast_custom,
} from '../utils/util';

export default function ToastScreen() {
  const toastmap = [
    {
      title: 'Show Toast Loading',
      fun: toast_loading,
      bg: 'rgba(153,204,51,1)',
      name: 'loading',
    },
    {
      title: 'Show Toast Error',
      fun: toast_error,
      bg: 'rgba(255,51,51,1)',
      name: 'error',
    },
    {
      title: 'Show Toast Success',
      fun: toast_success,
      bg: 'rgba(75,181,67,1)',
      name: 'success',
    },
    {
      title: 'Show Toast Warning',
      fun: toast_warning,
      bg: 'rgba(255,204,0,1)',
      name: 'warning',
    },
    {
      title: 'Show Toast Action',
      fun: toast_action,
      bg: 'rgba(65,105,225,1)',
      name: 'action',
    },

    {
      title: 'Show Toast Custom',
      fun: toast_custom,
      bg: 'rgba(65,15,135,1)',
      name: 'custom',
    },
  ];

  const Button = ({e}) => {
    return (
      <TouchableOpacity
        style={[
          styles.buttonColor,
          {
            backgroundColor: e.bg || 'transparent',
          },
        ]}
        onPress={() =>
          e.name === 'error'
            ? e.fun('Error!', 'Something went wrong.')
            : e.name === 'custom'
            ? e.fun('Custom toast content', 'Everything worked as expected.')
            : e.fun()
        }>
        <Text style={styles.navigationTextColor}>{e.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={toastmap}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <Button e={item} />}
    />
  );
}

const styles = StyleSheet.create({
  navigationTextColor: {
    color: '#fff',
    transform: [{scale: 1.2}],
    textAlign: 'center',
  },
  buttonColor: {
    height: 50,
    width: '80%',
    padding: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
    // borderWidth: 1,
    // borderColor: 'black',
  },
});
