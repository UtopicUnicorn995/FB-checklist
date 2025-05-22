import React, {memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {useReorderableDrag} from 'react-native-reorderable-list';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import styles from '../styles/NoteItem.styles';

const NoteItem = memo(({content}) => {
  const drag = useReorderableDrag();
  const navigation = useNavigation();

  const openNoteItemDetails = () => {
    navigation.navigate('NotesItemDetails', {item: content});
  };

  return (
    <Pressable
      style={[styles.card]}
      onLongPress={drag}
      onPress={openNoteItemDetails}>
      <View style={[GlobalStyles.flexRow]}>
        <Text style={[GlobalStyles.textPrimary]}>{content.title}</Text>
        <Text style={[GlobalStyles.textSecondary]}>
          (
          {convertDate(
            content.updatedAt,
            `{month} {day}, {year} {hour}:{minute} {ampm}`,
          )}
          )
        </Text>
      </View>
      <Text
        style={[styles.noteBodyText]}
        numberOfLines={2}
        ellipsizeMode="tail">
        {content.description}
      </Text>
    </Pressable>
  );
});

export default NoteItem;
