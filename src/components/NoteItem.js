import React, {memo} from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {useReorderableDrag} from 'react-native-reorderable-list';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';

const NoteItem = memo(({content}) => {
  const drag = useReorderableDrag();

  console.log('contentntnt', content);

  return (
    <Pressable style={[styles.card]} onLongPress={drag}>
      <View style={[GlobalStyles.flexRow]}>
        <Text style={[styles.noteTitleText]}>{content.title}</Text>
        <Text style={[styles.noteDateText]}>
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

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#FFF7E3',
    borderWidth: 1,
    gap: 5,
    borderColor: '#444444A4',
  },
  noteTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  noteDateText: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#262626',
  },
  noteBodyText: {
    fontSize: 14,
    color: '#4F4A41',
  },
});

export default NoteItem;
