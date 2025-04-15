import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
  update,
} from '@react-native-firebase/database';
import GuestLayout from '../layout/GuestLayout';
import Button from '../components/Button';
import styles from '../styles/Login.styles';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleSetCredentials = (text, key) => {
    if (key === 'showPassword') {
      setCredentials(prev => ({
        ...prev,
        [key]: !prev.showPassword,
      }));
    } else {
      setCredentials(prev => ({
        ...prev,
        [key]: text,
      }));
    }
  };

  console.log('credentials', credentials);

  return (
    <GuestLayout>
      <KeyboardAvoidingView style={styles.login}>
        <Text style={styles.loginHeaderText}>Login Now</Text>
        <View>
          <Text styles={styles.inputLabel}>Username</Text>
          <View style={styles.guestInput}>
            <TextInput
            style={{flex: 1}}
              value={credentials.username}
              placeholder='Input username'
              onChangeText={text => handleSetCredentials(text, 'username')}
            />
          </View>
        </View>
        <View>
          <Text styles={styles.inputLabel}>Password</Text>
          <View
            style={[
              styles.guestInput,
              !credentials.showPassword ? {paddingRight: 2} : null,
            ]}>
            <TextInput
              style={{flex: 1}}
              placeholder='Input password'
              value={credentials.password}
              secureTextEntry={credentials.showPassword}
              onChangeText={text => handleSetCredentials(text, 'password')}
            />
            <FAIcon
              onPress={() => handleSetCredentials('', 'showPassword')}
              size={25}
              color="#262626"
              name={credentials.showPassword ? 'eye-slash' : 'eye'}
            />
          </View>
        </View>
        <Button title="Login" />
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          Don't have an account?
        </Text>
        <Button title="Signup" />
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Login;
