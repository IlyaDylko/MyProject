import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {selectRegistration} from '../store/registrationSelectors';
import {Form} from '../components/Form';

import {genderData as elements} from 'Util/constants/registrationData';
import {PrimaryButton, Select, Text} from 'Common';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {rem, vrem} from 'Util/dimensions';
import {setGender} from 'Module/Registration/store/registrationSlice';
import {colors} from 'Util/constants/colors';

export function GenderScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {gender} = useSelector(selectRegistration);
  const currentIndex = elements.findIndex(element => element === gender);
  const onGenderChoose = useCallback(index => {
    dispatch(setGender(elements[index]));
  }, []);
  const onContinuePress = useCallback(() => {
    navigation.navigate(NAVIGATION_ROUTES.PREFER);
  }, []);

  return (
    <Form title="What is your gender?" onSkip={onContinuePress}>
      <View>
        {elements.map((item, index) => (
          <Select
            style={currentIndex === index ? {backgroundColor: colors.main} : {}}
            key={index}
            onPress={() => onGenderChoose(index)}>
            <Text style={styles.buttonText} text={item} />
          </Select>
        ))}
      </View>
      {gender && (
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
    width: 24,
    height: 24,
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
  buttonWrapper: {flex: 1, justifyContent: 'flex-end'},
});
