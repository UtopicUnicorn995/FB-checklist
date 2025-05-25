import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View, FlatList} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppLayout from '../layout/AppLayout';
import NoteItem from '../components/NoteItem';
import {createNote} from '../utils/firebaseServices';
import {UserContext} from '../context/UserContext';
import {AppContext} from '../context/AppContext';

const Notes = () => {
  const {userNotes} = useContext(AppContext);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const {user} = useContext(UserContext);

  // const insets = useSafeAreaInsets();

  const handleCreateNotes = async (title, description) => {
    try {
      const itemData = {
        title,
        description,
        createdBy: user.id,
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
      <View style={{flex: 1}}>
        {loadingNotes ? (
          <View style={{flex: 1, paddingTop: 40, alignContent: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={userNotes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[styles.listContainer]}
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
  },
});

export default Notes;
