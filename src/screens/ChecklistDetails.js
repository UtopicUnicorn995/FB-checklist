import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import styles from '../styles/ChecklistItem.styles';
import {UserContext} from '../context/UserContext';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import {updateChecklistItem, uploadImage} from '../utils/firebaseServices';
import {AppContext} from '../context/AppContext';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Button from '../components/Button';
import {deleteChecklistItem} from '../utils/firebaseServices';

export default function ChecklistDetails({route}) {
  const {user} = useContext(UserContext);
  const {selectedChecklist} = useContext(AppContext);
  const {selectedChecklistId, initialItem} = route.params;
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigation = useNavigation();

  const checklistItemsArray = Array.isArray(selectedChecklist?.checklistItems)
    ? selectedChecklist.checklistItems
    : selectedChecklist?.checklistItems
    ? Object.entries(selectedChecklist.checklistItems).map(([id, item]) => ({
        id,
        ...item,
      }))
    : [];

  const item = checklistItemsArray.find(i => i.id === initialItem.id);

  const [editedDescription, setEditedDescription] = useState(
    item?.description || '',
  );
  const [editDetails, setEditDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedDescription(item?.description || '');
  }, [item?.description]);

  const launchedImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image piscker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUrl = response.uri || response.assets?.[0]?.uri;
        let imageFileName = response.uri || response.assets?.[0]?.fileName;
        console.log('selected image url1', imageUrl, imageFileName, user);

        const payload = {
          fileName: imageFileName,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
        };

        console.log('selected image url2', imageUrl, imageFileName);
        await uploadImage(selectedChecklist.id, item.id, payload, imageUrl);
      }
    });
  };

  const deleteItem = async () => {
    navigation.goBack();
    await deleteChecklistItem(selectedChecklist.id, item.id);
  };

  if (!item) {
    return (
      <AppLayout handleBack={navigation.goBack} title="Checklist Item">
        <View style={{padding: 20}}>
          <Text>Item not found.</Text>
        </View>
      </AppLayout>
    );
  }

  const handleCheckItem = async () => {
    try {
      setIsLoading(true);
      await updateChecklistItem(selectedChecklistId, item.id, {
        checked: !item.checked,
        checkedBy: user.username || "Unknown user",
        updatedAt: new Date().toISOString(),
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error checking item:', error.message);
    }
  };

  const handleEditDescription = async () => {
    try {
      Keyboard.dismiss();
      if (editedDescription !== item.description) {
        setIsLoading(true);
        await updateChecklistItem(selectedChecklistId, item.id, {
          description: editedDescription,
          updatedAt: new Date().toISOString(),
        });
        setIsLoading(false);
      }
      setEditDetails(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error editing description:', error.message);
    }
  };

  const handleBack = () => {
    console.log('bacckk1');
    setEditDetails(false);
    navigation.goBack();
    console.log('bacckk2');
  };

  const imageViewImages = item.images
    ? Object.values(item.images).map(img => ({uri: img.url}))
    : [];

  return (
    <AppLayout handleBack={handleBack} title={item?.title || 'Checklist Item'}>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator size="large" style={{marginTop: 20}} />
        ) : (
          <View style={[GlobalStyles.gap, GlobalStyles.paddingVertical]}>
            <View style={[GlobalStyles.gap, GlobalStyles.flexRow]}>
              <Text style={GlobalStyles.textPrimary}>Description:</Text>
              {editDetails ? (
                <FAIcon
                  onPress={handleEditDescription}
                  name="floppy-o"
                  size={22}
                  color={'#262626'}
                />
              ) : (
                <FAIcon5
                  onPress={() => setEditDetails(true)}
                  name="edit"
                  size={22}
                  color={'#262626'}
                />
              )}
            </View>

            {editDetails ? (
              <TextInput
                style={GlobalStyles.textInput}
                multiline={true}
                value={editedDescription}
                onChangeText={text => setEditedDescription(text)}
              />
            ) : (
              <Text style={GlobalStyles.textSecondary}>
                {item.description || 'No description'}
              </Text>
            )}
            <View style={styles.checklistItemImgContainer}>
              <Text style={GlobalStyles.textPrimary}>Photos:</Text>
              <View style={styles.galleryContainer}>
                {item?.images &&
                  Object.values(item.images).map((image, idx) => (
                    <Pressable
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        setSelectedImageIndex(idx);
                        setImageViewerVisible(true);
                      }}
                      key={image.imageId || idx}>
                      <ImageBackground
                        source={{uri: image.url}}
                        resizeMode="cover"
                        style={styles.imageBackground}
                      />
                    </Pressable>
                  ))}
                {(!item.images || Object.values(item.images).length < 2) && (
                  <Pressable onPress={launchedImage} style={styles.addImgBtn}>
                    <FAIcon5 size={30} color={'#262626'} name="plus" />
                  </Pressable>
                )}
              </View>
            </View>

            <Pressable
              onPress={handleCheckItem}
              style={[styles.itemChecklist, {gap: 10}]}>
              <Text style={GlobalStyles.textPrimary}>Task status:</Text>
              <View
                style={[styles.itemChecklist, {gap: item.checked ? 10 : 14}]}>
                <Image
                  source={
                    item.checked
                      ? require('../assets/checkedtrue.png')
                      : require('../assets/checkedfalse.png')
                  }
                  style={
                    item.checked
                      ? {width: 24, height: 20}
                      : {width: 20, height: 20}
                  }
                />
              </View>
            </Pressable>

            {item.checked && (
              <>
                <View
                  style={[
                    GlobalStyles.gap,
                    GlobalStyles.paddingVertical,
                    GlobalStyles.flexRow,
                    GlobalStyles.flex,
                    {flexWrap: 'wrap'},
                  ]}>
                  <Text style={GlobalStyles.textPrimary}>Checked date:</Text>
                  <Text style={[GlobalStyles.textPrimary, {flexWrap: 'wrap'}]}>
                    {convertDate(
                      item.updatedAt,
                      `{month} {day}, {year} {hour}:{minute} {ampm}`,
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    GlobalStyles.gap,
                    GlobalStyles.paddingVertical,
                    GlobalStyles.flexRow,
                  ]}>
                  <Text style={GlobalStyles.textPrimary}>Checked by:</Text>
                  <Text style={GlobalStyles.textPrimary}>{item.checkedBy}</Text>
                </View>
              </>
            )}
            <Button
              title="Delete Item"
              iconName="trash"
              onPress={deleteItem}
              btnStyleProp={{backgroundColor: '#f44336'}}
            />
          </View>
        )}
        <ImageView
          images={imageViewImages}
          imageIndex={selectedImageIndex}
          visible={imageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
        />
      </ScrollView>
    </AppLayout>
  );
}
