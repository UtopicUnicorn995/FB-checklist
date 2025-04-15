import React, {useState, useEffect, useRef, useContext} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {View, Text, FlatList, Alert} from 'react-native';
import {getDatabase, ref, push, set} from '@react-native-firebase/database';
import ModalView from '../components/ModalView';
import ChecklistItem from '../components/ChecklistItem';
import styles from '../styles/Checklist.styles';
import AppLayout from '../layout/AppLayout';

export default function Checklist() {
  const [checklist, setChecklist] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const insets = useSafeAreaInsets()

  useEffect(() => {
    const db = getDatabase();
    ref(db, '/checklists').on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const itemsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setChecklist(itemsArray);
        setSelectedChecklist(itemsArray[0]);
        setTitle(itemsArray[0]?.title || 'My Checklist');
        setLoading(false);
      } else {
        console.log('No checklist items found');
        setChecklist([]);
      }
    });
  }, []);

  const addItem = (title, description) => {
    const db = getDatabase();

    const checklistRef = ref(
      db,
      `/checklists/${selectedChecklist.id}/checklistItems`,
    );
    const newItemRef = push(checklistRef);

    set(newItemRef, {
      title: title,
      description: description,
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
      .then(() => console.log('Item added successfully!'))
      .catch(error => console.error('Error adding item:', error.message));
  };

  const checkItem = (checklistId, itemId, check) => {
    const db = getDatabase();
    const itemRef = ref(
      db,
      `/checklists/${checklistId}/checklistItems/${itemId}`,
    );

    const updatedCheckedValue = !check;
    itemRef
      .update({
        checked: updatedCheckedValue,
        updatedAt: new Date().toISOString(),
      })
      .then(() => console.log(`Item ${itemId} updated successfully!`))
      .catch(error =>
        console.error(`Error updating item ${itemId}:`, error.message),
      );
  };

  const editChecklistItem = (checklistId, itemId, updatedData) => {
    const db = getDatabase();
    const itemRef = ref(
      db,
      `/checklists/${checklistId}/checklistItems/${itemId}`,
    );

    itemRef
      .update(updatedData)
      .then(() => {
        console.log(`Item ${itemId} updated successfully!`);
        setEditingItem(null);
      })
      .catch(error =>
        console.error(`Error updating item ${itemId}:`, error.message),
      );
  };

  const deleteItem = (checklistId, itemId) => {
    const db = getDatabase();
    const itemRef = ref(
      db,
      `/checklists/${checklistId}/checklistItems/${itemId}`,
    );

    Alert.alert(
      'Delete checklist item?',
      'Are you sure you want to delete this item? This action can’t be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => setEditingItem(null),
          style: 'cancel',
        },
        {
          text: 'Okay',
          onPress: () => {
            itemRef
              .remove()
              .then(() => {
                console.log(`Item ${itemId} deleted successfully!`);
                setEditingItem(null);
              })
              .catch(error =>
                console.error(`Error deleting item ${itemId}:`, error.message),
              );
          },
        },
      ],
    );
  };

  const handleTitleEdit = () => {
    if (selectedChecklist?.id) {
      const db = getDatabase();
      const checklistRef = ref(db, `/checklists/${selectedChecklist.id}`);

      checklistRef
        .update({title})
        .then(() => {
          console.log(`Checklist ${selectedChecklist.id} updated`);
          setIsEditable(false);
        })
        .catch(error =>
          console.error('Error updating checklist title:', error.message),
        );
    }
  };

  const toggleAddItemModal = () => {
    console.log('to');
    setIsAddItemModalOpen(prev => !prev);
  };

  const renderItem = ({item, index}) => (
    <ChecklistItem
      item={item}
      index={index}
      checkItem={checkItem}
      editingItem={editingItem}
      setEditingItem={setEditingItem}
      editChecklistItem={editChecklistItem}
      selectedChecklistId={selectedChecklist.id}
      handleDeleteItem={deleteItem}
    />
  );

  return (
    <AppLayout
      selectedChecklist={selectedChecklist}
      title={title}
      setTitle={setTitle}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      handleTitleEdit={handleTitleEdit}
      toggleAddItemModal={toggleAddItemModal}>
      <View style={styles.checklist}>
        {loading ? (
          <Text>Loading...</Text>
        ) : checklist.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: insets.bottom}}
            data={
              selectedChecklist?.checklistItems
                ? Object.keys(selectedChecklist.checklistItems).map(key => ({
                    id: key,
                    ...selectedChecklist.checklistItems[key],
                  }))
                : []
            }
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noItemsText}>No checklist items found.</Text>
        )}
      </View>
      <ModalView
        openMenu={isAddItemModalOpen}
        setModalMenu={toggleAddItemModal}
        handleAddItem={addItem}
      />
    </AppLayout>
  );
}
