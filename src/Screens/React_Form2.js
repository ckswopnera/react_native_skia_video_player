import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {windowWidth} from '../utils/util';
import * as Animatable from 'react-native-animatable';
import {darkTheme, lightTheme} from '../Style/theme';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(5, 'Name must be at least 5 characters'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(3, 'Password must be at least 3 characters')
    .test(
      'is-00000',
      'Not matched. Please try again!',
      value => value === '00000',
    ),
  newPassword: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters')
    .test(
      'passwords-match',
      'Password must not match with old password',
      function (value) {
        return this.parent.password !== value;
      },
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    // .oneOf([yup.ref('password'), null], 'Passwords must match'),
    .test('passwords-match', 'Password must match', function (value) {
      return this.parent.newPassword === value;
    }),
});

const React_Form2 = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
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
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <TextInputField
        name="name"
        control={control}
        placeholder="Name"
        errors={errors.name}
        theme={theme}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      <TextInputField
        name="email"
        control={control}
        placeholder="Email"
        errors={errors.email}
        theme={theme}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}
      <TextInputField
        name="password"
        control={control}
        placeholder="Password"
        errors={errors.password}
        theme={theme}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      <TextInputField
        name="newPassword"
        control={control}
        placeholder="New Password"
        errors={errors.newPassword}
        theme={theme}
      />
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword.message}</Text>
      )}
      <TextInputField
        name="confirmPassword"
        control={control}
        placeholder="Confirm Password"
        errors={errors.confirmPassword}
        theme={theme}
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

const TextInputField = ({name, control, placeholder, errors, theme}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <Animatable.View delay={1000} animation={errors ? 'shake' : undefined}>
          <Text
            style={[
              styles.placeholder,
              {
                color: theme.textColor,
                backgroundColor: theme.textBackgroundCOlor,
              },
            ]}>
            {placeholder}
          </Text>
          <TextInput
            // placeholder={placeholder}
            placeholderTextColor={theme.textColor}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            onChangeText={onChange}
            value={value}
            cursorColor={theme.textColor}
            style={[
              styles.input,
              // isFocused && styles.focusedInput,

              isFocused && {borderColor: theme.textColor},

              errors && styles.errorBorder,
              {
                color: theme.textColor,
              },
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
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  focusedInput: {
    borderColor: '#fff',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 18,
    bottom: 12,
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
  placeholder:{
    position: 'absolute',
    top: -9,
    left: 10,
    zIndex: 9999,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 4,
  }
});

export default React_Form2;
