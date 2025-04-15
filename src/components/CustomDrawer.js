import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, Image, Pressable} from 'react-native';
import Checklist from '../screens/Checklist';
import ChecklistDetails from '../screens/ChecklistDetails';
import Login from '../screens/Login';
import styles from '../styles/CustomDrawer.styles';
import Button from './Button';

const Drawer = createDrawerNavigator();

function DrawerContent({navigation}) {
  return (
    <View style={styles.drawerContainer}>
      <View>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>List it</Text>
        </View>
        <Pressable
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Checklist')}>
          <Image
            style={{width: 22, height: 24}}
            source={require('../assets/menu.png')}
          />
          <Text style={styles.drawerItemText}>Checklist</Text>
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
          <Text style={styles.drawerItemText}>Custom Item</Text>
        </Pressable>
        <Button onPress={() => navigation.navigate('Login')} title='Logout' />
      </View>
      <Pressable onPress={navigation.toggleDrawer} style={styles.foldStyle}>
        <Image style={{width: 50, height: 36}} source={require('../assets/fold2.png')} />
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
      <Drawer.Screen
        name="Login"
        component={Login}
        options={options}
      />
    </Drawer.Navigator>
  );
}
