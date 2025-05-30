import React, {useState, useEffect, useMemo, useContext} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, Text, FlatList, Alert, TextInput} from 'react-native';
import {
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  checkListEdit,
} from '../utils/firebaseServices';
import ChecklistItem from '../components/ChecklistItem';
import AppLayout from '../layout/AppLayout';
import {UserContext} from '../context/UserContext';
import {AppContext} from '../context/AppContext';
import {sortChecklist} from '../utils/utilsFunc';
import NoItemFoundLayout from '../layout/NoItemFoundLayout';

export default function Checklist() {
  const {user} = useContext(UserContext);
  const {selectedChecklist, userCheckList, handleCreateChecklist} =
    useContext(AppContext);
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [isAddNewChecklist, setIsAddNewChecklist] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!selectedChecklist?.id) return;

    const items = selectedChecklist.checklistItems
      ? Object.entries(selectedChecklist.checklistItems).map(([id, item]) => ({
          id,
          ...item,
        }))
      : [];

    setChecklistItems(items);
    setTitle(selectedChecklist.title || '');
  }, [selectedChecklist]);

  const sortedChecklist = useMemo(() => {
    return sortChecklist(checklistItems, sortBy, sortOrder);
  }, [checklistItems, sortBy, sortOrder]);

  const addItem = async (title, description) => {
    const itemData = {
      title,
      description,
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    };

    try {
      await addChecklistItem(selectedChecklist.id, itemData);
    } catch (error) {
      console.error('Error adding item:', error.message);
    }
  };

  const checkItem = async (checklistId, itemId, check) => {
    console.log('hoy', checklistId, itemId, check);
    const updatedData = {
      checked: !check,
      updatedAt: new Date().toISOString(),
      checkedBy: user.username || 'Unknown user',
      updatedBy: user.id,
    };

    try {
      await updateChecklistItem(checklistId, itemId, updatedData);
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error.message);
    }
  };

  const editChecklistItem = async (checklistId, itemId, updatedData) => {
    try {
      await updateChecklistItem(checklistId, itemId, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id,
      });
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error.message);
    }
  };

  const deleteItem = async (checklistId, itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChecklistItem(checklistId, itemId);
            } catch (error) {
              console.error(`Error deleting item ${itemId}:`, error.message);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleTitleEdit = async newTitle => {
    if (!selectedChecklist) {
      console.error('No checklist selected. Cannot edit title.');
      return;
    }

    if (!selectedChecklist.id) {
      console.error('Selected checklist does not have an ID.');
      return;
    }

    try {
      setIsEditable(false);
      await checkListEdit(selectedChecklist.id, {title: newTitle});
    } catch (error) {
      setIsEditable(true);
      console.error(
        `Error changing title ${newTitle}, ${selectedChecklist.id}`,
        error,
      );
    }
  };
  const noItemFoundText =
    !userCheckList || userCheckList.length < 1
      ? 'No checklist found. Create your first checklist.'
      : !checklistItems || checklistItems.length < 1
      ? 'No item for this checklist found. Create your first checklist item.'
      : '';

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

  const onCreateChecklist = checklistTitle => {
    handleCreateChecklist(checklistTitle);
  };

  return (
    <AppLayout
      selectedChecklist={selectedChecklist}
      {...(userCheckList && userCheckList.length > 0
        ? {
            title,
            setTitle,
            isEditable,
            setIsEditable,
            handleTitleEdit,
            onAddItem: {func: addItem, type: 'checklist'},
          }
        : {})}>
      <View style={{flex: 1, overflow: 'hidden'}}>
        {loading ? (
          <Text>Loading...</Text>
        ) : checklistItems.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: insets.bottom, gap: 10}}
            data={sortedChecklist}
            renderItem={selectedChecklist && renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <NoItemFoundLayout
            bodyText={noItemFoundText}
            {...(userCheckList && userCheckList.length > 0
              ? {}
              : {onPress: onCreateChecklist})}
          />
        )}
      </View>
    </AppLayout>
  );
}
