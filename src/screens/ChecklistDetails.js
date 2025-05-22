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
import {ChecklistContext} from '../context/ChecklistContext';
import {useNavigation} from '@react-navigation/native';

export default function ChecklistDetails({route}) {
  const {userData} = useContext(AppContext);
  const {selectedChecklist} = useContext(ChecklistContext);
  const {selectedChecklistId, itemId} = route.params;
  const navigation = useNavigation();

  // Convert checklistItems to array if needed
  const checklistItemsArray = Array.isArray(selectedChecklist?.checklistItems)
    ? selectedChecklist.checklistItems
    : selectedChecklist?.checklistItems
    ? Object.entries(selectedChecklist.checklistItems).map(([id, item]) => ({
        id,
        ...item,
      }))
    : [];

  const item = checklistItemsArray.find(i => i.id === itemId);

  // Local state only for editing description
  const [editedDescription, setEditedDescription] = useState(
    item?.description || '',
  );
  const [editDetails, setEditDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update editedDescription if item changes (e.g., after real-time update)
  React.useEffect(() => {
    setEditedDescription(item?.description || '');
  }, [item?.description]);

  if (!item) {
    return (
      <AppLayout handleBack={navigation.goBack} title="Checklist Item">
        <View style={{padding: 20}}>
          <Text>Item not found.</Text>
        </View>
      </AppLayout>
    );
  }

  const handleCheckItem = async () => {
    try {
      setIsLoading(true);
      await updateChecklistItem(selectedChecklistId, item.id, {
        checked: !item.checked,
        checkedBy: item.checked ? null : userData?.username,
        updatedAt: new Date().toISOString(),
      });
      setIsLoading(false);
      // No local setItem needed; context will update and re-render
    } catch (error) {
      setIsLoading(false);
      console.error('Error checking item:', error.message);
    }
  };

  const handleEditDescription = async () => {
    try {
      Keyboard.dismiss();
      if (editedDescription !== item.description) {
        setIsLoading(true);
        await updateChecklistItem(selectedChecklistId, item.id, {
          description: editedDescription,
          updatedAt: new Date().toISOString(),
        });
        setIsLoading(false);
      }
      setEditDetails(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error editing description:', error.message);
    }
  };

  const handleBack = () => {
    setEditDetails(false);
    navigation.goBack();
  };

  return (
    <AppLayout handleBack={handleBack} title={item?.title || 'Checklist Item'}>
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
                onChangeText={text => setEditedDescription(text)}
              />
            ) : (
              <Text style={GlobalStyles.textSecondary}>
                {item.description || 'No description'}
              </Text>
            )}

            <Pressable
              onPress={handleCheckItem}
              style={[styles.itemChecklist, {gap: 10}]}>
              <Text style={GlobalStyles.textPrimary}>Task status:</Text>
              <View
                style={[styles.itemChecklist, {gap: item.checked ? 10 : 14}]}>
                <Image
                  source={
                    item.checked
                      ? require('../assets/checkedtrue.png')
                      : require('../assets/checkedfalse.png')
                  }
                  style={
                    item.checked
                      ? {width: 24, height: 20}
                      : {width: 20, height: 20}
                  }
                />
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
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}
