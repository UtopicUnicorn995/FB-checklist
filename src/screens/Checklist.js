import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  off,
  set,
  databaseUrl
} from '@react-native-firebase/database';

export default function Checklist() {
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const app = getApp();

  console.log('Apps:', app);

  useEffect(() => {
    const db = getDatabase();
    const checklistRef = ref(db, '/checklists');

    const onValueChange = snapshot => {
      console.log('Snapshot received:', snapshot);

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
    };

    onValue(checklistRef, onValueChange, error => {
      console.error('Error retrieving checklist data:', error);
      setLoading(false);
    });

    return () => {
      off(checklistRef, 'value', onValueChange);
    };
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

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemStatus}>
        {item.checked ? 'Completed' : 'Pending'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.checklistContainer}>
        <View style={styles.checklistHeader}>
          <Text style={styles.headerText}>Checklist:</Text>
        </View>
{/* 
        <Button
          title="Add Test Item"
          onPress={() => addItem('New Item', "A new item's descriptio")}
        /> */}

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
    borderRadiusTopRight: 32,
    gap: 32,
  },
  checklistHeader: {
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  itemContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
