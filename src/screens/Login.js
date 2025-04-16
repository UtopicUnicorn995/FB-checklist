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
import { getAuth } from '@react-native-firebase/auth';
import GuestLayout from '../layout/GuestLayout';
import Button from '../components/Button';
import styles from '../styles/Login.styles';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {storeUser} from '../config/asyncStorage';

const Login = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  console.log('you sir', user)

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
    getAuth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(userCredential => {
        console.log('User logged in', userCredential);
      });

    // const db = getDatabase();

    // const usersRef = query(
    //   ref(db, '/users'),
    //   orderByChild('username'),
    //   equalTo(credentials.username),
    // );

    // onValue(
    //   usersRef,
    //   snapshot => {
    //     if (snapshot.exists()) {
    //       const users = snapshot.val();
    //       const userId = Object.keys(users)[0];
    //       const user = users[userId];

    //       if (user.password === credentials.password) {
    //         const {password, ...userWithoutPassword} = user;

    //         Alert.alert('Success', 'Login successful!', [
    //           {
    //             text: 'Okay',
    //             onPress: () => storeUser({userId, ...userWithoutPassword}),
    //           },
    //         ]);
    //       } else {
    //         console.log('Invalid password');
    //         Alert.alert('Error', 'Invalid password');
    //       }
    //     } else {
    //       console.log('User not found');
    //       Alert.alert('Error', 'User not found');
    //     }
    //   },
    //   error => {
    //     console.error('Error querying database:', error);
    //     Alert.alert('Error', 'An error occurred while logging in');
    //   },
    // );
  };

  console.log('credentials', credentials);

  return (
    <GuestLayout>
      <KeyboardAvoidingView style={styles.login}>
        <Text style={styles.loginHeaderText}>Login Now</Text>
        <View>
          <Text styles={styles.inputLabel}>Email</Text>
          <View style={styles.guestInput}>
            <TextInput
              style={{flex: 1}}
              value={credentials.email}
              placeholder="Enter your email"
              placeholderTextColor="#999999"
              onChangeText={text => handleSetCredentials(text, 'email')}
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
        <Button title="Login" onPress={loginUser} />
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          Don't have an account?
        </Text>
        <Button title="Signup" />
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Login;
