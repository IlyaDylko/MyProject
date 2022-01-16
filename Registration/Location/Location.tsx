import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';

import {Form} from '../components/Form';

import {setLocation} from 'Module/Registration/store';
import {createUserAction} from 'Module/Auth/store/authSlice';
import logger from 'Util/logger';
import {PrimaryButton} from 'Common';
import {rem, vrem} from 'Util/dimensions';
import {colors} from 'Util/constants/colors';
import {Icon} from 'Assets/images';
import {getUser} from 'Module/Profile/store/slices';

export function LocationScreen(): ReactElement {
  const dispatch = useDispatch();

  const proceedToNext = useCallback(async () => {
    await dispatch(createUserAction());
    await dispatch(getUser());
  }, [dispatch]);

  const getPermissions = useCallback(async () => {
    let granted = false;
    let permissionRequestResult = '';

    if (Platform.OS === 'android') {
      permissionRequestResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Nood Dating App Camera Permission',
        message: 'Nood Dating App needs access to your location data.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      granted = permissionRequestResult === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      permissionRequestResult = await Geolocation.requestAuthorization('always');

      granted = permissionRequestResult === 'granted';
    }

    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          dispatch(
            setLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            }),
          );
          proceedToNext();
        },
        error => {
          logger.error('getCurrentPosition', error);

          proceedToNext();
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000},
      );

      return;
    } else {
      proceedToNext();
    }
  }, [proceedToNext]);

  const onContinuePress = useCallback(() => {
    getPermissions();
  }, [getPermissions]);

  return (
    <Form title="Want to see people near you?" subTitle="Share your location">
      <Icon.PNG name="ModalSelection" style={styles.icon} />
      <View style={styles.container}>
        <PrimaryButton wrapperStyle={styles.mainButtonWrapper} onPress={onContinuePress} text="Continue" />
      </View>
    </Form>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleWrapper: {
    marginTop: vrem(32),
    marginBottom: vrem(40),
  },
  title: {
    fontSize: rem(32),
    color: colors.white,
    lineHeight: rem(38),
    letterSpacing: rem(-0.03),
    marginBottom: vrem(16),
  },
  button: {
    height: vrem(56),
    width: rem(313),
    backgroundColor: colors.background,
    marginBottom: vrem(1),
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: rem(16),
    fontWeight: '400',
  },
  icon: {
    alignSelf: 'center',
    width: 375,
    height: 261,
  },
  hint: {
    fontSize: rem(14),
    color: colors.dotColor,
    lineHeight: vrem(21),
    fontWeight: 'normal',
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
});
