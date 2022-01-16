import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Form} from '../components/Form';
import {selectRegistration, setPrefer} from '../store';

import {PrimaryButton, Select, Text} from 'Common';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {rem, vrem} from 'Util/dimensions';
import {preferData as elements} from 'Util/constants/registrationData';
import {colors} from 'Util/constants/colors';

export function PreferScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {prefer} = useSelector(selectRegistration);

  const onSelect = (item: string) => {
    dispatch(setPrefer(item));
  };
  const onContinuePress = useCallback(() => {
    navigation.navigate(NAVIGATION_ROUTES.PLEASURE);
  }, []);

  return (
    <Form title="Who are you looking for?" onSkip={onContinuePress}>
      <View>
        {elements.map((item, index) => (
          <Select
            style={prefer.indexOf(item) > -1 ? {backgroundColor: colors.main} : {}}
            key={index}
            onPress={() => onSelect(item)}>
            <Text style={styles.buttonText} text={item} />
          </Select>
        ))}
      </View>
      {prefer?.length > 0 && (
        <View style={styles.buttonWrapper}>
          <PrimaryButton wrapperStyle={styles.mainButtonWrapper} onPress={onContinuePress} text="Continue" />
        </View>
      )}
    </Form>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
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
    width: 24,
    height: 24,
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
});
