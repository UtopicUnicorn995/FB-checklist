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
import {UserContext} from '../context/UserContext';
import {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {getLoggedUser} from '../utils/firebaseServices';
import {setUserSettings} from '../utils/asyncStorage';

const defaultNotificationSettings = [
  {
    key: 'checklistItemCreated',
    description: 'Notify when someone else checked an item.',
    state: true,
  },
  {
    key: 'invites',
    description: 'Notify when someone sent an invite.',
    state: true,
  },
  {
    key: 'checklistUpdates',
    description: 'Notify when a checklist has been added, modified or deleted.',
    state: true,
  },
];

const defaultDisplaySettings = [
  {key: 'theme', description: 'Dark Theme.', state: true},
  {key: 'colorBlind', description: 'Color blind mode', state: true},
];

const Login = () => {
  const {navigate} = useNavigation();
  const {setUser} = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const onAuthStateChanged = async currentUser => {
    if (currentUser) {
      const userData = await getLoggedUser(currentUser.uid);

      setUser({
        ...userData,
        id: currentUser.uid,
      });

      if (!userData.settings) {
        const defaultSettings = {
          notifications: defaultNotificationSettings,
          display: defaultDisplaySettings,
        };

        await setUserSettings(defaultSettings, currentUser.uid);
      } else {
        await setUserSettings(defaultSettings, currentUser.uid);
      }
    } else {
      setUser(null);
    }

    if (initializing) setInitializing(false);
  };

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
        console.log('User logged in:', userCredential.currentUser);
      })
      .catch(error => {
        console.log('errror code', error.code);
        if (error.code === 'auth/network-request-failed') {
          Alert.alert('Login Failed', 'Please connect to the internet.', [
            {
              text: 'ok',
              onPress: () => setLoading(false),
            },
          ]);
        } else if (error.code === 'auth/invalid-credential') {
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
        } else {
          Alert.alert('Login Failed', 'An unknown error occured.', [
            {
              text: 'ok',
              onPress: () => setLoading(false),
            },
          ]);
        }
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
              textContentType="emailAddress"
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
        <Button title="Signup" onPress={() => navigate('Signup')} />
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Login;
