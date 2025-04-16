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

  const loginUser = () => {
    const db = getDatabase();
  
    // Query the database for the username
    const usersRef = query(ref(db, '/users'), orderByChild('username'), equalTo(credentials.username));
  
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userId = Object.keys(users)[0]; // Get the first matching user
        const user = users[userId];
  
        // Check if the password matches
        if (user.password === credentials.password) {
          console.log('Login successful:', user);
          Alert.alert('Success', 'Login successful!');
          // Perform further actions, e.g., navigate to another screen
        } else {
          console.log('Invalid password');
          Alert.alert('Error', 'Invalid password');
        }
      } else {
        console.log('User not found');
        Alert.alert('Error', 'User not found');
      }
    }, (error) => {
      console.error('Error querying database:', error);
      Alert.alert('Error', 'An error occurred while logging in');
    });
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
              placeholder="Enter your username"
              placeholderTextColor="#999999"
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
              placeholder="Enter your password"
              placeholderTextColor="#999999"
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
        <Button title="Login" onPress={loginUser}/>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          Don't have an account?
        </Text>
        <Button title="Signup" />
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Login;
