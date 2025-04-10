import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  off,
  set,
} from '@react-native-firebase/database';

export default function Checklist() {
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const app = getApp();

  console.log('Apps:', app);

  useEffect(() => {
    const db = getDatabase();
    ref(db, '/checklists').on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Checklist data:', data);

        const itemsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setChecklistItems(itemsArray);
      } else {
        console.log('No checklist items found');
        setChecklistItems([]);
      }
      setLoading(false);
    });
  }, []);

  console.log('checklistitems', checklistItems);

  const addItem = (title, description) => {
    const db = getDatabase();

    const checklistRef = ref(db, '/checklists');
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

  const checkItem = (itemId, check) => {
    const db = getDatabase();
    const itemRef = ref(db, `/checklists/${itemId}`);

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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => checkItem(item.id, item.checked)}>
      {item.checked ? (
        <Image
          source={require('../assets/checkedtrue.png')}
          style={{width: 24, height: 20}}
        />
      ) : (
        <Image
          source={require('../assets/checkedfalse.png')}
          style={{width: 20, height: 20}}
        />
      )}

      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.checklistContainer}>
        <View style={styles.checklistHeaderFold}>
          <Image
            source={require('../assets/fold.png')}
            style={{width: 40, height: 40}}
          />
        </View>
        <View style={styles.checklistHeader}>
          <Text style={styles.headerText}>Checklist:</Text>
        </View>

        {loading ? (
          <Text>Loading...</Text>
        ) : checklistItems.length > 0 ? (
          <FlatList
            data={checklistItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noItemsText}>No checklist items found.</Text>
        )}

        <Button
          title="Add Test Item"
          onPress={() => addItem('item 1', 'Item 1 description1')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checklistContainer: {
    backgroundColor: '#FFF7E3',
    flex: 1,
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 32,
    flexDirection: 'column',
    borderTopRightRadius: 32,
    gap: 20,
    position: 'relative',
  },
  checklistHeader: {
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  checklistHeaderFold: {
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    color: 'black',
  },
  itemDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  noItemsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
