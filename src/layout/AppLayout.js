import {useState} from 'react';
import {View, Image} from 'react-native';
import {getDatabase, ref, push, set} from '@react-native-firebase/database';

export default function AppLayout({children}) {
  const [checklistTitle, setChecklistTitle] = useState({
    isEdit: false,
    title: '',
  });

  const editChecklistTitle = (checklistId, newTitle) => {
    const db = getDatabase();
    const checklistRef = ref(db, `/checklists/${checklistId}`);

    console.log('checklist ref', checklistRef);

    checklistRef
      .update({
        title: checklistTitle.title,
      })
      .then(() =>
        console.log(`Item ${checklistId}'s title has successfully been edited`),
      )
      .catch(error => console.log('Error changing title'));
  };
  return (
    <View style={styles.app}>
      <View styles={styles.container}>
        <View style={styles.headerFold}>
          <Image
            source={require('../assets/fold.png')}
            style={{width: 45, height: 45}}
          />
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              setChecklistTitle(prev => ({
                ...prev,
                isEdit: !prev.isEdit,
              }))
            }>
            <TextInput
              style={[
                styles.headerText,
                checklistTitle.isEdit && {backgroundColor: '#fff'},
              ]}
              editable={checklistTitle.isEdit}
              value={
                checklistTitle
                  ? checklistTitle.title
                  : 'No title for this checklist'
              }
              onChangeText={text =>
                setChecklistTitle(prev => ({
                  ...prev,
                  title: text,
                }))
              }
              onBlur={() => {
                if (checklistTitle.isEdit) {
                  editChecklistTitle(
                    selectedChecklist.id,
                    checklistTitle.title,
                  );
                  setChecklistTitle(prev => ({
                    ...prev,
                    isEdit: false,
                  }));
                }
              }}
            />
          </TouchableOpacity>
          <Pressable style={styles.floatingIcon} onPress={toggleMenu}>
            <Animated.Image
              source={require('../assets/addIcon.png')}
              style={[
                {
                  width: 25,
                  height: 25,
                  transform: [
                    {
                      scale: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                    {
                      rotate: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '45deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          </Pressable>
        </View>
        {children}
      </View>
    </View>
  );
}
