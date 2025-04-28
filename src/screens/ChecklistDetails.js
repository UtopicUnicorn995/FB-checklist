import React, {useEffect, useState, useContext} from 'react';
import {View, Text, ScrollView, Image, TextInput, Keyboard} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import styles from '../styles/ChecklistItem.styles';
import {AppContext} from '../context/AppContext';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import {checklistItemEdit} from '../utils/firebaseServices';

export default function ChecklistDetails({route}) {
  const {userData} = useContext(AppContext);
  const {item: initialItem, checkItem, selectedChecklistId} = route.params;

  const [item, setItem] = useState(initialItem);
  const [editDetails, setEditDetails] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    initialItem.description,
  );

  console.log(
    'route paramms',
    route.params,
    item,
    checkItem,
    selectedChecklistId,
  );

  useEffect(() => {
    setItem(initialItem);
    setEditedDescription(initialItem.description);
  }, [initialItem]);

  const handleCheckItem = async () => {
    try {
      await checkItem(selectedChecklistId, item.id, item.checked);

      setItem(prevItem => ({
        ...prevItem,
        checked: !prevItem.checked,
        updatedAt: new Date().toISOString(),
        checkedBy: !prevItem.checked ? userData.username : null,
      }));
    } catch (error) {
      console.error('Error checking item:', error.message);
    }
  };

  const handleEditDescription = async () => {
    try {
      Keyboard.dismiss();
      if (editedDescription !== item.description) {
        await checklistItemEdit(selectedChecklistId, item.id, {
          description: editedDescription,
        });

        setItem(prevItem => ({
          ...prevItem,
          description: editedDescription,
          updatedAt: new Date().toISOString(),
        }));
      }
      setEditDetails(false);
    } catch (error) {
      console.error('Error editing description:', error.message);
    }
  };

  return (
    <AppLayout canBack title={item.title}>
      <ScrollView>
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
              onChangeText={text => setEditedDescription(text)}
            />
          ) : (
            <Text style={GlobalStyles.textSecondary}>
              {item.description || 'No description'}
            </Text>
          )}
        </View>

        <Pressable
          onPress={handleCheckItem}
          style={[styles.itemChecklist, {gap: 10}]}>
          <Text style={GlobalStyles.textPrimary}>Task status:</Text>
          <View style={[styles.itemChecklist, {gap: item.checked ? 10 : 14}]}>
            {item.checked ? (
              <Image
                source={require('../assets/checkedtrue.png')}
                style={{width: 24, height: 20}}
              />
            ) : (
              <Image
                source={require('../assets/checkedfalse.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </View>
        </Pressable>

        {item.checkedBy && (
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
      </ScrollView>
    </AppLayout>
  );
}
