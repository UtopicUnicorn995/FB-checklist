import React, {useContext, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, Image, TextInput} from 'react-native';
import Checklist from '../screens/Checklist';
import ChecklistDetails from '../screens/ChecklistDetails';
import Notes from '../screens/Notes';
import styles from '../styles/CustomDrawer.styles';
import Button from './Button';
import {AppContext} from '../context/AppContext';
import {ChecklistContext} from '../context/ChecklistContext';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import Pressable from './Pressable';
import {useNavigationState} from '@react-navigation/native';
import Collaborators from '../screens/Collaborators';
import Settings from '../screens/Settings';
import Plan from '../screens/Plan';
import { getLoggedUser } from '../utils/firebaseServices';

const Drawer = createDrawerNavigator();

function DrawerContent({navigation}) {
  const {logoutUser, user} = useContext(AppContext);
  const {
    userCheckList,
    selectedChecklist,
    setSelectedChecklist,
    handleCreateChecklist,
  } = useContext(ChecklistContext);
  const [isAddChecklist, setIsAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  const currentScreenName = useNavigationState(state => {
    const drawerRoute = state.routes[state.index];
    if (drawerRoute.state) {
      const activeChildRoute =
        drawerRoute.state.routes[drawerRoute.state.index];
      return activeChildRoute.name;
    }
    return drawerRoute.name;
  });

  const handleSelectChecklist = selected => {
    setSelectedChecklist(selected);
    if (currentScreenName !== 'Checklist') {
      navigation.navigate('Checklist');
    } else {
      navigation.toggleDrawer();
    }
  };

  const handleAddChecklist = () => {
    setIsAddChecklist(false);
    setNewChecklistTitle('');
    handleCreateChecklist(newChecklistTitle);
  };

  const handleNavigation = location => {
    setSelectedChecklist(null);
    navigation.navigate(location);
  };

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
                {console.log('pages', user)}
                Personal Checklist ({userCheckList && userCheckList.length}/
                {user && user.allowedPages})
              </Text>
            </View>
            <View style={{gap: 0}}>
              {userCheckList &&
                userCheckList.map((checklist, index) => (
                  <Pressable
                    onPress={() => handleSelectChecklist(checklist)}
                    style={[
                      styles.checkListItem,
                      selectedChecklist === checklist && {
                        backgroundColor: '#EEE9E0',
                      },
                      index !== userCheckList.length - 1 &&
                        styles.checkListItemBorder,
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
            </View>
            {userCheckList && userCheckList.length < user.allowedPages ? (
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
            onPress={() => handleNavigation('Notes')}>
            <Image
              style={{width: 20, height: 22}}
              source={require('../assets/notes.png')}
            />
            <Text style={styles.drawerItemText}>Notes</Text>
          </Pressable>
          <Pressable
            style={styles.drawerItem}
            onPress={() => handleNavigation('Collaborators')}>
            <Image
              style={{width: 27, height: 17}}
              source={require('../assets/users.png')}
            />
            <Text style={styles.drawerItemText}>Collaborators</Text>
          </Pressable>

          <Pressable
            style={styles.drawerItem}
            onPress={() => handleNavigation('Settings')}>
            <Image
              style={{width: 23, height: 24}}
              source={require('../assets/gear.png')}
            />
            <Text style={styles.drawerItemText}>Settings</Text>
          </Pressable>

          <Pressable
            style={styles.drawerItem}
            onPress={() => handleNavigation('Plan')}>
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
      <Drawer.Screen name="Notes" component={Notes} options={options} />
      <Drawer.Screen
        name="Collaborators"
        component={Collaborators}
        options={options}
      />
      <Drawer.Screen name="Settings" component={Settings} options={options} />
      <Drawer.Screen name="Plan" component={Plan} options={options} />
    </Drawer.Navigator>
  );
}
