import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
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

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);

  const userId = 'userId1';

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `/users/${userId}`);

    const unsubscribe = onValue(userRef, snapshot => {
      console.log('User data: ', snapshot.val());
    });

    console.log('Listening for user data changes...', userId, db);

    // Stop listening for updates when no longer required
    return () => unsubscribe();
  }, [userId]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = async () => {
    const code = generateVerificationCode();
    setGeneratedCode(code);

    console.log('Generated code:', code);

    const db = getDatabase();
    const userId = push(ref(db, 'users')).key;

    console.log('Generated User ID:', userId);

    set(ref(db, `/users/${userId}`), {
      phoneNumber,
      verificationCode: code,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        console.log('User data saved successfully:', {
          phoneNumber,
          verificationCode: code,
        });
        Alert.alert('Verification code sent!', `Your code is: ${code}`);
      })
      .catch(error => {
        console.error('Error saving user data:', error.message);
        Alert.alert('Error', error.message);
      });
  };

  const handleVerifyCode = async () => {
    const db = getDatabase();
    console.log('get database', db);
    const usersRef = query(
      ref(db, '/users'),
      orderByChild('phoneNumber'),
      equalTo(phoneNumber),
    );

    console.log('Querying users with phone number:', usersRef);

    onValue(usersRef, snapshot => {
      if (snapshot.exists()) {
        const userId = Object.keys(snapshot.val())[0]; // Get the first matching user ID
        const userData = snapshot.val()[userId];

        console.log('User data:', userData);
        if (userData.verificationCode === verificationCode) {
          update(ref(db, `/users/${userId}`), {
            isVerified: true,
            verifiedAt: new Date().toISOString(),
          })
            .then(() => {
              Alert.alert('Phone number verified!');
              navigation.navigate('Checklist'); // Navigate to the Checklist screen
              console.log('User verified:', userId);
            })
            .catch(error => {
              Alert.alert('Error updating user data', error.message);
            });
        } else {
          Alert.alert('Invalid code', 'The verification code is incorrect.');
        }
      } else {
        console.log('Error', 'User not found.');
      }
    });
  };

  const testDatabaseConnection = async () => {
    const db = getDatabase();
    set(ref(db, '/test'), {test: 'connection'})
      .then(() => console.log('Test data written successfully!'))
      .catch(error => console.error('Error writing test data:', error.message));
    console.log('Testing database connection...');
  };

  testDatabaseConnection();

  return (
    <View style={{padding: 20}}>
      {!generatedCode ? (
        <>
          <Text>Enter your phone number:</Text>
          <TextInput
            style={{borderWidth: 1, marginBottom: 10, padding: 5}}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Send Code" onPress={handleSendCode} />
        </>
      ) : (
        <>
          <Text>Enter the verification code:</Text>
          <TextInput
            style={{borderWidth: 1, marginBottom: 10, padding: 5}}
            placeholder="123456"
            keyboardType="number-pad"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <Button title="Verify Code" onPress={handleVerifyCode} />
        </>
      )}
    </View>
  );
};

export default Login;
