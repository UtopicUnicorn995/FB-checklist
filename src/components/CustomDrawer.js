import React, {useContext} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, Image} from 'react-native';
import Checklist from '../screens/Checklist';
import ChecklistDetails from '../screens/ChecklistDetails';
import Login from '../screens/Login';
import styles from '../styles/CustomDrawer.styles';
import Button from './Button';
import {AppContext} from '../context/AppContext';
import Pressable from './Pressable';

const Drawer = createDrawerNavigator();

function DrawerContent({navigation}) {
  const {
    logoutUser,
    userData,
    userCheckList,
    selectedChecklist,
    setSelectedChecklist,
  } = useContext(AppContext);

  const handleSelectChecklist = (selected) => {
    setSelectedChecklist(selected)
    navigation.toggleDrawer()
  }

  console.log('user data and checklist', userData, userCheckList);
  return (
    <View style={styles.drawerContainer}>
      <View style={{gap: 15}}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>List it</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <View
            style={[
              styles.drawerItem,
              {flexDirection: 'column', alignItems: 'left'},
            ]}
            onPress={() => navigation.navigate('Checklist')}>
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
          marginBottom: 40,
          width: '70%',
          height: '100%'
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
