import React, {useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import styles from '../styles/ChecklistItem.styles';
import {AppContext} from '../context/AppContext';
import {useContext} from 'react';

export default function ChecklistDetails({route}) {
  const {userData} = useContext(AppContext);
  const {item: initialItem, checkItem, selectedChecklistId} = route.params;

  // Create local state for the item
  const [item, setItem] = useState(initialItem);

  const handleCheckItem = async () => {
    try {
      // Call the checkItem function
      await checkItem(selectedChecklistId, item.id, item.checked);

      // Update the local state to reflect the new checked status
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

  console.log('checkItem', item);

  return (
    <AppLayout canBack title={item.title}>
      <ScrollView>
        <View style={[GlobalStyles.gap, GlobalStyles.paddingVertical]}>
          <Text style={GlobalStyles.textPrimary}>Description:</Text>
          <Text style={GlobalStyles.textSecondary}>{item.description}</Text>
        </View>
        <Pressable
          onPress={handleCheckItem}
          style={[styles.itemChecklist, {gap: 10}]}>
          <Text style={GlobalStyles.textPrimary}>Task status:</Text>
          <View
            style={[
              styles.itemChecklist,
              item.checked ? {gap: 10} : {gap: 14},
            ]}>
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
              ]}>
              <Text style={GlobalStyles.textPrimary}>Checked date:</Text>
              <Text style={GlobalStyles.textSecondary}>
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
              <Text style={GlobalStyles.textSecondary}>{item.checkedBy}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}
