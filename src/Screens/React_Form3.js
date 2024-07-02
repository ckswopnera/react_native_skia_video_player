import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {windowWidth} from '../utils/util';
import * as Animatable from 'react-native-animatable';

const schema = yup.object().shape({
  name: yup
    .string()
    .test(
      'is-valid-name',
      'Name must be at least 5 characters if provided',
      function (value) {
        if (!value || value.length === 0) {
          return true;
        } else {
          return value.length >= 5;
        }
      },
    ),
  password: yup
    .string()
    .test(
      'is-valid-password',
      'Password must be at least 5 characters if provided',
      function (value, {parent}) {
        const {name, newPassword, email} = parent || {};

        if (
          (!name || name.length === 0) &&
          (!newPassword || newPassword.length === 0) &&
          (!email || email.length === 0) &&
          value &&
          value.length > 0
        ) {
          return this.createError({
            message: 'Password cannot be provided if there are no updates',
            path: this.path,
          });
        } else if (
          (name && name.length > 0) ||
          (newPassword && newPassword.length > 0) ||
          (email && email.length > 0)
        ) {
          if (!value || value.length === 0) {
            return this.createError({
              message: 'Password is mandatory if any update is given',
              path: this.path,
            });
          }

          if (value.length < 5) {
            return this.createError({
              message: 'Password must be at least 5 characters',
              path: this.path,
            });
          }

          if (value !== '00000') {
            return this.createError({
              message: 'Not matched. Please try again!',
              path: this.path,
            });
          }
        }

        return true;
      },
    ),

  newPassword: yup
    .string()
    .test(
      'is-valid-new-password',
      'New password must be at least 5 characters and must not match old password',
      function (value) {
        const {password} = this.parent || {};

        if (!value || value.length === 0) {
          return true;
        } else if (value.length < 5) {
          return this.createError({
            message: 'New password must be at least 5 characters',
            path: this.path,
          });
        } else if (password === value) {
          return this.createError({
            message: 'New password must not match old password',
            path: this.path,
          });
        }

        return true;
      },
    ),
  confirmNewPassword: yup
    .string()
    .test(
      'is-valid-new-password',
      'Passwords must match',
      function (value, {parent}) {
        const {newPassword} = parent || {};

        if (newPassword && newPassword.length > 0) {
          if (!value || value.length === 0) {
            return this.createError({
              message: 'Confirm Password is required',
              path: this.path,
            });
          }

          if (newPassword !== value) {
            return this.createError({
              message: 'Passwords do not match!',
              path: this.path,
            });
          }
        } else if (value && value.length > 0) {
          return this.createError({
            message: 'New Password is required!',
            path: this.path,
          });
        }

        return true;
      },
    ),

  email: yup
    .string()
    //   .required('Email is required')
    .email('Invalid email'),
});
const React_Form3 = () => {
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
      confirmNewPassword: '',
    },
  });

  const onSubmit = data => {
    const isFormEmpty = Object.values(data).every(value => !value);

    if (isFormEmpty) {
      Alert.alert('Form is empty!');
      return;
    }

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
        name="newPassword"
        control={control}
        placeholder="New Password"
        errors={errors.newPassword}
      />
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword.message}</Text>
      )}
      <TextInputField
        name="confirmNewPassword"
        control={control}
        placeholder="Confirm New Password"
        errors={errors.confirmNewPassword}
      />
      {errors.confirmNewPassword && (
        <Text style={styles.errorText}>
          {errors.confirmNewPassword.message}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Update</Text>
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
        <Animatable.View
          delay={1000}
          animation={errors ? 'shake' : undefined}
          style={
            {
              // paddingBottom:20
            }
          }>
          <Text
            style={{
              color: '#fff',
              position: 'absolute',
              top: -9,
              left: 10,
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
    borderRadius: 10,
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
    backgroundColor: '#666',
    padding: 14,
    borderRadius: 14,
    // position: 'absolute',
    alignSelf: 'center',
    // bottom: 50,
    width: windowWidth / 2 + 100,
    marginTop: 100,
  },
});

export default React_Form3;
