import React, {useState, useEffect, useMemo, useContext} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, Text, FlatList, Alert} from 'react-native';
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
} from '@react-native-firebase/database';
import ModalView from '../components/ModalView';
import ChecklistItem from '../components/ChecklistItem';
import styles from '../styles/Checklist.styles';
import AppLayout from '../layout/AppLayout';
import {AppContext} from '../context/AppContext';

export default function Checklist() {
  const {selectedChecklist} = useContext(AppContext);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const insets = useSafeAreaInsets();

  console.log('selected checklist from the checklist', selectedChecklist);

  useEffect(() => {
    if (!selectedChecklist?.id) return;

    const items = selectedChecklist.checklistItems
      ? Object.entries(selectedChecklist.checklistItems).map(([id, item]) => ({
          id,
          ...item,
        }))
      : [];

    setChecklist(items);
    setTitle(selectedChecklist.title || '');
  }, [selectedChecklist]);

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
      .then(() => {
        setChecklist(prev => [
          ...prev,
          {
            id: newItemRef.key,
            title,
            description,
            checked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      })
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
        setChecklist(prev =>
          prev.map(item =>
            item.id === itemId ? {...item, ...updatedData} : item,
          ),
        );
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
                setChecklist(prev => prev.filter(item => item.id !== itemId));
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
    if (!selectedChecklist) {
      console.error('No checklist selected. Cannot edit title.');
      return;
    }

    if (!selectedChecklist.id) {
      console.error('Selected checklist does not have an ID.');
      return;
    }

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
  };

  const toggleAddItemModal = () => {
    setIsAddItemModalOpen(prev => !prev);
  };

  const renderItem = ({item, index}) => {
    return (
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
  };


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
            data={checklist.filter(Boolean)}
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
