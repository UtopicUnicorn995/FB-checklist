import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';
import ReorderableList, {reorderItems} from 'react-native-reorderable-list';
import AppLayout from '../layout/AppLayout';
import NoteItem from '../components/NoteItem';
import {createNote} from '../utils/firebaseServices';
import {AppContext} from '../context/AppContext';
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from '@react-native-firebase/database';
import {getNotes} from '../utils/firebaseServices';

const Notes = () => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [data, setData] = useState([]);
  const {user} = useContext(AppContext);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      setLoadingNotes(true);
      try {
        const db = getDatabase();
        const notesRef = query(
          ref(db, '/notes'),
          orderByChild('createdBy'),
          equalTo(user),
        );

        onValue(notesRef, snapshot => {
          if (snapshot.exists()) {
            const notes = Object.entries(snapshot.val()).map(([id, note]) => ({
              id,
              ...note,
            }));
            setData(notes);
          } else {
            setData([]);
          }
        });
      } catch (error) {
        console.error('Error fetching notes:', error.message);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleReorder = ({from, to}) => {
    setData(value => reorderItems(value, from, to));
  };

  const handleCreateNotes = async (title, description) => {
    try {
      const itemData = {
        title,
        description,
        createdBy: user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createNote(itemData);
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
