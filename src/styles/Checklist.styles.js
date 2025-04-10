import { StyleSheet } from "react-native";


export default StyleSheet.create({
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
    floatingIcon: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 99,
      width: 55,
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 32,
      right: 32,
      elevation: 5,
    },
  });
  