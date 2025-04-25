import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';
import ReorderableList, {reorderItems} from 'react-native-reorderable-list';
import AppLayout from '../layout/AppLayout';
import NoteItem from '../components/NoteItem';
import {createNoteWithOrder} from '../utils/firebaseServices';
import {AppContext} from '../context/AppContext';
import {getNotes} from '../utils/firebaseServices';

const Notes = () => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [data, setData] = useState([]);
  const {user} = useContext(AppContext);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const notes = await getNotes(user);
        setData(notes);
      } catch (error) {
        console.error('Error fetching notes:', error.message);
      } finally {
        setLoadingNotes(false); // Hide loading indicator
      }
    };

    fetchNotes();
  }, [user]);
  console.log('daaaata', data);
  const handleReorder = ({from, to}) => {
    setData(value => reorderItems(value, from, to));
  };

  const handleCreateNotes = async (title, description) => {
    setLoadingNotes(true);
    try {
      const newNote = await createNoteWithOrder(title, description, user);
      console.log('notee', newNote);
      setLoadingNotes(false);
      setData(prevData => [...prevData, newNote]);
    } catch (error) {
      console.error('Error in handleCreateNotes:', error.message);
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
    height: '100%',
  },
});

export default Notes;
