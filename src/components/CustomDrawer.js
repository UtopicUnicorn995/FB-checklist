import React, {useContext, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, Image, TextInput} from 'react-native';
import Checklist from '../screens/Checklist';
import ChecklistDetails from '../screens/ChecklistDetails';
import Login from '../screens/Login';
import styles from '../styles/CustomDrawer.styles';
import Button from './Button';
import {AppContext} from '../context/AppContext';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import Pressable from './Pressable';
import {useNavigationState} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function DrawerContent({navigation}) {
  const {
    logoutUser,
    userData,
    userCheckList,
    selectedChecklist,
    setSelectedChecklist,
    createChecklist,
  } = useContext(AppContext);
  const [isAddChecklist, setIsAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  console.log('newee', newChecklistTitle);

  const currentScreenName = useNavigationState(state => {
    const drawerRoute = state.routes[state.index]; // Get the active route of the drawer
    if (drawerRoute.state) {
      const activeChildRoute =
        drawerRoute.state.routes[drawerRoute.state.index];
      return activeChildRoute.name; // Return the name of the active child route
    }
    return drawerRoute.name; // Fallback to the drawer route name
  });

  console.log('Current Screen Name:', currentScreenName);

  const handleSelectChecklist = selected => {
    setSelectedChecklist(selected);
    if (currentScreenName !== 'Checklist') {
      navigation.navigate('Checklist');
    }
    navigation.toggleDrawer();
  };

  const handleAddChecklist = () => {
    setIsAddChecklist(false);
    setNewChecklistTitle('');
    createChecklist(newChecklistTitle);
  };

  console.log('user data and checklist', userData, userCheckList);
  return (
    <View style={styles.drawerContainer}>
      <View style={{gap: 15}}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>App name and Icon</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <View
            style={[
              styles.drawerItem,
              {flexDirection: 'column', alignItems: 'left'},
            ]}>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Image
                style={{width: 22, height: 24}}
                source={require('../assets/menu.png')}
              />
              <Text style={styles.drawerItemText}>
                Personal Checklist ({userCheckList && userCheckList.length}/
                {userData && userData.allowedPages})
              </Text>
            </View>
            {userCheckList &&
              userCheckList.map(checklist => (
                <Pressable
                  onPress={() => handleSelectChecklist(checklist)}
                  style={[
                    styles.checkListItem,
                    selectedChecklist === checklist && {
                      backgroundColor: '#EEE9E0',
                    },
                  ]}
                  key={checklist.id}>
                  <Text
                    style={
                      selectedChecklist === checklist && {fontWeight: 'bold'}
                    }>
                    {checklist.title}
                  </Text>
                </Pressable>
              ))}
            {userCheckList && userCheckList.length < userData.allowedPages ? (
              isAddChecklist ? (
                <View style={styles.newChecklistInputContainer}>
                  <TextInput
                    style={styles.newChecklistInput}
                    value={newChecklistTitle}
                    placeholder="Checklist title"
                    placeholderTextColor="#aaa"
                    onChangeText={text => setNewChecklistTitle(text)}
                  />
                  <Pressable
                    onPress={handleAddChecklist}
                    style={styles.newChecklistBtnContainer}>
                    <FAIcon
                      name="plus"
                      size={20}
                      color="#464646"
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </Pressable>
                </View>
              ) : (
                <Button
                  onPress={() => setIsAddChecklist(true)}
                  btnStyleProp={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 5,
                    paddingTop: 5,
                  }}
                  iconName="plus"
                  btnTextStyleProp={18}
                />
              )
            ) : (
              <Button
                title="Upgrade to add more"
                btnStyleProp={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 5,
                  paddingTop: 3,
                }}
                btnTextStyleProp={{color: '#262626', fontSize: 14}}
              />
            )}
          </View>

          <Pressable
            style={styles.drawerItem}
            onPress={() => console.log('Custom Action')}>
            <Image
              style={{width: 20, height: 22}}
              source={require('../assets/notes.png')}
            />
            <Text style={styles.drawerItemText}>Notes</Text>
          </Pressable>
          <Pressable
            style={styles.drawerItem}
            onPress={() => navigation.navigate('ChecklistDetails')}>
            <Image
              style={{width: 27, height: 17}}
              source={require('../assets/users.png')}
            />
            <Text style={styles.drawerItemText}>Collaborators</Text>
          </Pressable>

          <Pressable
            style={styles.drawerItem}
            onPress={() => navigation.navigate('ChecklistDetails')}>
            <Image
              style={{width: 23, height: 24}}
              source={require('../assets/gear.png')}
            />
            <Text style={styles.drawerItemText}>Settings</Text>
          </Pressable>

          <Pressable
            style={styles.drawerItem}
            onPress={() => console.log('Custom Action')}>
            <Image
              style={{width: 25, height: 20}}
              source={require('../assets/crown.png')}
            />
            <Text style={styles.drawerItemText}>Plan (free)</Text>
          </Pressable>
        </View>
        <Button onPress={logoutUser} title="Logout" />
      </View>
      <Pressable onPress={navigation.toggleDrawer} style={styles.foldStyle}>
        <Image
          style={{width: 50, height: 36}}
          source={require('../assets/fold2.png')}
        />
      </Pressable>
    </View>
  );
}

export default function CustomDrawer() {
  const insets = useSafeAreaInsets();

  const options = {
    headerShown: false,
  };

  return (
    <Drawer.Navigator
      initialRouteName="Checklist"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#FFF7E3',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 32,
          marginBottom: insets.bottom,
          width: '70%',
        },
        drawerPosition: 'right',
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Checklist" component={Checklist} options={options} />
      <Drawer.Screen
        name="ChecklistDetails"
        component={ChecklistDetails}
        options={options}
      />
      <Drawer.Screen name="Login" component={Login} options={options} />
    </Drawer.Navigator>
  );
}
