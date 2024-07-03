import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {windowWidth} from '../utils/util';
import * as Animatable from 'react-native-animatable';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(5, 'Name must be at least 5 characters'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    // .oneOf([yup.ref('password'), null], 'Passwords must match'),
    .test('passwords-match', 'Password must match', function (value) {
      return this.parent.password === value;
    }),
});

const React_Form = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <TextInputField
        name="name"
        control={control}
        placeholder="Name"
        errors={errors.name}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      <TextInputField
        name="email"
        control={control}
        placeholder="Email"
        errors={errors.email}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}
      <TextInputField
        name="password"
        control={control}
        placeholder="Password"
        errors={errors.password}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TextInputField
        name="confirmPassword"
        control={control}
        placeholder="Confirm Password"
        errors={errors.confirmPassword}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const TextInputField = ({name, control, placeholder, errors}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <Animatable.View delay={1000} animation={errors ? 'shake' : undefined}>
          <Text
            style={{
              color: '#fff',
              position: 'absolute',
              top: -9,
              left: 12,
              backgroundColor: '#000',
              zIndex: 9999,
              fontFamily: 'Inter-Bold',
            }}>
            {placeholder}
          </Text>
          <TextInput
            // placeholder={placeholder}
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
        </Animatable.View>
      )}
      name={name}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
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
    // position: 'absolute',
    alignSelf: 'center',
    // bottom: 50,
    width: windowWidth / 2 + 100,
    marginTop: 100,
  },
});

export default React_Form;
