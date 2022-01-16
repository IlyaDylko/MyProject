import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {selectRegistration} from '../store/registrationSelectors';
import {Form} from '../components/Form';

import {Icon} from 'Assets/images';
import {PrimaryButton, Select, Text} from 'Common';
import {Picker} from 'Common/components/picker';
import {setHeight} from 'Module/Registration/store/registrationSlice';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {rem, vrem} from 'Util/dimensions';
import {heightData} from 'Util/constants/registrationData';
import {colors} from 'Util/constants/colors';

export function AppearanceScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const {height: bodyHeight, bodyType} = useSelector(selectRegistration);
  const valueIndex = heightData.findIndex(item => item === bodyHeight);
  const [chosenItemIndex, setChosenItemIndex] = useState(valueIndex && valueIndex !== -1 ? valueIndex : 0);

  const onHeightSelect = useCallback(
    index => {
      setChosenItemIndex(index);
      dispatch(setHeight(heightData[index]));
    },
    [dispatch],
  );
  const onContinuePress = () => {
    navigation.navigate(NAVIGATION_ROUTES.GENDER);
  };

  return (
    <Form title="Appearance" onSkip={onContinuePress}>
      <>
        <Select style={isPickerVisible ? styles.selectedButton : {}} onPress={() => setIsPickerVisible(true)}>
          <Text style={styles.buttonText} text={'Height'} />
          <Text style={[styles.buttonSubText, bodyHeight ? styles.selectedButtonText : {}]} text={bodyHeight + ' ft'} />
        </Select>
        <Select onPress={() => navigation.navigate(NAVIGATION_ROUTES.BODY_TYPE)}>
          <Text style={styles.buttonText} text={'Body type'} />
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.buttonSubText, bodyHeight ? styles.selectedButtonText : {}]} text={bodyType || ''} />
            <Icon.SVG name={'Forward'} style={styles.icon} />
          </View>
        </Select>
      </>
      <Picker
        visible={isPickerVisible}
        onCancel={() => setIsPickerVisible(false)}
        onSelection={onHeightSelect}
        chosenItemIndex={chosenItemIndex}
        data={heightData}
      />
      {bodyHeight && bodyType && (
        <View style={styles.buttonWrapper}>
          <PrimaryButton wrapperStyle={styles.mainButtonWrapper} onPress={onContinuePress} text="Continue" />
        </View>
      )}
    </Form>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    marginLeft: rem(16),
    fontWeight: '400',
  },
  buttonSubText: {
    color: colors.dotColor,
    marginLeft: rem(16),
    fontWeight: '400',
  },
  icon: {
    height: 24,
    marginLeft: rem(15),
  },
  selectedButton: {
    borderWidth: rem(1),
    borderColor: colors.main,
  },
  selectedButtonText: {
    color: colors.main,
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
  buttonWrapper: {flex: 1, justifyContent: 'flex-end'},
});
