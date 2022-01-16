import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {Image, Pressable, ScrollView} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PhotoEditorModal} from 'react-native-photoeditorsdk';
import {useDispatch, useSelector} from 'react-redux';

import {Form} from '../components/Form';
import {deletePhoto, replacePhoto, selectRegistration, setPhoto} from '../store';
import styles from './styles';

import {photoEditorConfig} from 'Util/constants/photoEditorConfig';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {ActionSheet, PrimaryButton} from 'Common';
import {Icon} from 'Assets/images';

export function PhotoScreen(): ReactElement {
  const navigation = useNavigation();
  const photosTemplate = ['', '', '', ''];
  const dispatch = useDispatch();
  const {photos} = useSelector(selectRegistration);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(photos[currentPhotoIndex]);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [isEditActionSheetVisible, setEditActionSheetVisible] = useState(false);
  const [photoEditorVisible, setPhotoEditorVisible] = useState(false);

  useEffect(() => {
    setCurrentPhoto(photos[currentPhotoIndex]);
  }, [currentPhotoIndex, photos]);

  const onActionSheetSelection = useCallback(
    async (index: number) => {
      if (index === 0) {
        ImagePicker.openCamera({})
          .then(image => {
            dispatch(setPhoto(image.path));
            setCurrentPhoto(image.path);
            setPhotoEditorVisible(true);
          })
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              return false;
            }
          });
      } else {
        ImagePicker.openPicker({})
          .then(image => {
            dispatch(setPhoto(image.path));
            setCurrentPhoto(image.path);
            setPhotoEditorVisible(true);
          })
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              return false;
            }
          });
      }
    },
    [dispatch],
  );
  const onEditActionSheetSelection = useCallback(
    (index: number) => {
      if (index === 0) {
        // "Edit this photo"
        setPhotoEditorVisible(true);
      } else {
        // "Delete"
        dispatch(deletePhoto(photos[currentPhotoIndex]));
        setEditActionSheetVisible(false);
      }
    },
    [currentPhotoIndex, dispatch, photos],
  );
  const onEditPress = (index: React.SetStateAction<number>) => {
    setCurrentPhotoIndex(index);
    setEditActionSheetVisible(true);
  };
  const onContinuePress = () => {
    navigation.navigate(NAVIGATION_ROUTES.SPECIFY_NAME);
  };

  const onPhotoEditorExport = useCallback(
    result => {
      const newPhoto = result.image;
      const currentPhoto = photos[currentPhotoIndex];
      if (currentPhoto) {
        dispatch(replacePhoto([currentPhoto, newPhoto]));
      } else {
        dispatch(setPhoto(newPhoto));
      }
      setPhotoEditorVisible(false);
      setEditActionSheetVisible(false);
      setActionSheetVisible(false);
    },
    [currentPhotoIndex, dispatch, photos],
  );
  const onPhotoEditorCancel = useCallback(() => {
    setPhotoEditorVisible(false);
    setEditActionSheetVisible(false);
    setActionSheetVisible(false);
  }, []);
  const add = useCallback(index => {
    setCurrentPhotoIndex(index);
    setActionSheetVisible(true);
  }, []);

  return (
    <Form title="Let's create your amazing profile! Upload your photos." subTitle="Upload a minimum of 2 photos">
      <PhotoEditorModal
        configuration={photoEditorConfig}
        onExport={onPhotoEditorExport}
        onCancel={onPhotoEditorCancel}
        visible={photoEditorVisible}
        image={currentPhoto}
      />
      <ScrollView bounces={false} horizontal={true} showsHorizontalScrollIndicator={false}>
        {photosTemplate.map((template, index) => {
          if (photos[index] === undefined) {
            return (
              <Pressable key={index} onPress={() => add(index)} style={styles.itemWrapper}>
                <Icon.SVG name={'Add'} style={styles.icon} />
              </Pressable>
            );
          } else {
            return (
              <Pressable key={index} onPress={() => onEditPress(index)} style={styles.itemWrapper}>
                <Image source={{uri: photos[index]}} style={styles.image} />
              </Pressable>
            );
          }
        })}
      </ScrollView>
      {photos.length === 1 && (
        <PrimaryButton
          wrapperStyle={styles.buttonWrapper}
          onPress={() => setActionSheetVisible(true)}
          text="Upload 1 more photo"
        />
      )}
      {photos.length > 1 && (
        <PrimaryButton wrapperStyle={styles.buttonWrapper} onPress={onContinuePress} text="Continue" />
      )}
      <ActionSheet
        visible={isActionSheetVisible}
        onCancel={() => setActionSheetVisible(false)}
        options={['Take a shot', 'Choose from gallery']}
        onSelection={onActionSheetSelection}
      />
      <ActionSheet
        visible={isEditActionSheetVisible}
        onCancel={() => setEditActionSheetVisible(false)}
        options={['Edit this photo', 'Delete']}
        onSelection={onEditActionSheetSelection}
      />
    </Form>
  );
}
