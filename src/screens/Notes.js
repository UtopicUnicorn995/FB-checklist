import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';
import ReorderableList, {reorderItems} from 'react-native-reorderable-list';
import AppLayout from '../layout/AppLayout';
import NoteItem from '../components/NoteItem';
import {createNote} from '../utils/firebaseServices';
import {UserContext} from '../context/UserContext';
import {AppContext} from '../context/AppContext';

const Notes = () => {
  const {userNotes} = useContext(AppContext);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [data, setData] = useState([]);
  const {user} = useContext(UserContext);

  console.log('nottt', userNotes);

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
            data={userNotes}
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
