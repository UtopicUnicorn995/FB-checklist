import React, {memo} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useReorderableDrag} from 'react-native-reorderable-list';

const NoteItem = memo(({content}) => {
  const drag = useReorderableDrag();

  return (
    <Pressable
      style={[styles.card, {height: content.height}]}
      onLongPress={drag}>
      <Text style={[styles.text, {color: content.color}]}>
        Card {content.id}
      </Text>
      <Text style={[styles.text, {color: content.color}]}>
        Card {content.id}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#FFF7E3',
    borderWidth: 1,
    borderColor: '#444444A4',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoteItem;
