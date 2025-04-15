import React from 'react';
import {View, Text, TextInput, Image, StyleSheet} from 'react-native';
import Pressable from './Pressable';
import styles from '../styles/ChecklistItem.styles';

export default function ChecklistItem({
  item,
  index,
  checkItem,
  editingItem,
  setEditingItem,
  editChecklistItem,
  selectedChecklistId,
  handleDeleteItem,
}) {
  return (
    <View style={styles.itemContainer}>
      {editingItem?.id === item.id ? (
        <View style={styles.editContainer}>
          <Pressable
            onPress={() => handleDeleteItem(selectedChecklistId, item.id)}>
            <Image
              source={require('../assets/delete.png')}
              style={{width: 20, height: 23}}
            />
          </Pressable>
          <TextInput
            style={[styles.itemTitle, styles.editableTextInput]}
            value={editingItem.title}
            onChangeText={text =>
              setEditingItem(prev => ({...prev, title: text}))
            }
            onBlur={() => {
              editChecklistItem(selectedChecklistId, item.id, {
                title: editingItem.title,
              });
            }}
          />
        </View>
      ) : (
        <Pressable
          style={[styles.itemChecklist, item.checked ? {gap: 10} : {gap: 14}]}
          onPress={() => checkItem(selectedChecklistId, item.id, item.checked)}>
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
          <Text
            style={[
              styles.itemTitle,
              item.checked && {textDecorationLine: 'line-through'},
            ]}>
            {index + 1}. {item.title}
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={() =>
          editingItem
            ? setEditingItem(null)
            : setEditingItem({id: item.id, title: item.title})
        }>
        <Image
          source={require('../assets/editItem.png')}
          style={{width: 20, height: 18}}
        />
      </Pressable>
    </View>
  );
}
