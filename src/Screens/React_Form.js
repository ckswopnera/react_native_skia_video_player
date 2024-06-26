import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { windowWidth } from '../utils/util';

const React_Form = () => {
  return (
    <View style={styles.container}>
      <FormScreen />
    </View>
  );
};

const FormScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <View style={styles.formContainer}>
      <TextInputField
        name="name"
        control={control}
        placeholder="Name"
        errors={errors.name}
      />
      {errors.name && <Text style={styles.errorText}>This is required.</Text>}

      <TextInputField
        name="email"
        control={control}
        placeholder="Email"
        errors={errors.email}
      />
      {errors.email && <Text style={styles.errorText}>This is required.</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const TextInputField = ({ name, control, placeholder, errors }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={'#fff'}
          onBlur={() => {
            onBlur();
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          onChangeText={onChange}
          value={value}
          cursorColor={'#fff'}
          style={[
            styles.input,
            isFocused && styles.focusedInput,
            errors && styles.errorBorder,
          ]}
        />
      )}
      name={name}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems:'center',
    padding: 16,
    backgroundColor: '#000',
  },
  formContainer: {
    padding: 16,
    flex: 1,

  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 18,
    color: '#fff',
  },
  focusedInput: {
    borderColor: '#fff',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5946B2',
    padding: 14,
    borderRadius: 14,
    position:'absolute',
    alignSelf:'center',
    bottom:50,
    width:windowWidth/2
  },
});

export default React_Form;
