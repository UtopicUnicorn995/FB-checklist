import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import {getDatabase, ref, push, set} from '@react-native-firebase/database';
import ModalView from '../components/ModalView';
import ChecklistItem from '../components/ChecklistItem';
import styles from '../styles/Checklist.styles';

export default function Checklist() {
  const [checklist, setChecklist] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const animationValue = useRef(new Animated.Value(0)).current;
  const animationFold = useRef(new Animated.Value(1)).current

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
        // setChecklistTitle(prev => ({
        //   ...prev,
        //   title: itemsArray[0]?.title || '',
        // }));
        setLoading(false);
      } else {
        console.log('No checklist items found');
        setChecklist([]);
      }
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);

    Animated.timing(animationValue, {
      toValue: isMenuOpen ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  

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



  const renderItem = ({item, index}) => (
    <ChecklistItem
      item={item}
      index={index}
      checkItem={checkItem}
      editingItem={editingItem}
      setEditingItem={setEditingItem}
      editChecklistItem={editChecklistItem}
      selectedChecklistId={selectedChecklist.id}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.checklistContainer}>
        

        {loading ? (
          <Text>Loading...</Text>
        ) : checklist.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
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

        <ModalView
          openMenu={isMenuOpen}
          setModalMenu={toggleMenu}
          handleAddItem={addItem}
        />
      </View>
    </View>
  );
}
