import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import styles from '../styles/ChecklistItem.styles';
import {AppContext} from '../context/AppContext';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import {updateChecklistItem} from '../utils/firebaseServices';

export default function ChecklistDetails({route}) {
  const {userData} = useContext(AppContext);
  const {checkItem, selectedChecklistId, initialItem} = route.params;

  const [item, setItem] = useState(initialItem);
  const [editedDescription, setEditedDescription] = useState(
    initialItem.description || '',
  );
  const [editDetails, setEditDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('ussssz', item, initialItem);

  // const handleCheckItem = async () => {
  //   try {
  //     const newCheckedState = !item.checked;

  //     setItem(prev => ({
  //       ...prev,
  //       checked: newCheckedState,
  //       checkedBy: item.checked ? null : userData?.username,
  //       updatedAt: new Date().toISOString(),
  //     }));

  //     await updateChecklistItem(selectedChecklistId, item.id, {
  //       checked: newCheckedState,
  //       checkedBy: item.checked ? null : userData?.username,
  //       updatedAt: new Date().toISOString(),
  //     });

  //     if (checkItem) checkItem(selectedChecklistId, item.id, newCheckedState);
  //   } catch (error) {
  //     console.error('Error checking item:', error.message);
  //   }
  // };

  const handleCheckItem = async () => {
    try {
      await updateChecklistItem(selectedChecklistId, initialItem.id, {
        checked: !initialItem.checked,
        checkedBy: initialItem.checked ? null : userData?.username,
        updatedAt: new Date().toISOString(),
      });
      if (checkItem)
        checkItem(selectedChecklistId, initialItem.id, !initialItem.checked);
    } catch (error) {
      console.error('Error checking item:', error.message);
    }
  };

  const handleEditDescription = async () => {
    try {
      Keyboard.dismiss();

      if (editedDescription !== item.description) {
        const updatedAt = new Date().toISOString();

        await updateChecklistItem(selectedChecklistId, itemId, {
          description: editedDescription,
          updatedAt,
        });

        setItem(prev => ({
          ...prev,
          description: editedDescription,
          updatedAt,
        }));
      }

      setEditDetails(false);
    } catch (error) {
      console.error('Error editing description:', error.message);
    }
  };

  return (
    <AppLayout canBack title={initialItem?.title || 'Checklist Item'}>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator size="large" style={{marginTop: 20}} />
        ) : (
          <View style={[GlobalStyles.gap, GlobalStyles.paddingVertical]}>
            <View style={[GlobalStyles.gap, GlobalStyles.flexRow]}>
              <Text style={GlobalStyles.textPrimary}>Description:</Text>
              {editDetails ? (
                <FAIcon
                  onPress={handleEditDescription}
                  name="floppy-o"
                  size={22}
                />
              ) : (
                <FAIcon5
                  onPress={() => setEditDetails(true)}
                  name="edit"
                  size={22}
                />
              )}
            </View>

            {editDetails ? (
              <TextInput
                style={GlobalStyles.textInput}
                multiline={true}
                value={editedDescription}
                onChangeText={setEditedDescription}
              />
            ) : (
              <Text style={GlobalStyles.textSecondary}>
                {initialItem.description || 'No description'}
              </Text>
            )}

            <Pressable
              onPress={handleCheckItem}
              style={[styles.itemChecklist, {gap: 10}]}>
              <Text style={GlobalStyles.textPrimary}>Task status:</Text>
              <View
                style={[styles.itemChecklist, {gap: initialItem.checked ? 10 : 14}]}>
                <Image
                  source={
                    initialItem.checked
                      ? require('../assets/checkedtrue.png')
                      : require('../assets/checkedfalse.png')
                  }
                  style={
                    initialItem.checked
                      ? {width: 24, height: 20}
                      : {width: 20, height: 20}
                  }
                />
              </View>
            </Pressable>

            {initialItem.checkedBy && (
              <>
                <View
                  style={[
                    GlobalStyles.gap,
                    GlobalStyles.paddingVertical,
                    GlobalStyles.flexRow,
                    GlobalStyles.flex,
                    {flexWrap: 'wrap'},
                  ]}>
                  <Text style={GlobalStyles.textPrimary}>Checked date:</Text>
                  <Text style={[GlobalStyles.textPrimary, {flexWrap: 'wrap'}]}>
                    {convertDate(
                      item.updatedAt,
                      `{month} {day}, {year} {hour}:{minute} {ampm}`,
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    GlobalStyles.gap,
                    GlobalStyles.paddingVertical,
                    GlobalStyles.flexRow,
                  ]}>
                  <Text style={GlobalStyles.textPrimary}>Checked by:</Text>
                  <Text style={GlobalStyles.textPrimary}>{item.checkedBy}</Text>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}
