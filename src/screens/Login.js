import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {getAuth} from '@react-native-firebase/auth';
import GuestLayout from '../layout/GuestLayout';
import Button from '../components/Button';
import styles from '../styles/Login.styles';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {AppContext} from '../context/AppContext';
import {useContext} from 'react';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const {navigate} = useNavigation()
  const {setUser} = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Track keyboard visibility

  function onAuthStateChanged(currentUser) {
    if (currentUser) {
      setUser(currentUser.uid);
    } else {
      setUser(null);
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
    setLoading(true);
    getAuth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(userCredential => {
        setLoading(false);
        console.log('User logged in:', userCredential.user.uid);
      })
      .catch(error => {
        Alert.alert(
          'Login Failed',
          'The credentials you have entered is incorrect.',
          [
            {
              text: 'ok',
              onPress: () => setLoading(false),
            },
          ],
        );
      });
  };


  return (
    <GuestLayout>
      <KeyboardAvoidingView
        style={[styles.login, {paddingVertical: keyboardVisible ? 0 : 60}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.loginHeaderText}>Login</Text>
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
        <Button title="Login" onPress={loginUser} isLoading={loading} />
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          Don't have an account?
        </Text>
        <Button title="Signup" onPress={() => navigate('Signup')}/>
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Login;
