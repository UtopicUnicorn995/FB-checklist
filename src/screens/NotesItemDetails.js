import {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {updateNotes} from '../utils/firebaseServices';

export default function NotesItemDetails({route}) {
  const details = route.params.item;
  const [editDetails, setEditDetails] = useState({
    state: false,
    title: details.title,
    description: details.description,
  });

  const handleEditDescription = async () => {
    try {
      // if (editDetails.description !== details.description) {
        const payload = {
          title: editDetails.title,
          description: editDetails.description,
          updatedAt: new Date().toISOString(),
        };
        await updateNotes(payload, details.id);
        setEditDetails(prev => ({
          ...prev,
          state: false,
        }));
      // }
    } catch (error) {
      Alert.alert(
        'Updated failed',
        'Sorry you have failed on updating notes. Please try again later.',
      );
      console.error('errror', error);
    }
  };

  console.log('detaillsss', details);

  return (

      <AppLayout title={details.title} canBack>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View style={GlobalStyles.gap}>
            <View style={GlobalStyles.flexRow}>
              <Text style={GlobalStyles.textPrimary}>Description:</Text>
              {editDetails.state ? (
                <FAIcon
                  onPress={handleEditDescription}
                  name="floppy-o"
                  size={22}
                />
              ) : (
                <FAIcon5
                  onPress={() =>
                    setEditDetails(prev => ({...prev, state: true}))
                  }
                  name="edit"
                  size={22}
                />
              )}
            </View>
            {editDetails.state ? (
              <TextInput
                style={GlobalStyles.textInput}
                multiline={true}
                value={editDetails.description}
                onChangeText={text =>
                  setEditDetails(prev => ({...prev, description: text}))
                }
              />
            ) : (
              <Text style={GlobalStyles.textSecondary}>
                {editDetails.description}
              </Text>
            )}
          </View>

          <View
            style={[
              GlobalStyles.flexRow,
              GlobalStyles.gap,
              GlobalStyles.paddingVertical,
            ]}>
            <Text style={GlobalStyles.textPrimary}>Created date:</Text>
            <Text style={GlobalStyles.textPrimary}>
              {convertDate(details.createdAt, `{month} {day}, {year}`)}
            </Text>
          </View>
          <View
            style={[
              GlobalStyles.flexRow,
              GlobalStyles.gap,
              GlobalStyles.paddingVertical,
            ]}>
            <Text style={GlobalStyles.textPrimary}>Last modified:</Text>
            <Text style={GlobalStyles.textPrimary}>
              {convertDate(details.updatedAt, `{month} {day}, {year}`)}
            </Text>
          </View>
        </ScrollView>
      </AppLayout>

  );
}
