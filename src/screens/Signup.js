import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import {getAuth} from '@react-native-firebase/auth';
import GuestLayout from '../layout/GuestLayout';
import Button from '../components/Button';
import styles from '../styles/Login.styles';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {getDatabase, push, ref, set} from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false,
    termsAndCondition: false,
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();

  const handleSetCredentials = (text, key) => {
    if (
      key === 'showPassword' ||
      key === 'showPassword2' ||
      key === 'termsAndCondition'
    ) {
      setCredentials(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    } else {
      setCredentials(prev => ({
        ...prev,
        [key]: text,
      }));
    }
  };

  const signUpUser = () => {
    const db = getDatabase();
    setLoading(true);

    getAuth()
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(createdUser => {
        console.log('User signed up:', createdUser);
        const user = createdUser.user;

        const userRef = ref(db, `/users/${user.uid}`);

        set(userRef, {
          allowedPages: 3,
          username: credentials.username,
          email: credentials.email,
          subscription: 'free',
          createdAt: new Date().toISOString(),
          settings: {
            notifications: {
              onItemCheckedByOthers: true,
              onInviteReceived: true,
              onChecklistItemChanged: true,
            },
          },
        })
          .then(() => {
            console.log('New User created');
            getAuth()
              .signInWithEmailAndPassword(
                credentials.email,
                credentials.password,
              )
              .then(userCredentials => {
                setLoading(false);
                console.log('ssucess', userCredentials.user.uid);
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
          })
          .catch(error => {
            console.log('errror creating user', error);
            Alert.alert(
              'Creating account failed',
              'Please check your internet or credential used in creating account',
              [
                {
                  text: 'ok',
                  onPress: () => setLoading(false),
                },
              ],
            );
          });
      })
      .catch(error => {
        console.error('Error signing up:', error);
        Alert.alert('Signup Failed', 'An unknown error occured', [
          {
            text: 'ok',
            onPress: () => setLoading(false),
          },
        ]);
      });
  };

  return (
    <GuestLayout>
      <KeyboardAvoidingView
        style={[styles.login]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.loginHeaderText}>Signup</Text>
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
                secureTextEntry={!credentials.showPassword}
                onChangeText={text => handleSetCredentials(text, 'password')}
              />
              <FAIcon
                onPress={() => handleSetCredentials('', 'showPassword')}
                size={25}
                color="#262626"
                name={credentials.showPassword ? 'eye' : 'eye-slash'}
              />
            </View>
          </View>
          <View>
            <Text styles={styles.inputLabel}>Confirm Password</Text>
            <View
              style={[
                styles.guestInput,
                !credentials.showPassword2 ? {paddingRight: 2} : null,
              ]}>
              <TextInput
                style={{flex: 1}}
                placeholder="Confirm your password"
                placeholderTextColor="#999999"
                value={credentials.password2}
                secureTextEntry={!credentials.showPassword2}
                onChangeText={text => handleSetCredentials(text, 'password2')}
              />
              <FAIcon
                onPress={() => handleSetCredentials('', 'showPassword2')}
                size={25}
                color="#262626"
                name={credentials.showPassword2 ? 'eye' : 'eye-slash'}
              />
            </View>
          </View>
          <Button title="Signup" onPress={signUpUser} isLoading={loading} />
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            Already have an account?
          </Text>
          <Button onPress={() => navigate.goBack()} title="Login" />
        </ScrollView>
      </KeyboardAvoidingView>
    </GuestLayout>
  );
};

export default Signup;
