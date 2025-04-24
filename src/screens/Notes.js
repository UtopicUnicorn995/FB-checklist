import React, {useState, useContext} from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';
import ReorderableList, {reorderItems} from 'react-native-reorderable-list';
import AppLayout from '../layout/AppLayout';
import NoteItem from '../components/NoteItem';
import {createNoteWithOrder} from '../utils/firebaseServices';
import {AppContext} from '../context/AppContext';

const rand = () => Math.floor(Math.random() * 256);

const seedData = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    color: `rgb(${rand()}, ${rand()}, ${rand()})`,
    height: Math.max(60, Math.floor(Math.random() * 100)),
  }));

const Notes = () => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [data, setData] = useState(seedData);
  const {userData} = useContext(AppContext);

  const handleReorder = ({from, to}) => {
    setData(value => reorderItems(value, from, to));
  };

  const handleCreateNotes = async (title, description) => {
    try {
      const newNote = await createNoteWithOrder(
        title,
        description,
        userData.id,
      );
      setData(prevData => [...prevData, newNote]);
    } catch (error) {
      console.error('Error in handleCreateNotes:', error.message);
      // Optionally show an error message to the user
    }
  };

  const renderItem = ({item}) => <NoteItem content={item} />;

  return (
    <AppLayout
      title="Notes"
      onAddItem={{func: handleCreateNotes, type: 'note'}}>
      <View>
        {loadingNotes ? (
          <View style={{flex: 1, paddingTop: 40, alignContent: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ReorderableList
            data={data}
            onReorder={handleReorder}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
    padding: 10,
  },
});

export default Notes;
